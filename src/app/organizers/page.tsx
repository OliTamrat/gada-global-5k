"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { OpsGate, opsFetch } from "@/components/OpsGate";
import { WAVE_META, coerceWave } from "@/lib/waves";

interface Dashboard {
  totals: {
    paid: number;
    pending: number;
    revenueCents: number;
    merchOrders: number;
    merchRevenueCents: number;
    totalRevenueCents: number;
  };
  byWave: Record<string, number>;
  byTier: Record<string, number>;
  byShirt: Record<string, number>;
  recentMerch: Array<{
    email: string | null;
    items: string;
    amountCents: number;
    orderedAt: string;
  }>;
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <Stat label="Registered" value={String(data.totals.paid)} accent />
              <Stat
                label="Total revenue"
                value={usd(data.totals.totalRevenueCents)}
                hint="registrations + merch"
              />
              <Stat label="Merch orders" value={String(data.totals.merchOrders)} />
              <Stat
                label="Abandoned"
                value={String(data.totals.pending)}
                hint="started checkout, never paid"
              />
            </div>

            <div className="text-[12px] text-white/45 mb-7">
              Registrations {usd(data.totals.revenueCents)} · Merch{" "}
              {usd(data.totals.merchRevenueCents)}
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

            <RaceUpdatePanel />

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

            {data.recentMerch.length > 0 && (
              <>
                <h2 className="text-[12px] font-bold tracking-[2px] uppercase text-white/60 mt-7 mb-3">
                  Merch orders
                </h2>
                <div className="rounded-2xl border border-white/12 overflow-hidden">
                  {data.recentMerch.map((m, i) => (
                    <div
                      key={`${m.email}-${i}`}
                      className={`flex items-center gap-4 px-4 py-3 ${
                        i % 2 ? "bg-white/[0.03]" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold text-white truncate">
                          {m.items || "Order"}
                        </div>
                        <div className="text-[12px] text-white/50 truncate">
                          {m.email ?? "no email on file"}
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-white/80 shrink-0 tabular-nums">
                        {usd(m.amountCents)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

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

interface AnnounceStatus {
  recipients: number;
  sent: number;
  preview: { subject: string; text: string };
}

/**
 * Sends the race-day times update to every paid runner. Test first, then a
 * two-tap send. The server records who has been emailed, so pressing Send
 * again only reaches runners not yet emailed — it resumes, never repeats.
 */
function RaceUpdatePanel() {
  const [status, setStatus] = useState<AnnounceStatus | null>(null);
  const [testTo, setTestTo] = useState("");
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const refresh = useCallback(async () => {
    const res = await opsFetch("/api/organizers/announce");
    const body = await res.json();
    if (res.ok) setStatus(body);
    else setMessage(body.error ?? "Could not load the email status.");
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  async function post(payload: object) {
    setBusy(true);
    setMessage("");
    try {
      const res = await opsFetch("/api/organizers/announce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { ok: res.ok, body: await res.json() };
    } catch {
      return { ok: false, body: { error: "Could not reach the server." } };
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    const { ok, body } = await post({ mode: "test", to: testTo });
    setMessage(ok ? `Test sent to ${body.to}. Check that inbox before sending to everyone.` : body.error);
  }

  async function sendAll() {
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    setMessage("Sending… keep this page open. This can take a couple of minutes.");
    const { ok, body } = await post({ mode: "send" });
    if (!ok) {
      setMessage(body.error);
    } else {
      const failed = body.failed.length
        ? ` ${body.failed.length} failed (bibs ${body.failed.map((f: { bib: number }) => f.bib).join(", ")}) — press Send again to retry them.`
        : "";
      const rest = body.remaining > 0 && !body.failed.length
        ? ` ${body.remaining} still to go — press Send again to continue.`
        : "";
      setMessage(`Sent ${body.sent} now; ${body.totalSent} of ${body.recipients} runners emailed in total.${failed}${rest}`);
    }
    await refresh();
  }

  const remaining = status ? Math.max(status.recipients - status.sent, 0) : 0;

  return (
    <div className="bg-white/5 border border-yellow/25 rounded-2xl p-5 mb-7">
      <h2 className="text-[12px] font-bold tracking-[2px] uppercase text-yellow mb-2">
        Race-day update email
      </h2>
      <p className="text-[14px] text-white/75 leading-relaxed mb-4">
        Tells every paid runner the new start times, their own wave and bib, and to
        collect their bib and T-shirt at packet pickup from 7:00 AM.
        {status && (
          <> <strong className="text-white">{status.sent} of {status.recipients}</strong> runners emailed so far.</>
        )}
      </p>

      {status && (
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="text-[12px] font-bold tracking-wider uppercase text-white/60 bg-transparent border-none cursor-pointer p-0 mb-3"
        >
          {showPreview ? "Hide preview" : "Preview email"}
        </button>
      )}
      {showPreview && status && (
        <div className="bg-black/30 rounded-xl p-4 mb-4 text-[13px] text-white/80">
          <div className="font-bold text-white mb-2">{status.preview.subject}</div>
          <pre className="whitespace-pre-wrap font-[inherit] m-0">{status.preview.text}</pre>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="email"
          value={testTo}
          onChange={(e) => setTestTo(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 min-w-[200px] px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-[14px]"
        />
        <button
          onClick={sendTest}
          disabled={busy || !testTo}
          className="rounded-xl px-4 py-2.5 font-bold text-[13px] tracking-wider uppercase bg-white/10 text-white border border-white/20 cursor-pointer disabled:opacity-40"
        >
          Send test
        </button>
      </div>

      <button
        onClick={sendAll}
        disabled={busy || !status || remaining === 0}
        className={`w-full rounded-xl px-5 py-3 font-bold text-[13px] tracking-wider uppercase border-none cursor-pointer disabled:opacity-40 ${
          armed ? "bg-red-oromo text-white" : "yellow-card"
        }`}
      >
        {remaining === 0 && status
          ? "Everyone has been emailed"
          : armed
            ? `Tap again to email ${remaining} runners`
            : `Send to ${remaining} runners`}
      </button>

      {message && <p className="text-[13px] text-white/85 mt-3 mb-0">{message}</p>}
    </div>
  );
}
