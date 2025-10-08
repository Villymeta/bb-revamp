"use client";

import { useState, useEffect, useRef } from "react";
import { useBag } from "@/lib/shop/BagContext";
import { supabase } from "@/lib/supabaseClient";
import { updateInventoryAfterCheckout } from "@/lib/shop/updateInventory";

export default function CheckoutPage() {
  const { bag, clearBag } = useBag();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wallet: "",
    x_handle: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    delivery_method: "Shipping",
  });

  const [loading, setLoading] = useState(false);
  const addressRef = useRef(null);

  // ✅ Initialize Google Maps Autocomplete only for Shipping
  useEffect(() => {
    if (formData.delivery_method !== "Shipping") return;

    const interval = setInterval(() => {
      if (window.google && window.google.maps && addressRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const components = place.address_components || [];

          const get = (type) =>
            components.find((comp) => comp.types.includes(type))?.long_name || "";

          setFormData((prev) => ({
            ...prev,
            address: `${get("street_number")} ${get("route")}`.trim(),
            city: get("locality"),
            state: get("administrative_area_level_1"),
            zip: get("postal_code"),
            country: get("country"),
          }));
        });

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [formData.delivery_method]);

  // Totals
  const baseTotal = bag.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingFee = formData.delivery_method === "Shipping" ? 10 : 0;
  const subtotal = baseTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bag.length === 0) return alert("Your bag is empty.");

    // 🧠 Validate required fields dynamically
    const requiredFields =
      formData.delivery_method === "Shipping"
        ? ["name", "email", "wallet", "address", "city", "state", "zip", "country"]
        : ["name", "email", "wallet"];

    for (const key of requiredFields) {
      if (!formData[key]) {
        alert(`Please fill out the ${key.replace("_", " ")} field.`);
        return;
      }
    }

    setLoading(true);
    const reference = crypto.randomUUID();

    try {
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("*")
        .eq("email", formData.email)
        .single();

      let customerId = existingCustomer?.id;
      if (!customerId) {
        const { data: newCustomer, error: custErr } = await supabase
          .from("customers")
          .insert([
            {
              name: formData.name,
              email: formData.email,
              wallet: formData.wallet,
            },
          ])
          .select()
          .single();

        if (custErr) throw custErr;
        customerId = newCustomer.id;
      }

      const orderPayload = {
        items: bag,
        total: subtotal,
        customer_email: formData.email,
        customer_name: formData.name,
        wallet_address: formData.wallet,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        delivery_method: formData.delivery_method,
        payment_status: "Pending",
        reference,
        customer_id: customerId,
      };

      const { error: orderErr } = await supabase.from("orders").insert([orderPayload]);
      if (orderErr) throw orderErr;

      await supabase.from("receipts").insert([
        {
          reference,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_wallet: formData.wallet,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          item_json: bag,
          total_amount: subtotal,
          delivery_method: formData.delivery_method,
          extra: formData.x_handle ? `X: ${formData.x_handle}` : null,
        },
      ]);

      await updateInventoryAfterCheckout(bag, reference);
      clearBag();
      window.location.href = `/success?ref=${reference}`;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("There was an issue submitting your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {/* 🧾 Shipping Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-[#F8E49F] text-black p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4">
            {formData.delivery_method === "Shipping"
              ? "Shipping Information"
              : "Pickup Information"}
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 rounded border"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="Wallet Address (required)"
            value={formData.wallet}
            onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
            className="w-full p-2 rounded border"
            required
          />
          <input
            type="text"
            placeholder="X (Twitter) Account (optional)"
            value={formData.x_handle}
            onChange={(e) => setFormData({ ...formData, x_handle: e.target.value })}
            className="w-full p-2 rounded border"
          />

          {/* 🏠 Conditional address section */}
          {formData.delivery_method === "Shipping" && (
            <>
              <input
                type="text"
                placeholder="Street Address"
                ref={addressRef}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 rounded border"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 rounded border"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 rounded border"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full p-2 rounded border"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 rounded border"
                  required
                />
              </div>
            </>
          )}

          <select
            value={formData.delivery_method}
            onChange={(e) =>
              setFormData({ ...formData, delivery_method: e.target.value })
            }
            className="w-full p-2 rounded border"
          >
            <option value="Shipping">Shipping (+$10)</option>
            <option value="Pickup">Pickup (Free)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-[#F8E49F] font-bold py-3 rounded-xl mt-4 hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </form>

        {/* 🛍️ Order Summary */}
        <div className="bg-[#F8E49F] text-black p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {bag.length === 0 ? (
            <p>Your bag is empty.</p>
          ) : (
            <>
              <ul className="divide-y">
                {bag.map((item, i) => (
                  <li key={i} className="py-3 flex justify-between">
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold mt-4 flex justify-between">
                <span>Subtotal:</span>
                <span>${baseTotal.toFixed(2)}</span>
              </div>
              {formData.delivery_method === "Shipping" && (
                <div className="mt-2 flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>$10.00</span>
                </div>
              )}
              <div className="mt-4 font-extrabold flex justify-between text-lg border-t pt-2">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}