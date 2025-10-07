"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useBag } from "../../lib/shop/BagContext";
import { useRouter } from "next/navigation";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const defaultProducts = [
  {
    id: "DD Las Vegas Tee",
    name: "DD Las Vegas Tee",
    price: 40,
    image: "/merch/bob-LV.png",
    sizes: SIZES,
    status: "hot",
    color: "Gold on Black",
    stockBySize: { S: 8, M: 14, L: 16, XL: 8, XXL: 4 },
  },
  {
    id: "B.O.B Black Tee",
    name: "B.O.B Black Tee",
    price: 30,
    image: "/merch/bob-black.png",
    sizes: SIZES,
    status: "new",
    color: "Black",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "B.O.B White Tee",
    name: "B.O.B White Tee",
    price: 30,
    image: "/merch/bob-white.png",
    sizes: SIZES,
    status: "new",
    color: "White",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "BOB Beanie",
    name: "BOB Beanie",
    price: 30,
    image: "/merch/beanie.png",
    status: "new",
    color: "Black",
    stockBySize: { OS: 30 },
  },
  {
    id: "DD New York Tee",
    name: "DD New York Tee",
    price: 40,
    image: "/merch/bob-nyc.png",
    sizes: SIZES,
    status: "sold out",
    color: "White on Black",
    stockBySize: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  },
];

export default function ShopPage() {
  const { addToBag } = useBag();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedSizes = JSON.parse(localStorage.getItem("bob_sizes")) || {};
    const storedQuantities = JSON.parse(localStorage.getItem("bob_qty")) || {};
    setSelectedSizes(storedSizes);
    setQuantities(storedQuantities);
  }, []);

  useEffect(() => {
    localStorage.setItem("bob_sizes", JSON.stringify(selectedSizes));
    localStorage.setItem("bob_qty", JSON.stringify(quantities));
  }, [selectedSizes, quantities]);

  // ✅ Updated: Add to Bag or Checkout logic
  const handleAddToBag = (product, goToCheckout = false) => {
    let size = selectedSizes[product.id];
    const qty = quantities[product.id] || 1;

    if (!product.sizes && product.stockBySize?.OS) size = "OS";

    if (!size) {
      alert("Please select a size.");
      return;
    }

    const stock = product.stockBySize[size] || 0;
    if (qty > stock) {
      alert(`Only ${stock} available in size ${size}.`);
      return;
    }

    addToBag({ ...product, size, qty });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {defaultProducts.map((product) => {
            const isSoldOut = Object.values(product.stockBySize).every(
              (qty) => qty === 0
            );

            return (
              <div
                key={product.id}
                className={`relative rounded-2xl p-6 flex flex-col items-center border border-black bg-[#F8E49F] text-black shadow-lg hover:scale-[1.02] transition-transform duration-300`}
              >
                {/* Product Image */}
                <div className="relative flex justify-center">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="rounded-xl mb-4"
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

                {/* Size Selector */}
                {product.sizes && (
                  <div className="w-full mb-3">
                    <label className="block text-xs font-semibold mb-1 uppercase">
                      Size
                    </label>
                    <select
                      className="w-full bg-white border border-gray-400 text-black rounded-lg px-3 py-2 focus:border-black focus:ring-1 focus:ring-black transition"
                      value={selectedSizes[product.id] || ""}
                      onChange={(e) =>
                        setSelectedSizes({
                          ...selectedSizes,
                          [product.id]: e.target.value,
                        })
                      }
                      disabled={isSoldOut}
                    >
                      <option value="">Select Size</option>
                      {product.sizes.map((size) => {
                        const available = product.stockBySize[size] || 0;
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
                      product.id === "BOB Beanie"
                        ? Math.min(2, product.stockBySize.OS)
                        : product.sizes
                        ? product.stockBySize[selectedSizes[product.id]] || 1
                        : product.stockBySize.OS
                    }
                    className="w-full bg-white border border-gray-400 text-black rounded-lg px-3 py-2 focus:border-black focus:ring-1 focus:ring-black transition"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [product.id]: parseInt(e.target.value),
                      })
                    }
                    disabled={isSoldOut}
                  />
                  {product.id === "BOB Beanie" && (
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
      </div>
    </main>
  );
}