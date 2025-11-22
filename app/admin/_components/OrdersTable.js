// app/admin/_components/OrdersTable.js
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ToastProvider";

// Small helper to format dates safely
function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

// CSV helpers
function ordersToCsv(orders) {
  const header = [
    "id",
    "reference",
    "customer_name",
    "customer_email",
    "total",
    "fulfilled",
    "shipping_option",
    "wallet_address",
    "created_at",
    "items",
  ];

  const rows = orders.map((o) => {
    let itemsString = "";
    if (Array.isArray(o.items)) {
      itemsString = o.items
        .map((it) => {
          const base = `${it.qty || 1}x ${it.name || ""}`;
          const size = it.size ? ` (${it.size})` : "";
          const price =
            typeof it.price !== "undefined" ? ` - $${it.price}` : "";
          return base + size + price;
        })
        .join(" | ");
    } else if (o.items) {
      itemsString = JSON.stringify(o.items);
    }

    const row = [
      o.id ?? "",
      o.reference ?? "",
      o.customer_name ?? "",
      o.customer_email ?? "",
      o.total ?? "",
      o.fulfilled ? "fulfilled" : "pending",
      o.shipping_option ?? "",
      o.wallet_address ?? "",
      o.created_at ?? "",
      itemsString,
    ];

    return row
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",");
  });

  return [header.join(","), ...rows].join("\n");
}

function downloadCsv(filename, csvString) {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Simple helper to create an activity log line
function makeLog(message) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    message,
  };
}

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "fulfilled"
  const [dateSort, setDateSort] = useState("newest"); // "newest" | "oldest"

  // selected order for detail view
  const [selectedOrder, setSelectedOrder] = useState(null);

  // activity logs (C)
  const [logs, setLogs] = useState([]);

  const { success, error } = useToast();

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      error("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleExportAll() {
    if (!orders || orders.length === 0) {
      error("No orders to export.");
      return;
    }

    const csv = ordersToCsv(orders);
    downloadCsv("beanies-orders.csv", csv);
    success("Orders CSV downloaded.");
    setLogs((prev) => [
      makeLog(`Exported ${orders.length} orders to CSV.`),
      ...prev,
    ]);
  }

  async function toggleFulfilled(id, current) {
    try {
      const res = await fetch("/api/admin/orders/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, fulfilled: !current }),
      });

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      await load();

      const msg = !current
        ? "Order marked as fulfilled ✅"
        : "Order set back to pending.";
      success(msg);

      // 🔔 A) Toast already shown – now ALSO log it
      setLogs((prev) => [
        makeLog(`${msg} (id: ${id})`),
        ...prev,
      ]);

      // 🔁 B) Tell ProductsTable to reload inventory
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("inventory-updated"));
      }

      // Extra toast to make it very clear inventory changed
      success("Inventory updated automatically from this order.");
    } catch (err) {
      console.error(err);
      error("Could not update this order. Please try again.");
    }
  }

  // 🧾 Print packing slip (used by the button in details panel)
  function printPackingSlip(order) {
    if (!order) return;

    const itemsLines = Array.isArray(order.items)
      ? order.items
          .map((item) => {
            const qty = item.qty || 1;
            const name = item.name || "";
            const size = item.size ? ` (${item.size})` : "";
            return `${qty}× ${name}${size}`;
          })
          .join("\n")
      : "(no item detail stored)";

    const html = `
      <html>
        <head>
          <title>Packing Slip - ${order.reference || ""}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              padding: 24px;
              color: #000;
            }
            h1 {
              font-size: 20px;
              margin-bottom: 4px;
            }
            h2 {
              font-size: 16px;
              margin-top: 16px;
              margin-bottom: 4px;
            }
            .section {
              margin-bottom: 12px;
            }
            .label {
              font-weight: 600;
            }
            pre {
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <h1>Packing Slip</h1>
          <div class="section">
            <div><span class="label">Order Ref:</span> ${order.reference || "—"}</div>
            <div><span class="label">Placed at:</span> ${formatDate(order.created_at)}</div>
            <div><span class="label">Total:</span> $${order.total ?? ""}</div>
          </div>

          <div class="section">
            <h2>Customer</h2>
            <div>${order.customer_name || "—"}</div>
            <div>${order.customer_email || ""}</div>
            <div>${order.shipping_option || ""}</div>
          </div>

          <div class="section">
            <h2>Items</h2>
            <pre>${itemsLines}</pre>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.focus();
    printWindow.print();
  }

  if (loading) {
    return <p className="text-sm text-white/60">Loading orders…</p>;
  }

  // FILTER + SORT
  const filteredAndSorted = [...orders]
    .filter((o) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "pending") return !o.fulfilled;
      if (statusFilter === "fulfilled") return o.fulfilled;
      return true;
    })
    .sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateSort === "newest" ? bTime - aTime : aTime - bTime;
    });

  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 space-y-4">
      {/* Header + Filters + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Orders</h2>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status filter */}
          <div className="flex items-center gap-1">
            <span className="text-white/60">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full bg-black/60 border border-white/20 px-3 py-1 text-xs text-white focus:outline-none"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>

          {/* Date sort */}
          <div className="flex items-center gap-1">
            <span className="text-white/60">Sort:</span>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="rounded-full bg-black/60 border border-white/20 px-3 py-1 text-xs text-white focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* CSV Export (D) */}
          <button
            onClick={handleExportAll}
            className="rounded-full bg-bobyellow px-4 py-1 text-xs font-semibold text-black hover:bg-yellow-300"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-sm">
        <table className="min-w-full">
          <thead className="text-white/70 border-b border-white/10">
            <tr>
              <th className="text-left py-2 pr-4">Ref</th>
              <th className="text-left py-2 pr-4">Customer</th>
              <th className="text-left py-2 pr-4">Total</th>
              <th className="text-left py-2 pr-4">Status</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((o) => {
              const isSelected = selectedOrder && selectedOrder.id === o.id;

              return (
                <tr
                  key={o.id}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${
                    isSelected ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedOrder(o)}
                >
                  <td className="py-2 pr-4">{o.reference}</td>
                  <td className="py-2 pr-4">{o.customer_name}</td>
                  <td className="py-2 pr-4">${o.total}</td>
                  <td className="py-2 pr-4">
                    {o.fulfilled ? "Fulfilled" : "Pending"}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // don't trigger row select
                        toggleFulfilled(o.id, o.fulfilled);
                      }}
                      className="px-3 py-1 rounded-lg text-xs bg-yellow-300 text-black font-semibold hover:bg-yellow-200"
                    >
                      {o.fulfilled ? "Mark Pending" : "Mark Fulfilled"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredAndSorted.length === 0 && (
              <tr>
                <td colSpan={5} className="py-3 text-center text-white/60">
                  No orders match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAILS PANEL */}
      {selectedOrder && (
        <div className="mt-2 rounded-2xl border border-white/15 bg-black/70 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Order Details
              </p>
              <p className="text-sm font-semibold">
                Ref: {selectedOrder.reference}{" "}
                <span className="ml-2 text-xs text-white/50">
                  ({selectedOrder.fulfilled ? "Fulfilled" : "Pending"})
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => printPackingSlip(selectedOrder)}
                className="text-xs rounded-full border border-white/30 px-3 py-1 text-white/70 hover:bg-white/10"
              >
                Print packing slip
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs rounded-full border border-white/30 px-3 py-1 text-white/70 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 text-xs md:text-sm">
            {/* Column 1: Core info */}
            <div className="space-y-1">
              <p className="text-white/60">Placed at</p>
              <p>{formatDate(selectedOrder.created_at)}</p>

              <p className="mt-3 text-white/60">Total</p>
              <p className="font-semibold">${selectedOrder.total}</p>

              {typeof selectedOrder.fulfilled !== "undefined" && (
                <>
                  <p className="mt-3 text-white/60">Status</p>
                  <p>{selectedOrder.fulfilled ? "Fulfilled" : "Pending"}</p>
                </>
              )}
            </div>

            {/* Column 2: Customer / shipping */}
            <div className="space-y-1">
              <p className="text-white/60">Customer</p>
              <p>{selectedOrder.customer_name || "—"}</p>

              {selectedOrder.customer_email && (
                <>
                  <p className="mt-3 text-white/60">Email</p>
                  <p>{selectedOrder.customer_email}</p>
                </>
              )}

              {selectedOrder.shipping_option && (
                <>
                  <p className="mt-3 text-white/60">Shipping Option</p>
                  <p>{selectedOrder.shipping_option}</p>
                </>
              )}

              {selectedOrder.wallet_address && (
                <>
                  <p className="mt-3 text-white/60">Wallet</p>
                  <p className="break-all">{selectedOrder.wallet_address}</p>
                </>
              )}
            </div>

            {/* Column 3: Items */}
            <div className="space-y-1">
              <p className="text-white/60">Items</p>

              {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.length > 0 ? (
                <ul className="space-y-1">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.qty}× {item.name}
                      {item.size ? ` (${item.size})` : ""} — ${item.price}
                    </li>
                  ))}
                </ul>
              ) : selectedOrder.items ? (
                <pre className="mt-1 rounded bg-black/60 p-2 text-[11px] leading-snug overflow-x-auto">
                  {JSON.stringify(selectedOrder.items, null, 2)}
                </pre>
              ) : (
                <p>—</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C) ACTIVITY LOGS */}
      <div className="mt-2 rounded-2xl border border-white/10 bg-black/60 p-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-2">
          Activity Log
        </p>
        {logs.length === 0 ? (
          <p className="text-xs text-white/50">No recent actions yet.</p>
        ) : (
          <ul className="space-y-1 max-h-40 overflow-y-auto text-xs">
            {logs.map((log) => (
              <li key={log.id} className="text-white/70">
                <span className="text-white/40">
                  {new Date(log.at).toLocaleTimeString()} —{" "}
                </span>
                {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}