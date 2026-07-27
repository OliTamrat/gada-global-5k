"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface RunnerData {
  runner: {
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
  };
  stats: {
    totalFinished: number;
    genderPos?: number;
    genderTotal: number;
    ageGroup: string;
    agePos?: number;
    ageTotal: number;
  };
  recap: string;
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function RunnerPage({ params }: { params: Promise<{ bib: string }> }) {
  const { bib } = use(params);
  const [data, setData] = useState<RunnerData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/race/runner?bib=${bib}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load runner data"));
  }, [bib]);

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${data?.runner.firstName}'s Gada 5K Result`,
        text: data?.recap || "",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (error) {
    return (
      <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Runner Not Found</h1>
          <p className="text-white/78 mb-8">{error}</p>
          <Link href="/race" className="yellow-card px-6 py-3 rounded-xl font-bold text-[14px] no-underline">
            View All Results
          </Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="text-white/65 text-[15px]">Loading runner data...</div>
      </main>
    );
  }

  const { runner, stats, recap } = data;
  const isFinished = !!runner.finishTime;
  const percentile = isFinished && runner.position
    ? Math.round(((stats.totalFinished - runner.position + 1) / stats.totalFinished) * 100)
    : 0;

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-2xl mx-auto">
        {/* Result card */}
        <div className="dark-card rounded-2xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow/15 via-yellow/5 to-transparent p-8 border-b border-white/6">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl ${
                isFinished ? "yellow-card" : "bg-green-deep text-white"
              }`}>
                {isFinished ? `#${runner.position}` : (
                  <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                )}
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white tracking-tight">
                  {runner.firstName} {runner.lastName}
                </h1>
                <div className="text-[14px] text-white/75 mt-1">
                  Bib #{runner.bib} &middot; {runner.gender} &middot; Age {runner.age} &middot; {stats.ageGroup}
                </div>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="p-8 text-center border-b border-white/6">
            {isFinished && runner.netTime ? (
              <>
                <div className="text-[12px] font-bold tracking-[4px] uppercase text-yellow/60 mb-2">Official Time</div>
                <div className="text-5xl md:text-6xl font-black text-yellow tracking-tight tabular-nums font-[family-name:var(--font-heading)]">
                  {formatTime(runner.netTime)}
                </div>
                <div className="text-[15px] text-white/75 mt-2">
                  Pace: {runner.pace}/mi
                </div>
                <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  runner.timingConfidence === "high" ? "bg-green-deep/20 text-green-light" :
                  runner.timingConfidence === "low" ? "bg-red-oromo/15 text-red-oromo" :
                  "bg-yellow/10 text-yellow/70"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    runner.timingConfidence === "high" ? "bg-green-light" :
                    runner.timingConfidence === "low" ? "bg-red-oromo" : "bg-yellow"
                  }`} />
                  {runner.timingConfidence || "medium"} confidence timing
                </div>
              </>
            ) : runner.startTime ? (
              <>
                <div className="text-[12px] font-bold tracking-[4px] uppercase text-green-light/60 mb-2">Status</div>
                <div className="text-3xl font-black text-green-light tracking-tight">On Course</div>
              </>
            ) : (
              <>
                <div className="text-[12px] font-bold tracking-[4px] uppercase text-white/65 mb-2">Status</div>
                <div className="text-3xl font-bold text-white/65">Not Started</div>
              </>
            )}
          </div>

          {/* Stats grid */}
          {isFinished && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/6 border-b border-white/6">
              {[
                { label: "Overall", value: `${runner.position}/${stats.totalFinished}` },
                { label: runner.gender, value: `${stats.genderPos}/${stats.genderTotal}` },
                { label: stats.ageGroup, value: `${stats.agePos}/${stats.ageTotal}` },
                { label: "Top", value: `${100 - percentile}%` },
              ].map((s) => (
                <div key={s.label} className="p-5 text-center">
                  <div className="text-lg font-black text-white tracking-tight">{s.value}</div>
                  <div className="text-[11px] font-semibold text-white/70 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* AI Recap */}
          {recap && (
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="text-[12px] font-bold tracking-[3px] uppercase text-yellow/60">AI Race Recap</span>
              </div>
              <p className="text-[16px] text-white/92 leading-[1.85]">{recap}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleShare}
            className="yellow-card px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase cursor-pointer border-none hover:-translate-y-0.5 transition-all"
          >
            {copied ? "Link Copied" : "Share Result"}
          </button>
          <Link href="/race" className="bg-white/8 text-white px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
            All Results
          </Link>
          <Link href="/race/disputes" className="bg-white/4 text-white/72 px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/6 hover:text-yellow transition-all no-underline">
            Dispute Time
          </Link>
        </div>
      </div>
    </main>
  );
}
