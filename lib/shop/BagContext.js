"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BagContext = createContext();

export function BagProvider({ children }) {
  const [bag, setBag] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // 🧠 Load from localStorage on mount
  useEffect(() => {
    const savedBag = JSON.parse(localStorage.getItem("bob_bag")) || [];
    setBag(savedBag);
  }, []);

  // 💾 Save whenever bag changes
  useEffect(() => {
    localStorage.setItem("bob_bag", JSON.stringify(bag));
    setSubtotal(bag.reduce((acc, item) => acc + item.price * item.qty, 0));
  }, [bag]);

  // ➕ Add to bag
  const addToBag = (item) => {
    setBag((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, qty: i.qty + item.qty }
            : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  // ❌ Remove single item
  const removeFromBag = (id, size) => {
    setBag((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  // 🧹 Clear bag
  const clearBag = () => setBag([]);

  return (
    <BagContext.Provider
      value={{ bag, addToBag, removeFromBag, clearBag, subtotal }}
    >
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context)
    throw new Error("useBag must be used within a BagProvider");
  return context;
}