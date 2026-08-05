"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { sizeLabel } from "@/lib/products";

/**
 * The cart, reachable from every page. It lives in the root layout rather than
 * on /shop because the basket in the navbar is on every page too — sending it
 * to a section further down one particular page made it look like a dead button
 * from anywhere else, and like nothing at all when you were already there.
 */
export function CartDrawer() {
  const { items, total, itemCount, removeItem, updateQuantity, isOpen, closeCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and the page behind must not scroll under the panel.
  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setError(result.error || "Could not start checkout. Please try again.");
    } catch {
      setError("Could not reach the payment page. Please check your connection.");
    }
    setLoading(false);
  }

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        aria-hidden={!isOpen}
        // Stays mounted so it can slide; inert keeps a closed panel out of the
        // tab order instead of leaving invisible buttons focusable off-screen.
        inert={!isOpen}
        className={`fixed top-0 right-0 bottom-0 z-[61] w-full sm:w-[420px] bg-charcoal border-l border-white/8 shadow-[-12px_0_48px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-white/8 shrink-0">
          <h2 className="text-[16px] font-bold text-white tracking-tight m-0">
            Your Cart{itemCount > 0 && ` (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 rounded-lg bg-white/6 text-white/80 hover:bg-white/12 hover:text-white flex items-center justify-center transition-colors cursor-pointer border-none"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {itemCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </div>
            <p className="text-[15px] text-white/65 leading-relaxed m-0">
              Your cart is empty. Race day gear comes in adult and youth sizes.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="yellow-card px-6 py-2.5 rounded-xl font-bold text-[13px] tracking-wider uppercase no-underline"
            >
              Browse the Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex items-center gap-3 bg-white/3 rounded-xl p-3"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-yellow/15 to-yellow/5 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-white truncate">{item.name}</div>
                    <div className="text-[12px] text-white/65">{sizeLabel(item.size)}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        aria-label={`Remove one ${item.name}`}
                        className="w-6 h-6 rounded-md bg-white/6 text-white flex items-center justify-center text-xs hover:bg-white/15 transition-colors cursor-pointer border-none"
                      >-</button>
                      <span className="text-[13px] font-bold text-white w-5 text-center tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        aria-label={`Add one ${item.name}`}
                        className="w-6 h-6 rounded-md bg-white/6 text-white flex items-center justify-center text-xs hover:bg-white/15 transition-colors cursor-pointer border-none"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[14px] font-bold text-yellow tabular-nums">
                      ${((item.price * item.quantity) / 100).toFixed(0)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="text-white/45 hover:text-red-400 text-[11px] font-semibold transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-white/8 px-6 py-5 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-black text-white tracking-tight">Total</span>
                <span className="text-xl font-black text-yellow tabular-nums">
                  ${(total / 100).toFixed(2)}
                </span>
              </div>
              {error && (
                <p className="text-[13px] text-red-400 mb-3 leading-relaxed">{error}</p>
              )}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="yellow-card w-full py-3 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(245,200,66,0.2)] transition-all disabled:opacity-50 cursor-pointer border-none"
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
              <button
                onClick={closeCart}
                className="w-full mt-2 py-2 text-[13px] font-semibold text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              >
                Keep Shopping
              </button>
              <p className="text-[12px] text-white/50 text-center mt-3 leading-relaxed">
                Secure payment powered by Stripe. Shipping to US addresses only.
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
