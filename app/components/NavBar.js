"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiOutlineShoppingBag, HiOutlineX } from "react-icons/hi";
import { useBag } from "@/lib/shop/BagContext";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [miniBagOpen, setMiniBagOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { bag = [], removeFromBag = () => {} } = useBag() ?? {};

  const itemCount = bag.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = bag.reduce((acc, item) => acc + item.price * item.qty, 0);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <header className="bg-[#F8E7A1] text-black shadow-sm sticky top-0 z-50 m-0 p-0">
      {/* NAVBAR CONTENT */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.png" alt="BOB Logo" className="h-6 sm:h-8 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 font-medium text-sm">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/members">Members</Link>
          <Link href="/shop">Shop</Link>
        </nav>

        {/* Right side (Bag + Hamburger) */}
        <div className="flex items-center space-x-4 relative">
          {/* Bag Button */}
          <button
            aria-label="View bag"
            className="relative p-2 rounded-full hover:bg-gray-200 transition"
            onClick={() => setMiniBagOpen((prev) => !prev)}
          >
            <HiOutlineShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <div className="flex flex-col space-y-1">
              <span className="block h-0.5 w-5 bg-black"></span>
              <span className="block h-0.5 w-5 bg-black"></span>
              <span className="block h-0.5 w-5 bg-black"></span>
            </div>
          </button>
        </div>
      </div>

      {/* 👜 Mini Bag Drawer */}
      {miniBagOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setMiniBagOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white text-black shadow-lg p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Bag</h2>
              <button onClick={() => setMiniBagOpen(false)}>
                <HiOutlineX size={24} />
              </button>
            </div>

            {bag.length === 0 ? (
              <p className="text-gray-500 text-center">Your bag is empty 👜</p>
            ) : (
              <>
                <ul className="divide-y max-h-96 overflow-y-auto">
                  {bag.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-12 h-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.qty} × ${item.price}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-400">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          removeFromBag(item.id, item.size, item.color)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between mt-3 font-bold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex flex-col space-y-3">
                  <Link
                    href="/bag"
                    className="bg-gray-200 text-black text-center py-2 rounded-lg font-semibold hover:bg-gray-300"
                    onClick={() => setMiniBagOpen(false)}
                  >
                    View Bag
                  </Link>
                  <Link
                    href={`/checkout?product=Bag&price=${subtotal}`}
                    className="bg-yellow-400 text-black text-center py-2 rounded-lg font-bold hover:bg-yellow-500"
                    onClick={() => setMiniBagOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 📱 Mobile Menu Drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 sm:w-80 bg-gradient-to-b from-[#F8E7A1] to-[#EAD97F] z-[60] shadow-lg flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex justify-between items-center bg-black text-[#F8E7A1] px-6 py-4">
              <img src="/logo.png" alt="BOB Logo" className="h-6 w-auto" />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col space-y-6 px-8 py-8 font-semibold text-lg relative z-10">
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link href="/members" onClick={() => setMenuOpen(false)}>
                Members
              </Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link
                href="/bag"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <HiOutlineShoppingBag size={20} />
                Cart
              </Link>
            </nav>

            {/* Watermark Logo */}
            <div className="absolute inset-0 flex justify-center items-center opacity-80 pointer-events-none">
              <img
                src="/transparent-w-logo.png"
                alt="BOB Watermark"
                className="w-40 sm:w-48 select-none"
              />
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-black/20 py-4 text-center text-sm font-bold z-10">
              BEANIES ON BUSINESS
            </div>
          </div>
        </>
      )}
    </header>
  );
}