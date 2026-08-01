"use client";

import { useState } from "react";

// Podium tiers ordered left-to-right as they stand on a real podium:
// second, first (tallest, centre), third.
const TIERS = [
  {
    n: "2",
    label: "Second",
    metalName: "Silver",
    amount: "$200",
    height: "h-[74px] md:h-[88px]",
    metal: "linear-gradient(145deg,#F2F4F7 0%,#C9CDD4 45%,#9AA1AA 100%)",
    accent: "#DDE2E8",
    block: "linear-gradient(180deg,rgba(221,226,232,0.22) 0%,rgba(221,226,232,0.05) 100%)",
    border: "rgba(221,226,232,0.35)",
  },
  {
    n: "1",
    label: "First",
    metalName: "Gold",
    amount: "$300",
    height: "h-[104px] md:h-[124px]",
    metal: "linear-gradient(145deg,#F7DE7A 0%,#E8B930 45%,#C49B20 100%)",
    accent: "#F5D245",
    block: "linear-gradient(180deg,rgba(232,185,48,0.30) 0%,rgba(232,185,48,0.06) 100%)",
    border: "rgba(232,185,48,0.55)",
  },
  {
    n: "3",
    label: "Third",
    metalName: "Bronze",
    amount: "$100",
    height: "h-[58px] md:h-[68px]",
    metal: "linear-gradient(145deg,#E8B183 0%,#C4763A 45%,#96552A 100%)",
    accent: "#E0A070",
    block: "linear-gradient(180deg,rgba(196,118,58,0.26) 0%,rgba(196,118,58,0.05) 100%)",
    border: "rgba(196,118,58,0.45)",
  },
];

const DIVISIONS = [
  { key: "men", division: "Men", label: "Dhiira" },
  { key: "women", division: "Women", label: "Dubartii" },
] as const;

export function PrizePodium() {
  const [active, setActive] = useState(0);
  const div = DIVISIONS[active];

  return (
    <div className="max-w-[760px] mx-auto">
      {/* Division switch */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex gap-1 p-1 rounded-full bg-black/25 border border-white/12">
          {DIVISIONS.map((d, i) => {
            const on = i === active;
            return (
              <button
                key={d.key}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`px-5 md:px-7 py-2.5 rounded-full text-[14px] font-bold tracking-wide transition-all cursor-pointer ${
                  on
                    ? "bg-yellow text-charcoal shadow-[0_2px_12px_rgba(245,200,66,0.35)]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {d.division}
                <span className={`ml-2 text-[12px] font-semibold ${on ? "text-charcoal/60" : "text-yellow/70"}`}>
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Podium — keyed on division so it re-animates when switched */}
      <div key={div.key} className="grid grid-cols-3 gap-2.5 md:gap-4 items-end podium-in">
        {TIERS.map((t) => (
          <div key={t.n} className="flex flex-col items-center">
            {/* Medal disc */}
            <span
              className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-[0_3px_10px_rgba(0,0,0,0.4)] mb-2.5"
              style={{ background: t.metal }}
            >
              <span className="absolute inset-[3px] rounded-full border border-white/35" />
              <span className="relative text-[15px] font-black text-charcoal leading-none">{t.n}</span>
            </span>

            {/* Amount */}
            <span
              className="text-[22px] md:text-[30px] font-black tracking-tight tabular-nums leading-none mb-1"
              style={{ color: t.accent }}
            >
              {t.amount}
            </span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-[1.5px] uppercase text-white/60 mb-2.5">
              {t.metalName}
            </span>

            {/* Podium block */}
            <div
              className={`w-full ${t.height} rounded-t-xl border border-b-0 flex items-start justify-center pt-2.5`}
              style={{ background: t.block, borderColor: t.border }}
            >
              <span className="text-[12px] md:text-[13px] font-bold text-white/85">{t.label}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Podium floor — a solid base plate so the blocks read as standing on
          something rather than being cut off at the bottom. */}
      <div className="h-[7px] rounded-[3px] bg-gradient-to-r from-white/12 via-white/35 to-white/12 shadow-[0_6px_18px_rgba(0,0,0,0.35)]" />
      <div className="h-[10px] mx-6 rounded-b-lg bg-gradient-to-b from-black/25 to-transparent" />

      <p className="text-center text-[13px] text-white/70 mt-5 leading-relaxed">
        Both divisions pay identically &mdash; {" "}
        <span className="text-white/90 font-semibold">$1,200 total</span> across six winners. Age group
        awards and finisher medals are presented alongside the cash prizes.
      </p>
    </div>
  );
}
