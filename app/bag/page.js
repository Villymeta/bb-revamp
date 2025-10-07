"use client";

import { useBag } from "@/lib/shop";
import Link from "next/link";

export default function BagPage() {
  const { bag, removeFromBag, subtotal, clearBag } = useBag();

  if (!bag.length)
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Bag is Empty 👜</h1>
        <Link
          href="/shop"
          className="bg-bobyellow text-black px-5 py-2 rounded-lg font-bold"
        >
          Continue Shopping
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Your Bag</h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {bag.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-zinc-900 rounded-lg p-4 border border-zinc-700"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-400">Qty: {item.qty}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-semibold">${item.price * item.qty}</p>
              <button
                onClick={() => removeFromBag(item.id, item.size)}
                className="text-red-400 hover:text-red-200"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 text-right">
        <p className="text-xl font-semibold mb-2">
          Subtotal: ${subtotal.toFixed(2)}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={clearBag}
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Clear Bag
          </button>
          <Link
            href="/checkout"
            className="bg-bobyellow text-black px-5 py-2 rounded-lg font-bold"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}