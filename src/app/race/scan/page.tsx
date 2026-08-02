"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface ScanLog {
  bib: number;
  type: "start" | "finish";
  time: string;
  success: boolean;
  message: string;
  consensus?: string;
}

export default function ScanPage() {
  const [mode, setMode] = useState<"start" | "finish">("finish");
  const [manualBib, setManualBib] = useState("");
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [volunteerId] = useState(() => "vol-" + Math.random().toString(36).slice(2, 6));
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleScan(bib: number) {
    if (scanning) return;
    setScanning(true);

    try {
      const res = await fetch("/api/race/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bib, type: mode, volunteerId }),
      });
      const data = await res.json();

      setLogs((prev) => [
        {
          bib,
          type: mode,
          time: new Date().toLocaleTimeString(),
          success: res.ok,
          message: res.ok ? data.message : data.error,
          consensus: data.consensus,
        },
        ...prev.slice(0, 49),
      ]);
    } catch {
      setLogs((prev) => [
        {
          bib,
          type: mode,
          time: new Date().toLocaleTimeString(),
          success: false,
          message: "Network error",
        },
        ...prev.slice(0, 49),
      ]);
    }

    setScanning(false);
    setManualBib("");
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bib = parseInt(manualBib);
    if (!isNaN(bib) && bib > 0) {
      handleScan(bib);
    }
  }

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-4 block">
            Volunteer Mode
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-2 tracking-tight">
            Race Scanner
          </h1>
          <p className="text-[14px] text-white/72">
            Enter bib numbers as runners cross the line.
          </p>
          <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-white/5 text-[12px] text-white/65 font-mono">
            Volunteer ID: {volunteerId}
          </div>
        </div>

        {/* Mode toggle.
            Finish is the default and the normal case. Start is kept only as a
            manual override for a single late runner — the start line itself is
            run from /race/start, which sends a whole wave in one tap. */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {(["finish", "start"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`py-4 rounded-xl font-black text-[15px] uppercase tracking-wider border-2 cursor-pointer transition-all ${
                mode === m
                  ? m === "start"
                    ? "bg-green-deep text-white border-green-light"
                    : "yellow-card border-yellow"
                  : "bg-white/5 text-white/65 border-white/8 hover:border-white/20"
              }`}
            >
              {m === "start" ? "Late Start" : "Finish Line"}
            </button>
          ))}
        </div>

        <p className="text-[13px] leading-[1.6] text-white/55 mb-8">
          {mode === "finish"
            ? "Scan every runner as they cross the line."
            : "Only for a runner who set off after their wave. To start a whole wave, use the start-line screen."}
          {" "}
          <Link href="/race/start" className="text-yellow no-underline font-semibold">
            Start line →
          </Link>
        </p>

        {/* Manual bib entry */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              placeholder="Bib #"
              value={manualBib}
              onChange={(e) => setManualBib(e.target.value)}
              autoFocus
              className="flex-1 min-w-0 px-6 py-4 rounded-xl bg-white/5 border border-white/15 text-white text-2xl font-black text-center placeholder:text-white/55 focus:outline-none focus:border-yellow/50 transition-colors tabular-nums"
            />
            <button
              type="submit"
              disabled={scanning || !manualBib}
              className={`shrink-0 w-[90px] py-4 rounded-xl font-bold text-[15px] uppercase tracking-wider border-none cursor-pointer transition-all ${
                mode === "start"
                  ? "bg-green-deep text-white hover:bg-green-light"
                  : "yellow-card hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)]"
              } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              {scanning ? "..." : "Scan"}
            </button>
          </div>
        </form>

        {/* Scan log */}
        <div>
          <h3 className="text-[12px] font-bold tracking-[3px] uppercase text-white/65 mb-4">
            Scan Log ({logs.length})
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-4 ${
                  log.success
                    ? "bg-green-deep/15 border border-green-light/20"
                    : "bg-red-oromo/10 border border-red-oromo/20"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black ${
                    log.success ? "bg-green-light/20 text-green-light" : "bg-red-oromo/20 text-red-oromo"
                  }`}
                >
                  {log.success ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-white">
                    Bib #{log.bib} &middot;{" "}
                    <span className={log.type === "start" ? "text-green-light" : "text-yellow"}>
                      {log.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[12px] text-white/70">{log.message}</div>
                  {log.consensus && (
                    <div className={`text-[11px] font-semibold mt-0.5 ${
                      log.consensus.includes("HIGH") ? "text-green-light" :
                      log.consensus.includes("LOW") ? "text-red-oromo" : "text-yellow/70"
                    }`}>{log.consensus}</div>
                  )}
                </div>
                <div className="text-[12px] text-white/60 tabular-nums shrink-0">{log.time}</div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-white/55 text-[14px] text-center py-8">
                No scans yet. Enter a bib number above.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-10">
          <Link href="/race" className="bg-white/8 text-white px-5 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline text-center">
            View Results
          </Link>
          <Link href="/race/disputes" className="bg-white/8 text-white px-5 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline text-center">
            Disputes
          </Link>
          <Link href="/" className="col-span-2 text-white/60 text-[14px] hover:text-yellow transition-colors no-underline flex items-center justify-center gap-2">
            &larr; Home
          </Link>
        </div>
      </div>
    </main>
  );
}
