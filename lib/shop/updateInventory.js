import { supabase } from "../supabaseClient";

/**
 * Updates stock_by_size in products and logs change to inventory_logs
 */
export async function updateInventoryAfterCheckout(bagItems, reference) {
  try {
    for (const item of bagItems) {
      const { id, size, qty } = item;

      // 1️⃣ Get current stock for this product
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("id, stock_by_size")
        .eq("name", item.name)
        .single();

      if (fetchError || !product) {
        console.warn("⚠️ Product not found in Supabase:", item.name);
        continue;
      }

      const stockData = product.stock_by_size || {};
      const currentStock = stockData[size] || 0;
      const newStock = Math.max(currentStock - qty, 0);

      // 2️⃣ Update product stock
      stockData[size] = newStock;
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_by_size: stockData })
        .eq("id", product.id);

      if (updateError) throw updateError;

      // 3️⃣ Insert log into inventory_logs
      const { error: logError } = await supabase.from("inventory_logs").insert([
        {
          product_id: product.id,
          size,
          change: -qty,
          new_stock: newStock,
          reason: "Checkout Purchase",
          reference,
        },
      ]);

      if (logError) throw logError;
    }
  } catch (err) {
    console.error("❌ Inventory update error:", err);
  }
}