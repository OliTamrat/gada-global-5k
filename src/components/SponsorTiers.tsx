"use client";

import { useState, type ReactNode } from "react";
import {
  SPONSOR_TIERS,
  SPONSOR_BENEFITS,
  unlockedBy,
  sponsorMailto,
  type BenefitIcon,
  type SponsorTierId,
} from "@/lib/sponsors";

const ICONS: Record<BenefitIcon, ReactNode> = {
  shirt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 3L12 6l3.5-3L21 6l-2 4h-2v11H7V10H5L3 6l5.5-3z" />
    </svg>
  ),
  banner: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16v11H4z" />
      <path d="M4 15v5M20 15v5M8 9h8" />
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
    </svg>
  ),
  mic: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" />
    </svg>
  ),
};

export function SponsorTiers() {
  // Opens on Platinum rather than closed: an empty panel below four cards
  // reads as a broken page, and the top level is the one to anchor on.
  const [openId, setOpenId] = useState<SponsorTierId>("platinum");
  const tier = SPONSOR_TIERS.find((t) => t.id === openId) ?? SPONSOR_TIERS[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Two columns on phones so the detail panel is never more than one row
          away from the card that opened it. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {SPONSOR_TIERS.map((t) => {
          const on = t.id === openId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setOpenId(t.id)}
              aria-expanded={on}
              aria-controls="sponsor-detail"
              className={`group relative flex flex-col items-center rounded-2xl px-3 py-5 md:py-6 cursor-pointer transition-all duration-200 ${
                on
                  ? "-translate-y-1 shadow-[0_14px_36px_rgba(0,0,0,0.45)]"
                  : "bg-white/[0.045] border border-white/10 hover:bg-white/[0.08] hover:-translate-y-0.5"
              }`}
              style={
                on
                  ? { background: t.panel, border: `1px solid ${t.border}` }
                  : undefined
              }
            >
              <span
                className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-[0_3px_10px_rgba(0,0,0,0.45)] mb-3"
                style={{ background: t.medal }}
              >
                <span className="absolute inset-[3px] rounded-full border border-white/35" />
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#141210" aria-hidden="true" className="relative">
                  <path d="M12 2l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 16.85 6.19 19.9 7.3 13.43 2.6 8.85l6.5-.95L12 2z" />
                </svg>
              </span>

              <span
                className="text-[13px] md:text-[14px] font-bold tracking-[1.5px] uppercase leading-none mb-1.5"
                style={{ color: on ? t.accent : "rgba(255,255,255,0.72)" }}
              >
                {t.name}
              </span>
              <span
                className="text-[19px] md:text-[22px] font-black tracking-tight tabular-nums leading-none"
                style={{ color: on ? t.accent : "rgba(255,255,255,0.92)" }}
              >
                {t.amount}
              </span>

              <span
                className={`mt-3 text-[10px] font-bold tracking-[1.5px] uppercase transition-colors ${
                  on ? "text-white/45" : "text-white/35 group-hover:text-white/60"
                }`}
              >
                {on ? "Showing below" : "See benefits"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel — keyed on the tier so it re-runs its entry animation
          each time a different level is opened. */}
      <div
        id="sponsor-detail"
        key={tier.id}
        className="mt-4 md:mt-5 rounded-2xl overflow-hidden sponsor-panel-in"
        style={{ background: tier.panel, border: `1px solid ${tier.border}` }}
      >
        <div
          className="px-5 md:px-8 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.09)" }}
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3
              className="font-[family-name:var(--font-heading)] text-[20px] md:text-[24px] font-bold tracking-tight leading-none"
              style={{ color: tier.accent }}
            >
              {tier.name} Sponsor
            </h3>
            <span className="text-[15px] md:text-[17px] font-black text-white/85 tabular-nums leading-none">
              {tier.amount}
            </span>
          </div>
          <p className="text-[14px] md:text-[15px] text-white/70 leading-relaxed mt-2">
            {tier.blurb}
          </p>
        </div>

        <ul className="list-none divide-y divide-white/[0.07]">
          {SPONSOR_BENEFITS.map((b) => {
            const included = b.tiers.includes(tier.id);
            const unlock = unlockedBy(b);
            return (
              <li
                key={b.id}
                className={`flex gap-3.5 md:gap-4 px-5 md:px-8 py-4 ${
                  included ? "" : "opacity-55"
                }`}
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: included
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(255,255,255,0.04)",
                    color: included ? tier.accent : "rgba(255,255,255,0.4)",
                  }}
                >
                  {ICONS[b.icon]}
                </span>

                <span className="flex-1 min-w-0">
                  <span className="flex items-start gap-2">
                    {/* A tick for what is included, a muted dash for what is
                        not. A red cross on a page asking a business for money
                        reads as rejection; a dash reads as "higher level". */}
                    {included ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tier.accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-[3px]">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3.2" strokeLinecap="round" aria-hidden="true" className="shrink-0 mt-[3px]">
                        <path d="M5 12h14" />
                      </svg>
                    )}
                    <span className="text-[15px] md:text-[16px] font-semibold text-white leading-snug">
                      {b.label}
                    </span>
                  </span>

                  <span className="block text-[13px] md:text-[14px] text-white/62 leading-[1.7] mt-1.5 pl-[23px]">
                    {included ? (
                      b.detail
                    ) : (
                      <>
                        Included from{" "}
                        <button
                          type="button"
                          onClick={() => setOpenId(unlock.id)}
                          className="font-semibold underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80"
                          style={{ color: unlock.accent }}
                        >
                          {unlock.name} ({unlock.amount})
                        </button>{" "}
                        upwards.
                      </>
                    )}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="px-5 md:px-8 py-5 border-t border-white/[0.07]">
          <a
            href={sponsorMailto(tier)}
            className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-bold text-[13px] tracking-wider uppercase no-underline transition-all hover:-translate-y-0.5"
            style={{ background: tier.accent, color: "#141210" }}
          >
            Become a {tier.name} Sponsor
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="text-[12.5px] text-white/45 leading-relaxed mt-3">
            Opens an email to the organizers with the level filled in. Nothing is
            charged online — we will confirm the details with you first.
          </p>
        </div>
      </div>
    </div>
  );
}
