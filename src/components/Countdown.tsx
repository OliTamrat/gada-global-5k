"use client";

import { useState, useEffect } from "react";

const TARGET = new Date("2026-10-03T07:30:00-04:00").getTime();

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    setDiff(TARGET - Date.now());
    setMounted(true);
    const id = setInterval(() => setDiff(TARGET - Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const d = Math.max(0, Math.floor(diff / 86400000));
  const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
  const s = Math.max(0, Math.floor((diff % 60000) / 1000));

  const items = [
    { value: mounted ? String(d) : "--", label: "Days" },
    { value: mounted ? String(h).padStart(2, "0") : "--", label: "Hours" },
    { value: mounted ? String(m).padStart(2, "0") : "--", label: "Minutes" },
    { value: mounted ? String(s).padStart(2, "0") : "--", label: "Seconds" },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-charcoal-light border-t border-yellow/10">
      <div className="flex flex-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex-1 text-center py-6 px-4 border-r border-white/5 last:border-r-0"
          >
            <div className="text-2xl md:text-4xl font-black text-white tabular-nums leading-none mb-1 tracking-tight">
              {item.value}
            </div>
            <div className="text-[9px] font-bold tracking-[3px] uppercase text-yellow/60">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 px-10 py-6 yellow-card">
        <div>
          <div className="font-black text-charcoal text-base tracking-tight">
            October 3, 2026
          </div>
          <div className="text-xs font-semibold text-charcoal/55">
            Rock Creek Parkway, Washington DC
          </div>
        </div>
      </div>
    </div>
  );
}
