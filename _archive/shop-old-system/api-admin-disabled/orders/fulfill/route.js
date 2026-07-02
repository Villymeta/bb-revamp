// app/api/admin/orders/fulfill/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import nodemailer from "nodemailer";

// --- email helper (unchanged) ---
async function sendFulfillmentEmail(order) {
  if (!order?.customer_email) return;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    console.warn("Email env vars missing, skipping fulfillment email.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const itemsSummary = Array.isArray(order.items)
    ? order.items
        .map((it) => {
          const base = `${it.qty || 1}× ${it.name || ""}`;
          const size = it.size ? ` (${it.size})` : "";
          return base + size;
        })
        .join("\n")
    : "";

  const mailOptions = {
    from: EMAIL_FROM,
    to: order.customer_email,
    subject: `Your Beanies on Business order ${order.reference} is fulfilled ✅`,
    text: `Hey ${order.customer_name || ""},

Your order has been marked as fulfilled and is being prepared.

Order ref: ${order.reference || "—"}
Total: $${order.total ?? ""}

Items:
${itemsSummary || "(no item details stored)"}

Thank you for supporting Beanies on Business & Doginal Dogs.

— Beanies on Business Crew`,
  };

  await transporter.sendMail(mailOptions);
}

// --- NEW: helper to decrement stock based on *product name* ---
async function decrementInventoryForOrder(order) {
  if (!order.items) return;

  let items = order.items;

  // In your DB this might be stored as a JSON string; handle both.
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch (err) {
      console.error("Failed to parse order.items", err);
      return;
    }
  }

  if (!Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    const productName = item.name;
    const size = item.size;
    const qty = item.qty || 1;

    if (!productName || !size) continue;

    // 1️⃣ Find product row by name
    const { data: product, error: findErr } = await supabaseAdmin
      .from("products")
      .select("id, stock_by_size")
      .eq("name", productName)
      .single();

    if (findErr || !product) {
      console.error(`Product not found for name: ${productName}`, findErr);
      continue;
    }

    // 2️⃣ Call your RPC to decrement the stock for that size
    const { error: rpcErr } = await supabaseAdmin.rpc("decrement_stock", {
      p_product_id: product.id,
      p_size: size,
      p_amount: qty,
    });

    if (rpcErr) {
      console.error(
        `Failed to decrement stock for ${productName} size ${size}`,
        rpcErr
      );
    }
  }
}

export async function POST(req) {
  try {
    const { id, fulfilled } = await req.json();

    if (!id || typeof fulfilled === "undefined") {
      return NextResponse.json(
        { error: "Missing id or fulfilled flag" },
        { status: 400 }
      );
    }

    // 1️⃣ Get current order to know previous fulfilled state
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !currentOrder) {
      console.error("Error fetching current order:", fetchError);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2️⃣ Update fulfilled flag
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ fulfilled })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase error updating order:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // 3️⃣ If going from NOT fulfilled → fulfilled, update inventory + email
    const wasPreviouslyFulfilled = !!currentOrder.fulfilled;
    if (!wasPreviouslyFulfilled && fulfilled) {
      try {
        await decrementInventoryForOrder(data);
      } catch (invErr) {
        console.error("Error decrementing inventory:", invErr);
      }

      try {
        await sendFulfillmentEmail(data);
      } catch (emailErr) {
        console.error("Error sending fulfillment email:", emailErr);
      }
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error in fulfill route:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}