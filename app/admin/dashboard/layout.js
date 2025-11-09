// app/admin/dashboard/layout.js
"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Package, Users, Receipt, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, tab: null },
  { name: "Orders", href: "/admin/dashboard?tab=orders", icon: Receipt, tab: "orders" },
  { name: "Inventory", href: "/admin/dashboard?tab=inventory", icon: Package, tab: "inventory" },
  { name: "Customers", href: "/admin/dashboard?tab=customers", icon: Users, tab: "customers" },
  { name: "Receipts", href: "/admin/dashboard?tab=receipts", icon: Receipt, tab: "receipts" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const activeTab = sp.get("tab");

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className="w-64 bg-[#F8E49F] text-black flex flex-col py-6 shadow-lg">
        <div className="text-2xl font-extrabold text-center mb-8">B.O.B Admin</div>
        <nav className="flex flex-col space-y-1 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDashboard = item.tab == null;
            const isActive = isDashboard
              ? pathname === "/admin/dashboard" && !activeTab
              : activeTab === item.tab;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive ? "bg-black text-[#F8E49F]" : "hover:bg-black/10 hover:text-black"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4">
          <button
            className="flex items-center w-full space-x-3 px-4 py-2 mt-6 text-sm text-black hover:bg.black/10 rounded-lg font-semibold"
            onClick={() => alert("Logout functionality coming soon")}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-2xl font-bold text-[#F8E49F]">Admin Dashboard</h1>
          <span className="text-gray-400 text-sm">Welcome, Admin</span>
        </header>
        {children}
      </main>
    </div>
  );
}