// app/api/admin/orders/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req, { params }) {
  const { id } = params;

  try {
    const { status = "fulfilled" } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: status, // or "status" depending on your column
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase order update error:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: "Server error updating order" },
      { status: 500 }
    );
  }
}