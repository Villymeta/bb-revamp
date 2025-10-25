"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setOrders(data);
    };
    loadOrders();
  }, []);

  return (
    <div className="bg-[#F8E49F] text-black rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-black text-[#F8E49F]">
            <tr>
              <th className="p-2">Ref</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/30">
                <td className="p-2 font-mono">{o.reference}</td>
                <td className="p-2">{o.customer_name}</td>
                <td className="p-2">${o.total}</td>
                <td className="p-2">{o.payment_status}</td>
                <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}