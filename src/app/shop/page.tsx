"use client";

import { useState } from "react";
import { products, formatPrice, sizeLabel } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export default function ShopPage() {
  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">
            Official Merchandise
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">
            Race Day Gear
          </h1>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/70 max-w-[480px] mx-auto">
            Rep your Oromo pride with our limited-edition Gada Global 5K
            collection. Youth sizes on every item, so the whole family can match.
            All proceeds support the event.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <CartBar />
      </div>
    </main>
  );
}

/**
 * The cart itself is the drawer in the layout — this is just the prompt back
 * into it, so the shop page still shows that something is waiting.
 */
function CartBar() {
  const { itemCount, total, openCart } = useCart();

  if (itemCount === 0) {
    return (
      <div className="text-center">
        <Link href="/" className="text-white/60 text-[14px] hover:text-yellow transition-colors no-underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <ScrollReveal className="text-center">
      <button
        type="button"
        onClick={openCart}
        className="dark-card inline-flex items-center gap-4 rounded-2xl px-7 py-4 cursor-pointer hover:border-yellow/25 transition-all"
      >
        <span className="text-[14px] font-bold text-white">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </span>
        <span className="text-[14px] font-black text-yellow tabular-nums">
          ${(total / 100).toFixed(2)}
        </span>
        <span className="text-[13px] font-bold tracking-wider uppercase text-yellow">
          View Cart &rarr;
        </span>
      </button>
      <div className="mt-8">
        <Link href="/" className="text-white/60 text-[14px] hover:text-yellow transition-colors no-underline">
          &larr; Back to Home
        </Link>
      </div>
    </ScrollReveal>
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
            <span className="absolute top-4 right-4 yellow-card px-3.5 py-1 rounded-lg text-[11px] font-black tracking-wider uppercase z-10">
              {product.tag}
            </span>
          )}
        </div>

        <div className="p-6">
          <h4 className="text-[16px] font-bold text-white mb-1 tracking-tight">{product.name}</h4>
          <p className="text-[15px] md:text-[13px] text-white/70 mb-5 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-4">
            <label className="block text-[11px] font-bold tracking-[2px] uppercase text-white/60 mb-2">
              Size
            </label>
            <SizeGroup
              heading="Adult"
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
            {product.youthSizes && product.youthSizes.length > 0 && (
              <div className="mt-3">
                <SizeGroup
                  heading="Youth"
                  sizes={product.youthSizes}
                  selected={selectedSize}
                  onSelect={setSelectedSize}
                />
              </div>
            )}
            {selectedSize && (
              <p className="text-[12px] text-white/55 mt-2">
                Selected: {sizeLabel(selectedSize)}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-yellow tracking-tight">
              {formatPrice(product.price)}
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedSize}
              className={`px-5 py-2 rounded-xl font-bold text-[13px] tracking-wide transition-all cursor-pointer border-none ${
                added
                  ? "bg-green-deep text-white"
                  : selectedSize
                  ? "bg-white/8 text-white hover:bg-yellow hover:text-charcoal"
                  : "bg-white/3 text-white/55 cursor-not-allowed"
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

/**
 * One row of size buttons under its own heading. Youth buttons drop the "Y"
 * prefix — the heading above them is what distinguishes a youth medium from an
 * adult one, and the full name is spelled out once a size is picked.
 */
function SizeGroup({
  heading,
  sizes,
  selected,
  onSelect,
}: {
  heading: string;
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}) {
  return (
    <div>
      <span className="block text-[10px] font-bold tracking-[1.5px] uppercase text-white/40 mb-1.5">
        {heading}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            aria-label={sizeLabel(size)}
            aria-pressed={selected === size}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
              selected === size
                ? "yellow-card border-yellow"
                : "bg-white/4 text-white/75 border-white/6 hover:border-white/20"
            }`}
          >
            {size.startsWith("Y") ? size.slice(1) : size}
          </button>
        ))}
      </div>
    </div>
  );
}
