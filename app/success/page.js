"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p>Loading your order details...</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
