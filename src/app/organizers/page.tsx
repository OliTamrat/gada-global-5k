"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { OpsGate, opsFetch } from "@/components/OpsGate";
import { WAVE_META, coerceWave } from "@/lib/waves";

interface Dashboard {
  totals: { paid: number; pending: number; revenueCents: number };
  byWave: Record<string, number>;
  byTier: Record<string, number>;
  byShirt: Record<string, number>;
  recent: Array<{
    bib: number | null;
    name: string;
    email: string;
    wave: string;
    tier: string;
    amountCents: number;
    shirt: string | null;
    registeredAt: string;
  }>;
}

const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const SHIRT_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "unspecified"];

export default function OrganizersPage() {
  return (
    <OpsGate title="Organizer dashboard">
      <OrganizerDashboard />
    </OpsGate>
  );
}

function OrganizerDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await opsFetch("/api/organizers");
      if (!res.ok) {
        setError((await res.json()).error ?? "Could not load registrations.");
        return;
      }
      setError("");
      setData(await res.json());
    } catch {
      setError("Could not reach the server.");
    }
  }, []);

  useEffect(() => {
    const poll = setInterval(load, 30000);
    void Promise.resolve().then(load);
    return () => clearInterval(poll);
  }, [load]);

  function downloadCsv() {
    // A plain link cannot carry the passcode header, so fetch it and hand the
    // browser a blob instead.
    opsFetch("/api/organizers?format=csv")
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "gada-global-5k-registrations.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => setError("Download failed."));
  }

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-10 px-5">
      <div className="max-w-[860px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-yellow mb-2 block">
              Organizers
            </span>
            <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-bold text-white tracking-tight">
              Registrations
            </h1>
          </div>
          <button
            onClick={downloadCsv}
            className="yellow-card rounded-xl px-5 py-3 font-bold text-[13px] tracking-wider uppercase border-none cursor-pointer"
          >
            Download CSV
          </button>
        </div>

        {error && (
          <div className="bg-red-oromo/15 border border-red-oromo/30 rounded-xl px-4 py-3 text-[14px] text-white/90 mb-6">
            {error}
          </div>
        )}

        {!data ? (
          <p className="text-white/50 text-[14px]">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
              <Stat label="Registered" value={String(data.totals.paid)} accent />
              <Stat label="Revenue" value={usd(data.totals.revenueCents)} />
              <Stat
                label="Abandoned"
                value={String(data.totals.pending)}
                hint="started checkout, never paid"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-7">
              <Breakdown
                title="By wave"
                entries={Object.entries(data.byWave).map(([k, v]) => [
                  WAVE_META[coerceWave(k)].label,
                  v,
                ])}
              />
              <Breakdown title="By tier" entries={Object.entries(data.byTier)} />
              <Breakdown
                title="T-shirts to order"
                entries={SHIRT_ORDER.filter((s) => data.byShirt[s]).map((s) => [
                  s,
                  data.byShirt[s],
                ])}
              />
            </div>

            <h2 className="text-[12px] font-bold tracking-[2px] uppercase text-white/60 mb-3">
              Most recent
            </h2>
            <div className="rounded-2xl border border-white/12 overflow-hidden">
              {data.recent.length === 0 ? (
                <p className="text-white/45 text-[14px] p-5">
                  No paid registrations yet.
                </p>
              ) : (
                data.recent.map((r, i) => (
                  <div
                    key={`${r.bib}-${i}`}
                    className={`flex items-center gap-4 px-4 py-3 ${
                      i % 2 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <span className="w-12 shrink-0 text-[15px] font-black text-yellow tabular-nums">
                      {r.bib ?? "—"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-white truncate">
                        {r.name}
                      </div>
                      <div className="text-[12px] text-white/50 truncate">{r.email}</div>
                    </div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-white/60 shrink-0 hidden sm:block">
                      {WAVE_META[coerceWave(r.wave)].label}
                    </span>
                    <span className="text-[13px] font-semibold text-white/80 shrink-0 tabular-nums">
                      {usd(r.amountCents)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <p className="text-[12px] text-white/40 mt-4">
              Refreshes every 30 seconds. CSV includes every paid registration.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/race/start" className="text-[13px] font-bold tracking-wider uppercase text-yellow no-underline">
            Start line →
          </Link>
          <Link href="/race/scan" className="text-[13px] font-bold tracking-wider uppercase text-white/60 no-underline">
            Finish line →
          </Link>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: string;
  accent?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        accent ? "yellow-card border-yellow" : "bg-white/6 border-white/12"
      }`}
    >
      <div
        className={`text-[11px] font-bold tracking-[2px] uppercase mb-1.5 ${
          accent ? "text-charcoal/60" : "text-white/55"
        }`}
      >
        {label}
      </div>
      <div
        className={`text-[30px] font-black tracking-tight leading-none ${
          accent ? "text-charcoal" : "text-white"
        }`}
      >
        {value}
      </div>
      {hint && <div className="text-[11px] text-white/40 mt-1.5">{hint}</div>}
    </div>
  );
}

function Breakdown({
  title,
  entries,
}: {
  title: string;
  entries: Array<[string, number]>;
}) {
  return (
    <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
      <div className="text-[11px] font-bold tracking-[2px] uppercase text-white/55 mb-3">
        {title}
      </div>
      {entries.length === 0 ? (
        <div className="text-[13px] text-white/35">None yet</div>
      ) : (
        <div className="space-y-2">
          {entries.map(([label, count]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-white/75 truncate">{label}</span>
              <span className="text-[14px] font-bold text-white tabular-nums shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
