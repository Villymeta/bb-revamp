// app/admin/_components/ProductsTable.js
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/app/components/ToastProvider";

const SIZE_KEYS = ["OS", "S", "M", "L", "XL", "XXL"];

export default function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // editing state
  // editing can be: product.id (edit) or "new" (create)
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: "Active",
    image: "",
    stockBySize: {}, // { S: 10, M: 5, ... }
  });

  const { success, error: toastError } = useToast();

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
      toastError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function startNewProduct() {
    setEditing("new");
    setForm({
      name: "",
      price: "",
      status: "Active",
      image: "",
      stockBySize: {},
    });
  }

  function startEditProduct(product) {
    setEditing(product.id);
    setForm({
      name: product.name || "",
      price: product.price ?? "",
      status: product.status || "Active",
      image: product.image || "",
      stockBySize: product.stock_by_size || {},
    });
  }

  function updateSize(sizeKey, value) {
    const num = value === "" ? "" : Number(value);
    setForm((f) => ({
      ...f,
      stockBySize: {
        ...(f.stockBySize || {}),
        [sizeKey]: num,
      },
    }));
  }

  async function saveProduct() {
    try {
      setSaving(true);

      // clean stockBySize → stock_by_size
      const cleanedStockBySize = Object.fromEntries(
        Object.entries(form.stockBySize || {})
          .filter(([_, qty]) => qty !== "" && !Number.isNaN(Number(qty)))
          .map(([k, v]) => [k, Number(v)])
      );

      const payload = {
        name: form.name,
        price: Number(form.price),
        status: form.status,
        image: form.image || null,
        stock_by_size:
          Object.keys(cleanedStockBySize).length > 0
            ? cleanedStockBySize
            : null,
      };

      if (!payload.name || Number.isNaN(payload.price)) {
        toastError("Name and price are required.");
        setSaving(false);
        return;
      }

      if (editing === "new") {
        // CREATE
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create product");

        const created = await res.json();
        setProducts((prev) => [...prev, created]);
        setEditing(null);
        success("Product added.");
      } else {
        // UPDATE
        const res = await fetch(`/api/admin/products/${editing}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update product");

        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditing(null);
        success("Product updated.");
      }
    } catch (err) {
      console.error(err);
      toastError("Error saving product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-black/60">
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-6 py-4 gap-2">
        <h2 className="text-lg font-semibold">Inventory</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            className="rounded-full bg-bobyellow px-4 py-1 text-xs font-semibold text-black hover:bg-yellow-300"
          >
            Refresh
          </button>

          <button
            onClick={startNewProduct}
            className="rounded-full border border-white/30 px-4 py-1 text-xs font-semibold text-white hover:bg-white/10"
          >
            + Add product
          </button>
        </div>
      </div>

      {error && <p className="px-6 pt-3 text-xs text-red-400">{error}</p>}

      <div className="overflow-x-auto px-6 pb-4">
        <table className="mt-3 w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs text-white/60">
            <tr>
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Stock by Size</th>
              <th className="py-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-white/60">
                  Loading products…
                </td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-white/60">
                  No products found.
                </td>
              </tr>
            )}

            {!loading &&
              products.map((product) => (
                <tr key={product.id} className="border-b border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <div className="h-10 w-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
                          {/* You can swap to <Image> if you want */}
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div>{product.name}</div>
                        {product.image && (
                          <div className="text-[10px] text-white/40">
                            {product.image}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">${product.price}</td>
                  <td className="py-3 pr-4 capitalize">
                    {product.status || "Active"}
                  </td>
                  <td className="py-3 pr-4 text-xs text-white/70">
                    {product.stock_by_size
                      ? Object.entries(product.stock_by_size)
                          .map(([size, qty]) => `${size}: ${qty}`)
                          .join(" · ")
                      : "—"}
                  </td>
                  <td className="py-3 pr-0 text-right">
                    <button
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white hover:bg-white/10"
                      onClick={() => startEditProduct(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

            {/* Inline editor */}
            {editing && (
              <tr className="border-t border-white/10 bg-black/40">
                <td colSpan={5} className="py-4">
                  <div className="flex flex-col gap-4">
                    {/* Row 1: Name + Price + Status */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <input
                        className="rounded-lg bg-neutral-900 px-3 py-2 text-sm min-w-[220px]"
                        placeholder="Product name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />

                      <input
                        type="number"
                        className="rounded-lg bg-neutral-900 px-3 py-2 text-sm w-24"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, price: e.target.value }))
                        }
                      />

                      <select
                        className="rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                        value={form.status}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, status: e.target.value }))
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Sold Out">Sold Out</option>
                      </select>
                    </div>

                    {/* Row 2: Image path */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <input
                        className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-sm min-w-[260px]"
                        placeholder='Image path (e.g. /merch/bob-black.png)'
                        value={form.image}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, image: e.target.value }))
                        }
                      />
                    </div>

                    {/* Row 3: Sizes & stock */}
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-white/60">
                        Stock by size (leave blank for sizes you don&apos;t use):
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {SIZE_KEYS.map((size) => (
                          <div
                            key={size}
                            className="flex items-center gap-2 text-xs"
                          >
                            <span className="w-8 text-white/70">{size}</span>
                            <input
                              type="number"
                              min="0"
                              className="w-16 rounded-lg bg-neutral-900 px-2 py-1 text-xs"
                              value={
                                form.stockBySize?.[size] === "" ||
                                typeof form.stockBySize?.[size] === "undefined"
                                  ? ""
                                  : form.stockBySize[size]
                              }
                              onChange={(e) =>
                                updateSize(size, e.target.value)
                              }
                              placeholder="-"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        className="rounded-full bg-bobyellow px-4 py-2 text-sm font-medium"
                        onClick={saveProduct}
                        disabled={saving}
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>

                      <button
                        className="rounded-full border border-white/20 px-4 py-2 text-sm text-white"
                        onClick={() => setEditing(null)}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}