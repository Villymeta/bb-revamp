"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("ref");

  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  const walletAddress = "Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!reference) return;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("reference", reference)
        .single();

      if (!error && data) setOrder(data);
    };
    fetchOrder();
  }, [reference]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!reference) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Missing order reference.</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your order details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto bg-[#F8E49F] text-black rounded-2xl p-8 shadow-2xl space-y-8">
        {/* 💰 Payment Section */}
        <section className="text-center border-b border-black/20 pb-6">
          <h2 className="text-2xl font-extrabold mb-3">Complete Your Payment</h2>
          <p className="text-gray-700 mb-2">
            Please send the{" "}
            <strong>grand total of ${order.total.toFixed(2)}</strong> to the
            following wallet address to complete your order:
          </p>

          {/* Wallet Address Section */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
            <div
              className="wallet-address bg-black text-[#F8E49F] px-4 py-2 rounded-lg font-mono text-sm tracking-wide max-w-full sm:max-w-[90%] overflow-x-auto whitespace-pre-wrap break-all scrollbar-hide"
              style={{
                wordBreak: "break-all",
                overflowWrap: "anywhere",
                whiteSpace: "normal",
              }}
            >
              {walletAddress}
            </div>
            <button
              onClick={handleCopy}
              className="bg-black text-[#F8E49F] px-4 py-2 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-transform"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-gray-700 mt-3 text-sm">
            💡 <strong>Tip:</strong> Please include your order reference{" "}
            <span className="font-mono bg-white/40 px-2 py-1 rounded">
              {reference}
            </span>{" "}
            in the transaction memo.
          </p>
        </section>

        {/* ✅ Order Confirmation */}
        <section>
          <h1 className="text-3xl font-bold text-center mb-4">Order Confirmed!</h1>
          <p className="text-center text-gray-700 mb-6">
            Thank you,{" "}
            <strong>{order.customer_name?.split(" ")[0] || "Customer"}</strong>! Your
            order has been successfully placed.
          </p>

          <div className="space-y-2 text-sm">
            <p><strong>Reference:</strong> {order.reference}</p>
            <p><strong>Customer Email:</strong> {order.customer_email}</p>
            <p><strong>Wallet:</strong> {order.wallet_address}</p>
            <p><strong>Delivery Method:</strong> {order.delivery_method}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          </div>

          <hr className="my-4 border-black/20" />

          <h3 className="font-bold mb-2">Items Ordered</h3>
          <ul className="space-y-1">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between border-b border-black/10 pb-1">
                <span>{item.name} × {item.qty}</span>
                <span>${(item.price * item.qty).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="font-bold mb-1">Shipping Address</h3>
            <p className="text-sm text-gray-800">
              {[
                order.address, order.city, order.state, order.zip, order.country
              ].filter(Boolean).join(", ")}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Link
              href="/shop"
              className="bg-black text-[#F8E49F] font-bold px-6 py-3 rounded-xl hover:brightness-110"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 flex items-center gap-2"
            >
              Download Receipt
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}