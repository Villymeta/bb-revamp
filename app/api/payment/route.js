import { Connection, PublicKey } from "@solana/web3.js";
import { createClient } from "@supabase/supabase-js";

// 🔗 Solana + Supabase setup
const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
const walletAddress = new PublicKey("Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("ref");
  if (!reference)
    return new Response(JSON.stringify({ error: "Missing order reference" }), { status: 400 });

  try {
    // 1️⃣ Fetch last 10 transactions for your wallet
    const signatures = await connection.getSignaturesForAddress(walletAddress, { limit: 10 });
    const confirmedTxs = await Promise.all(
      signatures.map((sig) =>
        connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
      )
    );

    // 2️⃣ Look for your reference inside the memo field
    const match = confirmedTxs.find((tx) =>
      tx?.transaction?.message?.instructions?.some(
        (ix) =>
          ix?.parsed?.type === "memo" &&
          typeof ix.parsed === "object" &&
          JSON.stringify(ix.parsed).includes(reference)
      )
    );

    // 3️⃣ If match found → mark as paid + email receipt
    if (match) {
      console.log("✅ Payment detected for reference:", reference);

      await supabase
        .from("orders")
        .update({ payment_status: "Paid" })
        .eq("reference", reference);

      await supabase
        .from("receipts")
        .update({ payment_status: "Paid" })
        .eq("reference", reference);

      // Send receipt email (no links)
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      return Response.json({ paid: true });
    }

    // 4️⃣ If no match found → unpaid
    return Response.json({ paid: false });
  } catch (err) {
    console.error("❌ Payment check error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}