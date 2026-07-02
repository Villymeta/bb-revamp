"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/app/components/ToastProvider";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      success("Logged in as admin ✅");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/80 p-6">

        {/* 🌟 LOGO HERE */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"   // <-- replace with your preferred admin logo
            alt="BOB Logo"
            width={80}
            height={80}
            className="opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          />
        </div>

        <h1 className="text-lg font-semibold mb-4 text-center tracking-[0.2em] uppercase">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 text-white/70">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-white/70">Password</label>
            <input
              type="password"
              required
              className="w-full rounded-xl bg-neutral-900 border border-white/15 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-bobyellow text-black text-sm font-semibold py-2 mt-2 hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}