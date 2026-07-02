import { supabase } from "../supabaseClient";

// 🧮 Calculate subtotal
export const calculateSubtotal = (bag) =>
  bag.reduce((acc, item) => acc + item.price * item.qty, 0);

// 🔍 Find item index in bag
export const findItemIndex = (bag, item) =>
  bag.findIndex((i) => i.id === item.id && i.size === item.size);

/**
 * 🧾 Log a completed order to Supabase
 * Called after checkout confirmation
 */
export async function logOrderReceipt(order) {
  try {
    const { reference, email, wallet, delivery, total, items, address } = order;

    const { error } = await supabase.from("orders").insert([
      {
        reference,
        customer_email: email,
        wallet_address: wallet,
        delivery_method: delivery,
        total_amount: total,
        items,
        shipping_address: address,
      },
    ]);

    if (error) throw error;
    console.log("✅ Order successfully logged:", reference);
  } catch (err) {
    console.error("❌ Error logging order:", err.message);
  }
}