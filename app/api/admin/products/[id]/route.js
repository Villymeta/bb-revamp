// app/api/admin/products/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const { name, price, status, image, stock_by_size } = body;

    const updates = {};
    if (typeof name !== "undefined") updates.name = name;
    if (typeof price !== "undefined") updates.price = price;
    if (typeof status !== "undefined") updates.status = status;
    if (typeof image !== "undefined") updates.image = image;
    if (typeof stock_by_size !== "undefined") updates.stock_by_size = stock_by_size;

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Unable to update product" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error in PATCH /api/admin/products/[id]:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}