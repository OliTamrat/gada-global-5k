"use client";

import { useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "gada-race-ops";

/**
 * Remembers the passcode so a volunteer enters it once per device rather than
 * before every scan. This gate is convenience only — the API routes enforce the
 * passcode themselves, so bypassing this component gains nothing.
 */
export function getOpsPasscode(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function clearOpsPasscode(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

/** fetch() with the ops header attached. */
export async function opsFetch(input: string, init: RequestInit = {}) {
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      "x-race-ops": getOpsPasscode(),
    },
  });
}

export function OpsGate({ title, children }: { title: string; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // localStorage is unavailable during the server render, so this can only
    // run on the client. Deferred to a microtask so it does not set state
    // during the effect body, which react-hooks/set-state-in-effect rejects.
    void Promise.resolve().then(() => {
      setUnlocked(Boolean(getOpsPasscode()));
      setReady(true);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const code = value.trim();
    if (!code) return;

    setChecking(true);
    setError("");
    try {
      // Verified against the server before storing, so a typo surfaces here
      // rather than as a failed scan with a runner waiting.
      const res = await fetch("/api/race/waves", { headers: { "x-race-ops": code } });
      if (res.status === 401) {
        setError("That passcode was not accepted.");
        return;
      }
      if (res.status === 503) {
        setError("Race operations are not configured on this deployment yet.");
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, code);
      setUnlocked(true);
    } catch {
      setError("Could not reach the server. Check signal and try again.");
    } finally {
      setChecking(false);
    }
  }

  // Avoids a flash of the lock screen for an already-unlocked device.
  if (!ready) return null;

  if (unlocked) {
    return (
      <>
        {children}
        <div className="max-w-[560px] mx-auto px-5 pb-10 -mt-4">
          <button
            onClick={() => {
              clearOpsPasscode();
              setUnlocked(false);
              setValue("");
            }}
            className="text-[12px] tracking-wider uppercase text-white/40 bg-transparent border-none cursor-pointer p-0"
          >
            Lock this device
          </button>
        </div>
      </>
    );
  }

  return (
    <main className="bg-charcoal min-h-screen pt-28 pb-16 px-5">
      <div className="max-w-[400px] mx-auto">
        <span className="text-[11px] font-bold tracking-[3px] uppercase text-yellow mb-2 block">
          Race Operations
        </span>
        <h1 className="font-[family-name:var(--font-heading)] text-[26px] font-bold text-white tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-[14px] leading-[1.7] text-white/65 mb-6">
          Enter the volunteer passcode. This device will remember it for the day.
        </p>

        <form onSubmit={submit}>
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            placeholder="Passcode"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-[17px] text-white outline-none focus:border-yellow transition-colors mb-3"
          />
          {error && <p className="text-[13px] text-red-oromo mb-3">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="w-full yellow-card rounded-xl py-3.5 font-black text-[15px] tracking-wider uppercase border-none cursor-pointer disabled:opacity-60"
          >
            {checking ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </main>
  );
}
