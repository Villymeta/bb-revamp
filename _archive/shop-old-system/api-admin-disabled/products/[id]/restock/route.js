// app/api/admin/products/[id]/restock/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const RESTOCK_AMOUNT = 5;

export async function POST(_req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });
  }

  try {
    // get current stock_by_size
    const { data: product, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("id, stock_by_size")
      .eq("id", id)
      .single();

    if (fetchErr || !product) {
      console.error("Product not found for restock:", fetchErr);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const currentStock = product.stock_by_size || {};
    const updatedStock = {};

    for (const [size, qty] of Object.entries(currentStock)) {
      updatedStock[size] = Number(qty || 0) + RESTOCK_AMOUNT;
    }

    // if no sizes, nothing to restock (but we won't error)
    const { data: updated, error: updateErr } = await supabaseAdmin
      .from("products")
      .update({ stock_by_size: updatedStock })
      .eq("id", id)
      .select("*")
      .single();

    if (updateErr) {
      console.error("Error updating product stock:", updateErr);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("Unexpected restock error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}