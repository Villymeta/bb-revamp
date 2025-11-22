"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useBag } from "../../lib/shop/BagContext";
import { useRouter } from "next/navigation";

const FALLBACK_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ShopPage() {
  const { addToBag } = useBag();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  // 🔹 Load cart state from localStorage
  useEffect(() => {
    const storedSizes =
      JSON.parse(typeof window !== "undefined"
        ? localStorage.getItem("bob_sizes")
        : "{}") || {};
    const storedQuantities =
      JSON.parse(typeof window !== "undefined"
        ? localStorage.getItem("bob_qty")
        : "{}") || {};
    setSelectedSizes(storedSizes);
    setQuantities(storedQuantities);
  }, []);

  // 🔹 Persist cart choices
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("bob_sizes", JSON.stringify(selectedSizes));
    localStorage.setItem("bob_qty", JSON.stringify(quantities));
  }, [selectedSizes, quantities]);

  // 🔹 Load products from API (Supabase)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔹 Add to bag / checkout
  const handleAddToBag = (product, goToCheckout = false) => {
    const productId = product.id;
    const stockBySize = product.stock_by_size || {};

    let size = selectedSizes[productId];
    const qty = quantities[productId] || 1;

    // One-size items like beanies
    if (!size && stockBySize.OS) {
      size = "OS";
    }

    if (!size) {
      alert("Please select a size.");
      return;
    }

    const stock = stockBySize[size] || 0;
    if (qty > stock) {
      alert(`Only ${stock} available in size ${size}.`);
      return;
    }

    // Build cart item
    const cartItem = {
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.color,
      size,
      qty,
    };

    addToBag(cartItem);

    if (goToCheckout) {
      router.push("/checkout");
    } else {
      alert(`${product.name} added to bag!`);
    }
  };

  return (
    <main className="min-h-screen bg-black text-black">
      {/* Header Section */}
      <div className="flex justify-center bg-black pt-[72px] pb-8">
        <Image
          src="/BobCollection.PNG"
          alt="The B.O.B Collection Banner"
          width={1056}
          height={86}
          priority
          className="w-auto max-w-[90%] md:max-w-[70%] h-auto object-contain"
        />
      </div>

      {/* Product Grid */}
      <div className="py-16 px-6 md:px-10">
        {loading ? (
          <p className="text-center text-white/70">Loading collection…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {products.map((product) => {
              const stockBySize = product.stock_by_size || {};

              // derive size list
              const sizeKeys =
                Object.keys(stockBySize).length > 0
                  ? Object.keys(stockBySize)
                  : FALLBACK_SIZES;

              const allQty = Object.values(stockBySize);
              const isSoldOut =
                (allQty.length > 0 && allQty.every((q) => q === 0)) ||
                product.status === "Sold Out" ||
                product.status === "Sold_out";

              const productId = product.id;
              const selectedSize = selectedSizes[productId];

              return (
                <div
                  key={productId}
                  className="relative rounded-2xl p-6 flex flex-col items-center border border-black bg-[#F8E49F] text-black shadow-lg hover:scale-[1.02] transition-transform duration-300"
                >
                  {/* Product Image */}
                  <div className="relative flex justify-center">
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="rounded-xl mb-4 object-contain"
                    />
                    {isSoldOut && (
                      <span className="absolute top-2 left-2 bg-black text-[#F8E49F] text-xs font-bold px-3 py-1 rounded-md uppercase shadow-md">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <h2 className="text-lg md:text-xl font-extrabold mb-1 text-center">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-800 mb-1 text-center">
                    ${product.price}
                  </p>

                  {/* Size Selector (if sizes) */}
                  {sizeKeys.length > 0 && (
                    <div className="w-full mb-3">
                      <label className="block text-xs font-semibold mb-1 uppercase">
                        Size
                      </label>
                      <select
                        className="w-full bg-white border border-gray-400 text-black rounded-lg px-3 py-2 focus:border-black focus:ring-1 focus:ring-black transition"
                        value={selectedSize || ""}
                        onChange={(e) =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [productId]: e.target.value,
                          }))
                        }
                        disabled={isSoldOut}
                      >
                        <option value="">Select Size</option>
                        {sizeKeys.map((size) => {
                          const available = stockBySize[size] || 0;
                          return (
                            <option
                              key={size}
                              value={size}
                              disabled={available === 0}
                            >
                              {size}{" "}
                              {available === 0
                                ? "(Sold Out)"
                                : `(In stock: ${available})`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="w-full mb-2">
                    <label className="block text-xs font-semibold mb-1 uppercase">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={
                        // special rule: beanie limit 2 if OS
                        product.name === "BOB Beanie" && stockBySize.OS
                          ? Math.min(2, stockBySize.OS)
                          : selectedSize
                          ? stockBySize[selectedSize] || 1
                          : stockBySize.OS || 1
                      }
                      className="w-full bg-white border border-gray-400 text-black rounded-lg px-3 py-2 focus:border-black focus:ring-1 focus:ring-black transition"
                      value={quantities[productId] || 1}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [productId]: parseInt(e.target.value || "1", 10),
                        }))
                      }
                      disabled={isSoldOut}
                    />
                    {product.name === "BOB Beanie" && (
                      <p className="text-xs text-black mt-1 italic">
                        Limit 2 per customer
                      </p>
                    )}
                  </div>

                  {/* Add to Bag + Checkout */}
                  <div className="flex space-x-2 w-full mt-4">
                    <button
                      onClick={() => handleAddToBag(product, false)}
                      disabled={isSoldOut}
                      className={`w-1/2 text-black font-extrabold rounded-xl py-3 uppercase tracking-wider transition-all duration-300 ${
                        isSoldOut
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-b from-[#F8E49F] to-[#e6d47f] hover:brightness-110 active:scale-95 border border-black"
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : "Add to Bag"}
                    </button>

                    <button
                      onClick={() => handleAddToBag(product, true)}
                      disabled={isSoldOut}
                      className={`w-1/2 text-black font-extrabold rounded-xl py-3 uppercase tracking-wider transition-all duration-300 ${
                        isSoldOut
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-b from-[#F8E49F] to-[#e6d47f] hover:brightness-110 active:scale-95 border border-black"
                      }`}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}