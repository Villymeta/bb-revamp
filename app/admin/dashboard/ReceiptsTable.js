"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ReceiptsTable() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const loadReceipts = async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("timestamp", { ascending: false });
      if (!error) setReceipts(data);
    };
    loadReceipts();
  }, []);

  return (
    <div className="bg-[#F8E49F] text-black rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Receipts</h2>
      <table className="w-full text-sm">
        <thead className="bg-black text-[#F8E49F]">
          <tr>
            <th className="p-2">Ref</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Total</th>
            <th className="p-2">Delivery</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((r) => (
            <tr key={r.id} className="border-b border-black/20">
              <td className="p-2">{r.reference}</td>
              <td className="p-2">{r.customer_name}</td>
              <td className="p-2">${r.total_amount}</td>
              <td className="p-2">{r.delivery_method}</td>
              <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}