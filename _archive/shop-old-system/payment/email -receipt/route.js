// app/api/payment/email-receipt/route.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // required for pdfkit + nodemailer on Vercel

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

function getSupabaseServer(readWrite = 'anon') {
  const url = process.env.SUPABASE_URL; // server-side var
  const key =
    readWrite === 'service'
      ? process.env.SUPABASE_SERVICE_ROLE // server-side var
      : process.env.SUPABASE_ANON_KEY;    // server-side var

  if (!url || !key) {
    throw new Error('Supabase environment variables are missing');
  }
  return createClient(url, key);
}

export async function POST(req) {
  try {
    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    // Use service key only if this route needs privileged access
    const supabase = getSupabaseServer('service');

    // 🔍 Fetch order + customer info
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('reference', reference)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // If order.items was stored as text, parse it:
    if (typeof order.items === 'string') {
      try { order.items = JSON.parse(order.items); } catch {}
    }

    // 🧾 Generate PDF receipt
    const pdfBuffer = await generateBOBReceiptPDF(order);

    // 📧 Setup secure mail transport (use an App Password for Gmail)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📨 Send confirmation email
    await transporter.sendMail({
      from: `"Beanies On Business" <${process.env.SMTP_EMAIL}>`,
      to: order.customer_email,
      subject: `Payment Confirmed – Beanies On Business Receipt`,
      text: getEmailText(order),
      html: getEmailHTML(order),
      attachments: [
        {
          filename: `BOB_Receipt_${reference}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error('Email error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function getEmailText(order) {
  return `
Hi ${order.customer_name},

Your payment has been confirmed on Solana.

Attached is your official Beanies On Business receipt.
You can verify your payment using the following reference:

Reference: ${order.reference}
SOL Wallet: ${order.wallet_address}
Total: $${Number(order.total).toFixed(2)}

Thank you for supporting the B.O.B community!

– Beanies On Business Team
`.trim();
}

// 🧾 Generate Beanies On Business PDF
async function generateBOBReceiptPDF(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Background
    doc.rect(0, 0, 612, 792).fill('#F8E49F');
    doc.fillColor('black');

    // Header
    doc.font('Helvetica-Bold').fontSize(24).text('Beanies On Business', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).text('Official Order Receipt', { align: 'center' });
    doc.moveDown(2);

    // Order Info
    doc.font('Helvetica').fontSize(12);
    doc.text(`Customer: ${order.customer_name}`);
    doc.text(`Email: ${order.customer_email}`);
    doc.text(`SOL Wallet: ${order.wallet_address}`);
    doc.text(`Order Reference: ${order.reference}`);
    doc.text(`Payment Status: ${order.payment_status}`);
    doc.moveDown(1);

    // Items
    doc.font('Helvetica-Bold').text('Items Ordered:');
    doc.font('Helvetica');
    (order.items || []).forEach((item) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.price) || 0;
      doc.text(`• ${item.name} × ${qty} — $${(price * qty).toFixed(2)}`);
    });

    doc.moveDown(1);
    const total = Number(order.total) || 0;
    doc.font('Helvetica-Bold').text(`Total: $${total.toFixed(2)}`);
    doc.moveDown(2);

    doc.font('Helvetica-Oblique')
      .fontSize(10)
      .text('Thank you for supporting builders, creators, and community. – Beanies On Business', {
        align: 'center',
      });

    doc.end();
  });
}

// 💛 Branded HTML email
function getEmailHTML(order) {
  const total = Number(order.total) || 0;
  return `
  <div style="background-color:#F8E49F; color:#000; font-family:Helvetica,Arial,sans-serif; padding:24px; border-radius:12px; max-width:600px; margin:auto;">
    <h1 style="text-align:center; font-size:22px; font-weight:bold;">🧾 Payment Confirmed</h1>
    <p style="text-align:center; margin-bottom:20px;">Your Beanies On Business order has been successfully processed.</p>
    
    <div style="background:#fff; border-radius:10px; padding:16px; margin-bottom:20px;">
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>SOL Wallet:</strong> ${order.wallet_address}</p>
      <p><strong>Order Reference:</strong> ${order.reference}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    </div>

    <p style="font-size:14px; text-align:center;">
      The official Beanies On Business receipt is attached to this email.<br>
      You can verify your transaction on-chain manually using the reference above.
    </p>

    <p style="font-size:13px; text-align:center; margin-top:20px;">
      Stay humble. Stay building.<br>
      <strong>– Beanies On Business Team</strong>
    </p>
  </div>
  `;
}