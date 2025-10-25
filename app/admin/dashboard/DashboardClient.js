"use client";

import { useSearchParams } from "next/navigation";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "orders";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Currently viewing: {tab}</p>

      {/* Your table components */}
      {tab === "orders" && <p>OrdersTable goes here</p>}
      {tab === "customers" && <p>CustomersTable goes here</p>}
      {tab === "inventory" && <p>InventoryTable goes here</p>}
      {tab === "receipts" && <p>ReceiptsTable goes here</p>}
    </div>
  );
}