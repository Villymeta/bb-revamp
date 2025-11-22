"use client";

import { ToastProvider } from "./ToastProvider";

export default function ClientProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}