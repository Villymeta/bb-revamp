// app/admin/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

    return () => {
      isMounted = false;
    };
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
    <main className="min-h-screen bg-black text-white px-4 py-8 overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          {/* LEFT — LOGO + TITLE */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
              <Image
                src="/vault/bob-logo.png"
                alt="BOB Logo"
                width={28}
                height={28}
                className="object-contain opacity-90"
              />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase">
                Admin
              </span>
              <span className="text-xl font-semibold tracking-[0.20em] uppercase">
                Dashboard
              </span>
            </div>
          </div>

          {/* RIGHT — USER + LOGOUT */}
          <div className="flex items-center gap-3 text-xs text-white/60 max-w-full">
            <span className="max-w-[150px] sm:max-w-none truncate">
              {user.email}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/admin/login");
              }}
              className="rounded-full border border-white/30 px-3 py-1 text-xs hover:bg-white/10 whitespace-nowrap"
            >
              Log out
            </button>
          </div>
        </header>

        {/* widgets */}
        <OrdersTable />
        <ProductsTable />
      </div>
    </main>
  );
}