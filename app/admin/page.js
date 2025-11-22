"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import OrdersTable from "./_components/OrdersTable";
import ProductsTable from "./_components/ProductsTable";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        router.replace("/admin/login");
      } else {
        setUser(session.user);
      }
      setChecking(false);
    }

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-white/60">Checking admin access…</p>
      </main>
    );
  }

  if (!user) {
    // we already redirected, this is just a safety blank state
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-[0.2em] uppercase">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>{user.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/admin/login");
              }}
              className="rounded-full border border-white/30 px-3 py-1 text-xs hover:bg-white/10"
            >
              Log out
            </button>
          </div>
        </header>

        {/* your existing widgets */}
        <OrdersTable />
        <ProductsTable />
      </div>
    </main>
  );
}