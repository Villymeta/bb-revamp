"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const show = useCallback((type, message) => {
    setToast({ type, message });

    // auto-hide after 2.5s
    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const value = {
    success: (msg) => show("success", msg),
    error: (msg) => show("error", msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast container */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toast && (
          <div
            className={`pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-lg border ${
              toast.type === "error"
                ? "bg-red-600/90 border-red-300 text-white"
                : "bg-emerald-500/90 border-emerald-200 text-black"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}