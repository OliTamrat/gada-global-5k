"use client";

import { useState } from "react";
import Image from "next/image";
import { GUESTS } from "@/lib/guests";
import { ScrollReveal } from "@/components/ScrollReveal";

const Medal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="15" r="6" /><path d="M8.5 9.5 6 2h4l2 5 2-5h4l-2.5 7.5" />
  </svg>
);

/**
 * Five medalist guests as full-photo poster cards. Tapping a card turns it over
 * to show career highlights and personal bests.
 */
export function HonorableGuests({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [open, setOpen] = useState<string | null>(null);
  const dark = tone === "dark";

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(245,200,66,0.16),transparent)]" />

      <ScrollReveal className="text-center mb-12 relative">
        <span className={`inline-flex items-center gap-2 text-[12px] font-bold tracking-[4px] uppercase mb-5 ${dark ? "text-yellow" : "text-gold-dim"}`}>
          <Medal /> Honorable Guests
        </span>
        <h2 className={`font-[family-name:var(--font-heading)] text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.05] tracking-tight mb-5 ${dark ? "text-white" : ""}`}>
          Run with <span className="text-yellow">legends</span>.
        </h2>
        <p className={`text-base md:text-[17px] leading-[1.8] max-w-[600px] mx-auto ${dark ? "text-white/80" : "text-charcoal/85"}`}>
          Five Olympic and World Championship medalists who carried Ethiopia&apos;s flag onto the world&apos;s greatest stages, here at the Gada Global 5K Peace Run.
        </p>
      </ScrollReveal>

      {/* Phones: a swipeable row of full-size posters. Desktop: all five in a line. */}
      <div className="relative -mx-6 px-6 md:mx-0 md:px-0 flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GUESTS.map((g) => {
          const isOpen = open === g.slug;
          return (
            <button
              key={g.slug}
              type="button"
              onClick={() => setOpen(isOpen ? null : g.slug)}
              aria-expanded={isOpen}
              aria-label={`${g.name}, ${g.title}. ${isOpen ? "Hide" : "Show"} career highlights`}
              className="group relative shrink-0 w-[78vw] max-w-[320px] sm:w-[44vw] lg:w-auto lg:max-w-none aspect-[2/3] snap-center rounded-2xl overflow-hidden border-0 p-0 cursor-pointer text-left bg-charcoal shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 hover:ring-yellow/60 transition-all duration-300"
            >
              <Image
                src={g.image}
                alt={g.name}
                fill
                className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-[1.06]"
                sizes="(max-width: 1024px) 50vw, 20vw"
              />
              {/* Legibility: dark from the bottom, warm wash from the top. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-yellow/10 via-transparent to-transparent mix-blend-overlay" />

              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-yellow text-charcoal text-[10px] md:text-[11px] font-black tracking-[1.5px] uppercase px-2.5 py-1.5 rounded-full shadow-lg">
                <Medal /> {g.badge}
              </span>

              <div className={`absolute inset-x-0 bottom-0 p-4 md:p-5 transition-all duration-300 ${isOpen ? "opacity-0 translate-y-3" : "opacity-100"}`}>
                <div className="font-[family-name:var(--font-heading)] text-white font-black tracking-tight leading-[1.02] text-[26px] lg:text-[22px]">
                  {g.name}
                </div>
                <div className="text-white/60 text-[13px] mt-1">{g.amharic}</div>
                <div className="h-[2px] w-10 bg-yellow my-2.5 transition-all duration-500 group-hover:w-20" />
                <div className="text-yellow text-[13px] font-bold leading-snug">{g.title}</div>
                <div className="text-white/55 text-[11px] font-bold tracking-[2px] uppercase mt-3">Tap for story</div>
              </div>

              {/* Back of the card */}
              <div className={`absolute inset-0 bg-charcoal/92 backdrop-blur-[2px] p-4 md:p-5 flex flex-col transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="font-[family-name:var(--font-heading)] text-white font-black text-[21px] lg:text-[18px] leading-tight mt-9">{g.name}</div>
                <div className="text-yellow text-[12px] font-bold mt-1 leading-snug">{g.title}</div>
                <ul className="list-none mt-3 space-y-2 flex-1 overflow-hidden">
                  {g.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-white/88 text-[14px] lg:text-[12.5px] leading-snug pl-3.5 relative">
                      <span className="absolute left-0 top-[6px] w-1.5 h-1.5 rounded-full bg-yellow" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="text-white/55 text-[11px] border-t border-white/10 pt-2.5">
                  <span className="font-bold tracking-[2px] uppercase text-yellow/80">Bests</span> {g.bests}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <p className={`lg:hidden text-center text-[12px] font-bold tracking-[3px] uppercase mt-3 ${dark ? "text-white/50" : "text-charcoal/50"}`}>
        Swipe to meet all five
      </p>
    </div>
  );
}
