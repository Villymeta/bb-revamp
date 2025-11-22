"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // 🔒 Admin: no marketing navbar / footer
  if (isAdmin) {
    return (
      <main className="flex-grow pt-4">
        {children}
      </main>
    );
  }

  // 🌐 Public site: show normal shell
  return (
    <>
      <NavBar />
      <main className="flex-grow pt-0 sm:pt-4">{children}</main>
      <Footer />
    </>
  );
}