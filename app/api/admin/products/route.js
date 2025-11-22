// app/api/admin/products/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error loading products:", error);
      return NextResponse.json(
        { error: "Unable to load products" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/admin/products:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, price, status, image, stock_by_size } = body;

    if (!name || typeof price === "undefined") {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        name,
        price,
        status: status || "Active",
        image: image || null,
        stock_by_size: stock_by_size ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error inserting product:", error);
      return NextResponse.json(
        { error: "Unable to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/admin/products:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}