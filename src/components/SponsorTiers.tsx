"use client";

import { useState, type ReactNode } from "react";
import {
  SPONSOR_TIERS,
  SPONSOR_BENEFITS,
  includedCount,
  unlockedBy,
  sponsorMailto,
  type BenefitIcon,
  type SponsorTierId,
} from "@/lib/sponsors";
import { CoverageMeter } from "@/components/CoverageMeter";

/**
 * Sponsorship levels as a vertical accordion.
 *
 * The organizers' flyer sets out the same offer as a four-column comparison
 * table with metal medallions and a green/gold/silver/brown colour scheme. That
 * was a reference for the offer, not a design to reproduce — this is the site's
 * own language: charcoal surfaces, one yellow accent, a rail whose weight
 * carries the hierarchy, and a coverage meter instead of a grid of ticks and
 * crosses.
 */

const ACCENT = "#F5C842";

const ICONS: Record<BenefitIcon, ReactNode> = {
  shirt: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 3L12 6l3.5-3L21 6l-2 4h-2v11H7V10H5L3 6l5.5-3z" />
    </svg>
  ),
  banner: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16v11H4z" />
      <path d="M4 15v5M20 15v5M8 9h8" />
    </svg>
  ),
  globe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
    </svg>
  ),
  mic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0014 0M12 18v4M8 22h8" />
    </svg>
  ),
};

export function SponsorTiers({
  initialOpen = "platinum",
}: {
  /** Which level starts open. Set from ?level= so a homepage tile lands on
   *  the level that was tapped rather than always on Platinum. */
  initialOpen?: SponsorTierId;
}) {
  // Opens on a level rather than closed: four collapsed rows tell a business
  // nothing, and the best offer is the one to read first.
  const [openId, setOpenId] = useState<SponsorTierId | null>(initialOpen);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {SPONSOR_TIERS.map((tier) => {
        const open = tier.id === openId;
        const count = includedCount(tier.id);

        return (
          <div
            key={tier.id}
            className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${
              open
                ? "bg-white/[0.06] border border-white/14"
                : "bg-white/[0.028] border border-white/8 hover:bg-white/[0.05]"
            }`}
          >
            {/* Accent rail — the level's weight, not a metal colour. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity"
              style={{ background: ACCENT, opacity: open ? tier.weight : tier.weight * 0.5 }}
            />

            <button
              type="button"
              onClick={() => setOpenId(open ? null : tier.id)}
              aria-expanded={open}
              aria-controls={`sponsor-panel-${tier.id}`}
              className="w-full flex items-center gap-4 md:gap-6 pl-6 md:pl-7 pr-4 md:pr-6 py-5 bg-transparent border-none cursor-pointer text-left"
            >
              <span className="flex-1 min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className="text-[13px] md:text-[14px] font-bold tracking-[2.5px] uppercase leading-none"
                    style={{ color: open ? ACCENT : "rgba(255,255,255,0.8)" }}
                  >
                    {tier.name}
                  </span>
                  <span className="text-[19px] md:text-[22px] font-black tracking-tight tabular-nums leading-none text-white">
                    {tier.amount}
                  </span>
                </span>
                <span className="flex items-center gap-3 mt-3">
                  <CoverageMeter filled={count} dim={!open} />
                  <span className="text-[12px] font-semibold text-white/45 tabular-nums">
                    {`${count} of ${SPONSOR_BENEFITS.length}`}
                  </span>
                </span>
              </span>

              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`shrink-0 transition-transform duration-200 ${
                  open ? "rotate-180 text-yellow" : "text-white/40"
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {open && (
              <div id={`sponsor-panel-${tier.id}`} className="sponsor-panel-in">
                <p className="text-[15px] md:text-[16px] text-white/70 leading-relaxed pl-6 md:pl-7 pr-5 md:pr-6 pb-5">
                  {tier.blurb}
                </p>

                <ul className="list-none border-t border-white/[0.07] divide-y divide-white/[0.06]">
                  {SPONSOR_BENEFITS.map((b) => {
                    const included = b.tiers.includes(tier.id);
                    const unlock = unlockedBy(b);
                    return (
                      <li
                        key={b.id}
                        className="flex gap-3.5 md:gap-4 pl-6 md:pl-7 pr-5 md:pr-6 py-4"
                      >
                        <span
                          className="mt-[3px] shrink-0"
                          style={{ color: included ? ACCENT : "rgba(255,255,255,0.28)" }}
                        >
                          {ICONS[b.icon]}
                        </span>

                        <span className="flex-1 min-w-0">
                          <span
                            className={`block text-[15px] md:text-[16px] font-semibold leading-snug ${
                              included ? "text-white" : "text-white/45"
                            }`}
                          >
                            {b.label}
                          </span>
                          <span className="block text-[13px] md:text-[14px] leading-[1.7] mt-1.5">
                            {included ? (
                              <span className="text-white/60">{b.detail}</span>
                            ) : (
                              // Not a red cross. A business reading this page is
                              // being asked for money — point them at the level
                              // that includes it instead of telling them no.
                              <span className="text-white/40">
                                From{" "}
                                <button
                                  type="button"
                                  onClick={() => setOpenId(unlock.id)}
                                  className="font-semibold text-yellow underline underline-offset-2 bg-transparent border-none p-0 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  {unlock.name} ({unlock.amount})
                                </button>{" "}
                                upwards
                              </span>
                            )}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="pl-6 md:pl-7 pr-5 md:pr-6 py-5 border-t border-white/[0.07]">
                  <a
                    href={sponsorMailto(tier)}
                    className="inline-flex items-center gap-2.5 yellow-card rounded-xl px-6 py-3.5 font-bold text-[13px] tracking-wider uppercase no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,200,66,0.28)]"
                  >
                    {`Sponsor at ${tier.name}`}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <p className="text-[12.5px] text-white/42 leading-relaxed mt-3">
                    Opens an email with the level filled in. Nothing is charged
                    online &mdash; we confirm the details with you first.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
