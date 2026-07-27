"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

interface RaceResult {
  bib: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  startTime?: number;
  finishTime?: number;
  netTime?: number;
  pace?: string;
  position?: number;
  timingConfidence?: "high" | "medium" | "low";
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function RaceResultsPage() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "male" | "female">("all");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [seeded, setSeeded] = useState(false);

  const fetchResults = useCallback(async (seed = false) => {
    try {
      const url = seed ? "/api/race?seed=true" : "/api/race";
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
      setLastUpdate(new Date());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => fetchResults(), 5000);
    return () => clearInterval(interval);
  }, [fetchResults]);

  function handleSeedDemo() {
    setSeeded(true);
    fetchResults(true);
  }

  const filtered = results.filter((r) => {
    const matchesSearch =
      !search ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      String(r.bib).includes(search);
    const matchesGender =
      filter === "all" ||
      (filter === "male" && r.gender === "Male") ||
      (filter === "female" && r.gender === "Female");
    return matchesSearch && matchesGender;
  });

  const finished = filtered.filter((r) => r.finishTime);
  const running = filtered.filter((r) => r.startTime && !r.finishTime);
  const waiting = filtered.filter((r) => !r.startTime);

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-10">
          <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-4 block">
            Live Results
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-3 tracking-tight">
            Race Day Leaderboard
          </h1>
          <p className="text-[15px] text-white/78 max-w-[400px] mx-auto mb-2">
            Auto-refreshes every 5 seconds. Click any runner for their full race recap.
          </p>
          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 text-[12px] text-white/65">
              <span className="w-2 h-2 rounded-full bg-green-light animate-pulse" />
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </ScrollReveal>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Registered", value: total, color: "text-white" },
            { label: "Finished", value: finished.length, color: "text-yellow" },
            { label: "On Course", value: running.length, color: "text-green-light" },
          ].map((s) => (
            <div key={s.label} className="dark-card rounded-2xl p-5 text-center">
              <div className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</div>
              <div className="text-[12px] font-semibold text-white/72 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/65">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or bib number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[15px] placeholder:text-white/60 focus:outline-none focus:border-yellow/40 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "male", "female"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all ${
                  filter === f
                    ? "yellow-card"
                    : "bg-white/5 text-white/72 hover:text-white/90"
                }`}
              >
                {f === "all" ? "All" : f === "male" ? "Men" : "Women"}
              </button>
            ))}
          </div>
        </div>

        {/* Demo seed button */}
        {results.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-white/72 text-[15px] mb-4">No race data yet.</p>
            {!seeded && (
              <button
                onClick={handleSeedDemo}
                className="yellow-card px-6 py-3 rounded-xl font-bold text-[14px] tracking-wider uppercase cursor-pointer border-none hover:-translate-y-0.5 transition-all"
              >
                Load Demo Race Data
              </button>
            )}
          </div>
        )}

        {/* Results table */}
        {finished.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[12px] font-bold tracking-[3px] uppercase text-yellow/60 mb-4">
              Finished ({finished.length})
            </h3>
            <div className="space-y-2">
              {finished.map((r) => (
                <Link
                  key={r.bib}
                  href={`/race/${r.bib}`}
                  className="flex items-center gap-4 dark-card rounded-xl p-4 hover:border-yellow/20 hover:-translate-y-0.5 transition-all no-underline group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[15px] shrink-0 ${
                    r.position === 1 ? "bg-yellow text-charcoal" :
                    r.position === 2 ? "bg-white/20 text-white" :
                    r.position === 3 ? "bg-amber/20 text-amber" :
                    "bg-white/5 text-white/72"
                  }`}>
                    {r.position}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-white truncate group-hover:text-yellow transition-colors">
                      {r.firstName} {r.lastName}
                    </div>
                    <div className="text-[12px] text-white/70">
                      Bib #{r.bib} &middot; {r.gender} &middot; Age {r.age}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        r.timingConfidence === "high" ? "bg-green-light" :
                        r.timingConfidence === "low" ? "bg-red-oromo" : "bg-yellow"
                      }`} title={`${r.timingConfidence || "medium"} confidence`} />
                      <span className="text-[18px] font-black text-yellow tracking-tight tabular-nums">
                        {r.netTime ? formatTime(r.netTime) : "--"}
                      </span>
                    </div>
                    <div className="text-[12px] text-white/70">{r.pace}/mi</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/55 group-hover:text-yellow transition-colors shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* On course */}
        {running.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[12px] font-bold tracking-[3px] uppercase text-green-light/60 mb-4">
              On Course ({running.length})
            </h3>
            <div className="space-y-2">
              {running.map((r) => (
                <div key={r.bib} className="flex items-center gap-4 dark-card rounded-xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-green-deep/20 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-light animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-white truncate">
                      {r.firstName} {r.lastName}
                    </div>
                    <div className="text-[12px] text-white/70">
                      Bib #{r.bib} &middot; {r.gender} &middot; Age {r.age}
                    </div>
                  </div>
                  <div className="text-[14px] font-bold text-green-light tracking-tight">
                    Running...
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waiting */}
        {waiting.length > 0 && (
          <div>
            <h3 className="text-[12px] font-bold tracking-[3px] uppercase text-white/55 mb-4">
              Not Started ({waiting.length})
            </h3>
            <div className="space-y-2">
              {waiting.map((r) => (
                <div key={r.bib} className="flex items-center gap-4 bg-white/2 rounded-xl p-4 border border-white/4">
                  <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center text-white/55 font-bold text-[15px] shrink-0">
                    {r.bib}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-white/65 truncate">
                      {r.firstName} {r.lastName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-center flex-wrap mt-12">
          <Link href="/race/scan" className="bg-white/8 text-white px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
            Volunteer Scanner
          </Link>
          <Link href="/race/disputes" className="bg-white/8 text-white px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
            Dispute a Time
          </Link>
          <Link href="/" className="text-white/60 text-[14px] hover:text-yellow transition-colors no-underline flex items-center gap-2">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
