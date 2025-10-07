"use client";

import { useBag } from "./BagContext";

export function useCheckout() {
  const { bag, subtotal, clearBag } = useBag();

  const handleCheckout = async () => {
    // 🪙 This is where Solana Pay or Supabase logic will go
    alert(`Checkout initiated. Total: $${subtotal.toFixed(2)}`);
    clearBag();
  };

  return { bag, subtotal, handleCheckout };
}