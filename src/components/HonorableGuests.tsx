"use client";

import { useState } from "react";
import Image from "next/image";
import { GUESTS } from "@/lib/guests";
import { ScrollReveal } from "@/components/ScrollReveal";

/** Five medalist guests. Tap a card for career highlights and personal bests. */
export function HonorableGuests({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState<string | null>(null);
  const dark = tone === "dark";

  return (
    <div className="max-w-6xl mx-auto">
      <ScrollReveal className="text-center mb-10">
        <span className={`text-[12px] font-bold tracking-[4px] uppercase mb-5 block ${dark ? "text-yellow" : "text-gold-dim"}`}>
          Honorable Guests
        </span>
        <h2 className={`font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4 ${dark ? "text-white" : ""}`}>
          Run with legends
        </h2>
        <p className={`text-base md:text-[16px] leading-[1.85] max-w-[560px] mx-auto ${dark ? "text-white/80" : "text-charcoal/85"}`}>
          Five Olympic and World Championship medalists from Ethiopia join the Gada Global 5K Peace Run. Tap a card to read their story.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {GUESTS.map((g) => {
          const isOpen = open === g.slug;
          return (
            <button
              key={g.slug}
              type="button"
              onClick={() => setOpen(isOpen ? null : g.slug)}
              aria-expanded={isOpen}
              className={`text-left rounded-2xl overflow-hidden border cursor-pointer p-0 transition-all hover:-translate-y-1 flex flex-col ${
                dark ? "bg-white/5 border-white/10 hover:border-yellow/40" : "bg-white border-charcoal/8 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
              } ${isOpen ? "col-span-2 md:col-span-3 lg:col-span-2" : ""}`}
            >
              <div className={`flex ${isOpen ? "flex-col sm:flex-row" : "flex-col"} w-full`}>
                <div className={`relative shrink-0 ${isOpen ? "aspect-[3/4] sm:w-[45%]" : "aspect-[3/4] w-full"}`}>
                  <Image src={g.image} alt={g.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                </div>
                <div className="p-4 flex-1">
                  <div className={`font-[family-name:var(--font-heading)] text-[17px] font-bold tracking-tight leading-tight ${dark ? "text-white" : "text-charcoal"}`}>
                    {g.name}
                  </div>
                  <div className={`text-[13px] mt-0.5 ${dark ? "text-white/55" : "text-charcoal/55"}`}>{g.amharic}</div>
                  <div className={`text-[13px] font-semibold mt-2 leading-snug ${dark ? "text-yellow" : "text-gold-dim"}`}>{g.title}</div>
                  {isOpen && (
                    <>
                      <ul className="list-none mt-3 space-y-1.5">
                        {g.highlights.map((h) => (
                          <li key={h} className={`text-[13px] leading-snug pl-3 relative ${dark ? "text-white/85" : "text-charcoal/80"}`}>
                            <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-sm bg-yellow" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <div className={`text-[12px] mt-3 ${dark ? "text-white/55" : "text-charcoal/55"}`}>
                        <span className="font-bold tracking-wider uppercase">Bests</span> {g.bests}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
