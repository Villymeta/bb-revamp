import "./globals.css";
import ClientProviders from "./components/ClientProviders";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { BagProvider } from "@/lib/shop";
import Script from "next/script";

export const metadata = {
  title: "Beanies on Business",
  description: "DAO, Builders & Creators Community",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <style>{`
          .pac-container {
            background-color: #f8e49f !important;
            border: 1px solid #000 !important;
            border-radius: 10px !important;
            font-family: 'Inter', sans-serif;
            color: #000;
            z-index: 9999 !important;
          }
          .pac-item {
            padding: 8px 12px !important;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            font-weight: 500;
            color: #000 !important;
          }
          .pac-item-query {
            font-weight: 700;
            color: #000 !important;
          }
          .pac-item:hover,
          .pac-item.pac-item-selected {
            background-color: #000 !important;
            color: #f8e49f !important;
          }
          .pac-item:hover .pac-item-query,
          .pac-item.pac-item-selected .pac-item-query {
            color: #f8e49f !important;
          }
          .pac-icon { display: none; }
        `}</style>
      </head>

      <body className="flex flex-col min-h-screen bg-black text-white">
        <ClientProviders>
          <BagProvider>
            <NavBar />
            <main className="flex-grow pt-0 sm:pt-4">{children}</main>
            <Footer />
          </BagProvider>
        </ClientProviders>
      </body>
    </html>
  );
}