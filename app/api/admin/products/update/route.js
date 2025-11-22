import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const { id, stockBySize, status } = body;

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const update = {};
  if (stockBySize) update.stockBySize = stockBySize;
  if (typeof status === "string") update.status = status;

  const { error } = await supabaseAdmin
    .from("products")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("Error updating product", error);
    return new NextResponse("Error updating product", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}