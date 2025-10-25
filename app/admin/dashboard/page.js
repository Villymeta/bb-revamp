"use client";

import { useSearchParams } from "next/navigation";
import OrdersTable from "./OrdersTable";
import InventoryTable from "./InventoryTable";
import CustomersTable from "./CustomersTable";
import ReceiptsTable from "./ReceiptsTable";

export default function DashboardPage() {
  const tab = useSearchParams().get("tab") || "orders";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {tab === "orders" && <OrdersTable />}
      {tab === "inventory" && <InventoryTable />}
      {tab === "customers" && <CustomersTable />}
      {tab === "receipts" && <ReceiptsTable />}
    </div>
  );
}