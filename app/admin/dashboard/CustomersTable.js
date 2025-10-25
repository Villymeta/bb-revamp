"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CustomersTable() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setCustomers(data);
    };
    loadCustomers();
  }, []);

  return (
    <div className="bg-[#F8E49F] text-black rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Customers</h2>
      <table className="w-full text-sm">
        <thead className="bg-black text-[#F8E49F]">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Wallet</th>
            <th className="p-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-black/20">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2 font-mono">{c.wallet}</td>
              <td className="p-2">{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}