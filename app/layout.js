import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { BagProvider } from "@/lib/shop";
import Script from "next/script"; // ✅ Import Next.js Script component

export const metadata = {
  title: "Beanies on Business",
  description: "DAO, Builders & Creators Community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Load Google Maps API securely using environment variable */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />

        {/* ✅ Add inline CSS for autocomplete styling */}
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
    color: #000 !important; /* ensure black text */
  }
  .pac-item-query {
    font-weight: 700;
    color: #000 !important; /* force main text visible */
  }
  .pac-item:hover,
  .pac-item.pac-item-selected {
    background-color: #000 !important; /* black background on hover */
    color: #f8e49f !important; /* yellow text */
  }
  .pac-item:hover .pac-item-query,
  .pac-item.pac-item-selected .pac-item-query {
    color: #f8e49f !important; /* yellow highlight text */
  }
  .pac-icon {
    display: none; /* hide pin */
  }
  .pac-item-selected {
    background-color: #000 !important;
    color: #f8e49f !important;
  }
`}</style>
      </head>

      <body className="flex flex-col min-h-screen bg-black text-white">
        <BagProvider>
          <NavBar />
          <main className="flex-grow pt-0 sm:pt-4">{children}</main>
          <Footer />
        </BagProvider>
      </body>
    </html>
  );
}