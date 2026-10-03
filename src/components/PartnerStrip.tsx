"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PARTNERS, type Partner } from "@/lib/partners";

const ADVANCE_MS = 2800;

function Logo({ p, front }: { p: Partner; front: boolean }) {
  if (p.shape !== "wide") {
    return (
      <div
        className={`relative overflow-hidden transition-all duration-700 ${p.shape === "round" ? "rounded-full" : "rounded-[28px]"} ${
          front
            ? "w-[108px] h-[108px] md:w-[156px] md:h-[156px] ring-4 ring-yellow shadow-[0_0_60px_rgba(245,200,66,0.45)]"
            : "w-[76px] h-[76px] md:w-[116px] md:h-[116px] ring-2 ring-white/15"
        }`}
      >
        <Image src={p.logo} alt="" fill className="object-cover" sizes="160px" />
      </div>
    );
  }
  return (
    <div
      className={`relative rounded-2xl transition-all duration-700 ${p.tile === "light" ? "bg-white" : "bg-[#1d1b19]"} ${
        front
          ? "w-[160px] h-[96px] md:w-[250px] md:h-[140px] ring-4 ring-yellow shadow-[0_0_60px_rgba(245,200,66,0.45)]"
          : "w-[112px] h-[68px] md:w-[180px] md:h-[104px] ring-2 ring-white/15"
      }`}
    >
      <Image src={p.logo} alt="" fill className={`object-contain ${p.tile === "light" ? "p-3" : "p-2"}`} sizes="250px" />
    </div>
  );
}

/**
 * "Thank you to our partners": a 3D rotating spotlight. The featured partner
 * sits large in the centre with its name beneath; the rest fan out on either
 * side, angled back. Advances on a timer, pauses on hover, focus or touch,
 * and can be driven by swipe, arrows, dots or tapping a logo. With reduced
 * motion it never auto-advances.
 */
export function PartnerStrip({ title = "Thank you to our partners" }: { title?: string }) {
  const n = PARTNERS.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    void Promise.resolve().then(update);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => setActive((a) => (a + 1) % n), ADVANCE_MS);
    return () => clearInterval(t);
  }, [paused, reduced, n]);

  const current = PARTNERS[active];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-2">{title}</div>

      <div
        className="relative h-[210px] md:h-[250px] select-none [perspective:1200px] overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Event partners"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={(e) => { setPaused(true); touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const start = touchX.current;
          touchX.current = null;
          if (start !== null) {
            const dx = e.changedTouches[0].clientX - start;
            if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
          }
          setTimeout(() => setPaused(false), 4000);
        }}
      >
        {/* soft spotlight behind the front logo */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[240px] rounded-full bg-[radial-gradient(closest-side,rgba(245,200,66,0.18),transparent)]" />
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {PARTNERS.map((p, i) => {
            // Shortest signed distance from the active logo, so the ring wraps.
            let d = i - active;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const ad = Math.abs(d);
            const front = d === 0;
            const hidden = ad > 3;
            const body = <Logo p={p} front={front} />;
            return (
              <div
                key={p.name}
                className="absolute left-1/2 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translate(-50%, -50%) translateX(calc(${d} * clamp(118px, 17vw, 190px))) translateZ(${-ad * 110}px) rotateY(${d * -32}deg)`,
                  opacity: hidden ? 0 : 1 - ad * 0.22,
                  zIndex: 10 - ad,
                  filter: front ? "none" : `saturate(${1 - ad * 0.2}) brightness(${1 - ad * 0.12})`,
                  pointerEvents: hidden ? "none" : "auto",
                }}
              >
                {front && p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} (opens in a new tab)`}>{body}</a>
                ) : (
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={front ? p.name : `Show ${p.name}`}
                    aria-current={front || undefined}
                    tabIndex={hidden ? -1 : 0}
                    className="bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {body}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 -mt-1">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous partner" className="w-9 h-9 rounded-full grid place-items-center bg-white/5 border border-white/15 text-white hover:border-yellow hover:text-yellow cursor-pointer transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="min-w-[220px] text-center" aria-live="polite">
          <div key={current.name} className="font-[family-name:var(--font-heading)] text-white text-lg md:text-xl font-bold animate-[partnerName_500ms_ease-out]">
            {current.name}
          </div>
        </div>
        <button type="button" onClick={() => go(active + 1)} aria-label="Next partner" className="w-9 h-9 rounded-full grid place-items-center bg-white/5 border border-white/15 text-white hover:border-yellow hover:text-yellow cursor-pointer transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Choose a partner">
        {PARTNERS.map((p, i) => (
          <button
            key={p.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={p.name}
            onClick={() => go(i)}
            className={`h-2 rounded-full border-0 p-0 cursor-pointer transition-all duration-500 ${i === active ? "w-7 bg-yellow" : "w-2 bg-white/25 hover:bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
