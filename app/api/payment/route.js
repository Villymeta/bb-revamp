// app/api/payment/check/route.js   (adjust path if different)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

// --- helpers (server vars + lazy init) ---
function getSupabaseServer(readWrite = 'anon') {
  const url = process.env.SUPABASE_URL;
  const key =
    readWrite === 'service'
      ? process.env.SUPABASE_SERVICE_ROLE
      : process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase environment variables are missing');
  return createClient(url, key);
}

function getSolanaConnection() {
  const endpoint =
    process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  return new Connection(endpoint, 'confirmed');
}

const STORE_WALLET = new PublicKey(
  process.env.SOL_WALLET ||
    'Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ' // fallback to your current
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('ref');
  if (!reference) {
    return NextResponse.json({ error: 'Missing order reference' }, { status: 400 });
  }

  try {
    const connection = getSolanaConnection();

    // 1) Pull recent signatures for the store wallet
    const signatures = await connection.getSignaturesForAddress(STORE_WALLET, {
      limit: 20, // a little more headroom
    });

    // 2) Load parsed txs (skip nulls)
    const parsed = await Promise.all(
      signatures.map(sig =>
        connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        })
      )
    );

    // 3) Find memo that includes your reference (spl-memo)
    const hasMatch = parsed.some(tx =>
      tx?.transaction?.message?.instructions?.some(ix => {
        // ix.program === 'spl-memo' is common; parsed.type === 'memo' on many RPCs
        const isMemo =
          ix?.program === 'spl-memo' ||
          ix?.parsed?.type === 'memo' ||
          ix?.programId?.toString?.() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';

        if (!isMemo) return false;

        // Different RPCs shape 'parsed' differently; stringify to be robust
        const blob = typeof ix?.parsed === 'object' ? JSON.stringify(ix.parsed) : String(ix?.parsed || '');
        return blob.includes(reference);
      })
    );

    if (!hasMatch) {
      return NextResponse.json({ paid: false });
    }

    // 4) Mark paid in DB (server credentials)
    const supabase = getSupabaseServer('service');

    const { error: ordersErr } = await supabase
      .from('orders')
      .update({ payment_status: 'Paid' })
      .eq('reference', reference);

    const { error: receiptsErr } = await supabase
      .from('receipts')
      .update({ payment_status: 'Paid' })
      .eq('reference', reference);

    if (ordersErr || receiptsErr) {
      console.error('Supabase update error', ordersErr || receiptsErr);
      // Still return paid, but surface a note
    }

    // 5) Trigger email receipt using absolute origin from the request
    const origin = req.nextUrl?.origin || process.env.SITE_URL;
    if (!origin) {
      console.warn('SITE_URL not set; skipping email trigger');
    } else {
      await fetch(`${origin}/api/payment/email-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
        // Avoid caching on platforms that might cache fetches
        cache: 'no-store',
      }).catch(e => console.warn('Email trigger failed:', e));
    }

    return NextResponse.json({ paid: true });
  } catch (err) {
    console.error('Payment check error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}