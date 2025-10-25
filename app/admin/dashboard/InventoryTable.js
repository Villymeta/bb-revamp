"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InventoryTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setProducts(data);
    };
    loadInventory();
  }, []);

  return (
    <div className="bg-[#F8E49F] text-black rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Inventory</h2>
      <table className="w-full text-sm">
        <thead className="bg-black text-[#F8E49F]">
          <tr>
            <th className="p-2">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Sizes</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-black/20">
              <td className="p-2 font-semibold">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2 font-mono text-xs">
                {p.stock_by_size
                  ? Object.entries(p.stock_by_size)
                      .map(([size, qty]) => `${size}: ${qty}`)
                      .join(" | ")
                  : "N/A"}
              </td>
              <td className="p-2">{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}