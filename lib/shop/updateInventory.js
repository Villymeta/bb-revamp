import { supabase } from "../supabaseClient";

/**
 * Safely updates stock_by_size in products and logs change to inventory_logs.
 * Handles both multi-size items and one-size (OS) products like beanies.
 */
export async function updateInventoryAfterCheckout(bagItems, reference) {
  try {
    for (const item of bagItems) {
      const { id, name, qty } = item;
      const size = item.size || "OS"; // 🟢 Default size fallback

      // 1️⃣ Fetch the product from Supabase
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("id, stock_by_size")
        .eq("name", name)
        .single();

      if (fetchError || !product) {
        console.warn(`⚠️ Product not found in Supabase: ${name}`);
        continue;
      }

      const stockData = product.stock_by_size || {};

      // Ensure size key exists
      const currentStock = Number(stockData[size]) || 0;
      const newStock = Math.max(currentStock - qty, 0);
      stockData[size] = newStock;

      // 2️⃣ Update product stock_by_size
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_by_size: stockData })
        .eq("id", product.id);

      if (updateError) throw updateError;

      // 3️⃣ Log inventory change
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

      console.log(`✅ Updated ${name} [${size}] → new stock: ${newStock}`);
    }
  } catch (err) {
    console.error("❌ Inventory update error:", err);
  }
}