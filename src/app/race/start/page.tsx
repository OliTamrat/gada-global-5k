"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { WAVES, WAVE_META, type Wave } from "@/lib/waves";
import { OpsGate, opsFetch } from "@/components/OpsGate";

interface WaveStatus {
  wave: Wave;
  startedAt?: number;
  startedBy?: string;
  registered: number;
  finished: number;
}

function clockTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function elapsed(sinceMs: number, nowMs: number): string {
  const total = Math.max(0, Math.floor((nowMs - sinceMs) / 1000));
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function StartLinePage() {
  return (
    <OpsGate title="Start line">
      <StartLineScreen />
    </OpsGate>
  );
}

function StartLineScreen() {
  const [statuses, setStatuses] = useState<WaveStatus[]>([]);
  const [confirming, setConfirming] = useState<Wave | null>(null);
  const [busy, setBusy] = useState<Wave | null>(null);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [locked, setLocked] = useState(false);
  const [raceDay, setRaceDay] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await opsFetch("/api/race/waves");
      const data = await res.json();
      if (data.waves) setStatuses(data.waves);
      setLocked(Boolean(data.locked));
      setRaceDay(data.raceDay ?? "");
    } catch {
      // A dropped poll on a phone at a start line is not worth surfacing.
    }
  }, []);

  useEffect(() => {
    const poll = setInterval(load, 5000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    // Deferred to a microtask so the first fetch does not set state during the
    // effect body itself, which react-hooks/set-state-in-effect rejects.
    void Promise.resolve().then(load);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [load]);

  async function send(wave: Wave) {
    setBusy(wave);
    setConfirming(null);
    try {
      const res = await opsFetch("/api/race/waves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wave, volunteerId: "starter" }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || "");
      await load();
    } catch {
      setMessage("Could not reach the server. Check signal and try again.");
    } finally {
      setBusy(null);
    }
  }

  const byWave = new Map(statuses.map((s) => [s.wave, s]));

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-[560px] mx-auto">
        <div className="mb-7">
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-yellow mb-2 block">
            Start Line
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-bold text-white tracking-tight mb-2">
            Send a wave
          </h1>
          <p className="text-[14px] leading-[1.7] text-white/70">
            One tap starts the clock for everyone in that wave. Runners are not
            scanned here — only at the finish.
          </p>
        </div>

        {locked && (
          <div className="bg-yellow/10 border border-yellow/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-[14px] font-bold text-yellow m-0 mb-1">
              Timing is locked until race day{raceDay ? ` (${raceDay})` : ""}
            </p>
            <p className="text-[13px] leading-[1.6] text-white/70 m-0">
              Waves and finish scans are refused until then, so testing this
              screen cannot start anybody&apos;s clock.
            </p>
          </div>
        )}

        {message && (
          <div className="bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-[14px] text-white/90 mb-6">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {WAVES.map((wave) => {
            const meta = WAVE_META[wave];
            const status = byWave.get(wave);
            const started = Boolean(status?.startedAt);

            return (
              <div
                key={wave}
                className={`rounded-2xl border p-5 transition-colors ${
                  started
                    ? "bg-white/6 border-white/12"
                    : "bg-white/10 border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span
                        className={`text-[10px] font-black tracking-[2px] uppercase px-2 py-1 rounded ${meta.bandClass}`}
                      >
                        {meta.bandLabel}
                      </span>
                      {started && (
                        <span className="text-[11px] font-bold tracking-wider uppercase text-green-light">
                          Running
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-white/65 leading-snug">
                      {status?.registered ?? 0} registered
                      {status?.finished ? ` · ${status.finished} finished` : ""}
                    </div>
                  </div>

                  {started && status?.startedAt && (
                    <div className="text-right shrink-0">
                      <div className="text-[22px] font-black text-white tabular-nums leading-none">
                        {elapsed(status.startedAt, now)}
                      </div>
                      <div className="text-[11px] text-white/55 mt-1">
                        sent {clockTime(status.startedAt)}
                      </div>
                    </div>
                  )}
                </div>

                {started ? (
                  <div className="text-[13px] text-white/50">
                    Clock is running. This cannot be restarted.
                  </div>
                ) : confirming === wave ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => send(wave)}
                      disabled={busy === wave}
                      className="flex-1 bg-yellow text-charcoal rounded-xl py-3.5 font-black text-[15px] tracking-wider uppercase border-none cursor-pointer disabled:opacity-60"
                    >
                      {busy === wave ? "Sending…" : "Confirm — send now"}
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="px-5 rounded-xl border border-white/20 bg-transparent text-white/80 font-bold text-[13px] tracking-wider uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Two taps on purpose. Sending a wave early cannot be undone.
                  <button
                    onClick={() => setConfirming(wave)}
                    className="w-full bg-white/12 text-white rounded-xl py-3.5 font-bold text-[15px] tracking-wider uppercase border border-white/15 cursor-pointer hover:bg-white/18 transition-colors"
                  >
                    Send {meta.label} wave
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/race/scan"
            className="text-[13px] font-bold tracking-wider uppercase text-yellow no-underline"
          >
            Finish line scanner →
          </Link>
          <Link
            href="/race"
            className="text-[13px] font-bold tracking-wider uppercase text-white/60 no-underline"
          >
            Live results →
          </Link>
        </div>
      </div>
    </main>
  );
}
