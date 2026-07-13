"use client";

import { useState } from "react";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export default function ShopPage() {
  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">
            Official Merchandise
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">
            Race Day Gear
          </h1>
          <p className="text-[15px] leading-[1.85] text-white/35 max-w-[480px] mx-auto">
            Rep your Oromo pride with our limited-edition Gada Global 5K
            collection. All proceeds support the event.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <CartSummary />
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: (typeof products)[0] }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAdd() {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <ScrollReveal>
      <div className="rounded-3xl overflow-hidden dark-card hover:-translate-y-1.5 hover:border-yellow/20 transition-all">
        <div className={`h-[300px] relative overflow-hidden bg-gradient-to-br ${product.color}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: product.imagePosition || "center" }}
          />
          {product.tag && (
            <span className="absolute top-4 right-4 yellow-card px-3.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase z-10">
              {product.tag}
            </span>
          )}
        </div>

        <div className="p-6">
          <h4 className="text-[15px] font-bold text-white mb-1 tracking-tight">{product.name}</h4>
          <p className="text-[12px] text-white/35 mb-5 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-4">
            <label className="block text-[10px] font-bold tracking-[2px] uppercase text-white/25 mb-2">
              Size
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedSize === size
                      ? "yellow-card border-yellow"
                      : "bg-white/4 text-white/45 border-white/6 hover:border-white/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-yellow tracking-tight">
              {formatPrice(product.price)}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`px-5 py-2 rounded-xl font-bold text-[12px] tracking-wide transition-all cursor-pointer border-none ${
                added
                  ? "bg-green-deep text-white"
                  : selectedSize
                  ? "bg-white/8 text-white hover:bg-yellow hover:text-charcoal"
                  : "bg-white/3 text-white/20 cursor-not-allowed"
              }`}
            >
              {added ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function CartSummary() {
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);

  if (itemCount === 0) return null;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <ScrollReveal>
      <div className="dark-card rounded-3xl p-8 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-6 tracking-tight">
          Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h3>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-4 bg-white/3 rounded-xl p-4"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-yellow/15 to-yellow/5 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-white truncate">{item.name}</div>
                <div className="text-[11px] text-white/30">Size: {item.size}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                  className="w-6 h-6 rounded-md bg-white/6 text-white flex items-center justify-center text-xs hover:bg-white/15 transition-colors cursor-pointer border-none"
                >-</button>
                <span className="text-[13px] font-bold text-white w-5 text-center tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  className="w-6 h-6 rounded-md bg-white/6 text-white flex items-center justify-center text-xs hover:bg-white/15 transition-colors cursor-pointer border-none"
                >+</button>
              </div>
              <div className="text-[13px] font-bold text-yellow w-12 text-right tabular-nums">
                ${((item.price * item.quantity) / 100).toFixed(0)}
              </div>
              <button
                onClick={() => removeItem(item.id, item.size)}
                className="text-white/20 hover:text-red-400 text-base transition-colors cursor-pointer bg-transparent border-none"
              >&times;</button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/6 pt-6">
          <div className="text-base font-black text-white tracking-tight">
            Total: <span className="text-yellow">${(total / 100).toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="yellow-card px-7 py-2.5 rounded-xl font-bold text-[13px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(245,200,66,0.2)] transition-all disabled:opacity-50 cursor-pointer border-none"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>

        <p className="text-[11px] text-white/20 text-center mt-4">
          Secure payment powered by Stripe. Shipping to US addresses only.
        </p>
      </div>

      <div className="text-center mt-8">
        <Link href="/" className="text-white/25 text-[13px] hover:text-yellow transition-colors no-underline">
          &larr; Back to Home
        </Link>
      </div>
    </ScrollReveal>
  );
}
