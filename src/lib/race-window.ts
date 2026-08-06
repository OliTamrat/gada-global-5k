import { NextResponse } from "next/server";

/**
 * The race clock only runs on race day.
 *
 * The passcode stops strangers from touching timing, but it does not stop a
 * volunteer testing the start screen in August from putting the clock into a
 * state nobody notices until October: sending a wave is idempotent, so the
 * stray row survives, and every runner who registers into that wave afterwards
 * inherits its start time at insert and shows as "Running…" on the public
 * leaderboard. This gate is what makes a rehearsal harmless.
 */
const RACE_TZ = "America/New_York";

/** Race day, in the venue's own timezone. */
export const RACE_DAY_ISO = "2026-10-03";

/** Escape hatch for a deliberate rehearsal. Needs a redeploy to take effect. */
const OVERRIDE_ENV = "RACE_TIMING_UNLOCKED";

/** YYYY-MM-DD in the venue's timezone — en-CA formats in that order. */
function dateAtVenue(now: number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: RACE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(now));
}

export function isRaceDay(now: number = Date.now()): boolean {
  return dateAtVenue(now) === RACE_DAY_ISO;
}

export function isOverridden(): boolean {
  return process.env[OVERRIDE_ENV] === "true";
}

/**
 * The whole calendar day is open, not a window around the 9:00 start — a
 * timezone slip either side must never be what stops a wave going out with 300
 * runners on the line.
 */
export function isTimingUnlocked(now: number = Date.now()): boolean {
  return isOverridden() || isRaceDay(now);
}

/** Returns a 423 response when timing is locked, or null when it may proceed. */
export function requireRaceDay(now: number = Date.now()): NextResponse | null {
  if (isTimingUnlocked(now)) return null;

  return NextResponse.json(
    {
      error:
        `The race clock is locked until race day (${RACE_DAY_ISO}). ` +
        `Nothing has been changed. To rehearse before then, set ` +
        `${OVERRIDE_ENV}=true in the Vercel environment variables and redeploy — ` +
        `and clear the timing data again afterwards.`,
      locked: true,
      raceDay: RACE_DAY_ISO,
    },
    { status: 423 }
  );
}
