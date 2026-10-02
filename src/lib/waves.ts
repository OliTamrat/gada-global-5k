/**
 * Start waves.
 *
 * Scanning 500 runners individually at a start line is not workable — at three
 * seconds each it is 25 minutes of standing around. Instead the starter sends a
 * wave and one volunteer taps once; every runner in that wave inherits that
 * timestamp. Nothing is scanned at the start.
 *
 * Waves also separate fast runners from walkers and children in the first
 * couple of hundred metres, which is a safety matter as much as a timing one.
 *
 * Order follows the safety plan filed with the NPS: the Kids 1K goes first at
 * 8:00, then the elite race and the fun run at 8:30. Kids run a different
 * distance, so they are ranked separately — see `distance` below.
 */

export const WAVES = ["kids", "elite", "open"] as const;
export type Wave = (typeof WAVES)[number];

export type RaceDistance = "5K" | "1K";

/** Miles, for pace. */
export const DISTANCE_MILES: Record<RaceDistance, number> = { "5K": 3.1, "1K": 0.62 };

export interface WaveMeta {
  id: Wave;
  label: string;
  /** Shown on the registration form. */
  blurb: string;
  /** Printed on the bib so runners find the right corral without being told. */
  bandLabel: string;
  /** Minutes after the first wave. Display only — the real time is the tap. */
  offsetMinutes: number;
  /** Race distance. Results are ranked only against the same distance. */
  distance: RaceDistance;
  /** Scheduled gun time, from the NPS safety plan. Printed on the bib and in emails. */
  startTime: string;
  /** Tailwind classes for the bib band and UI chips. */
  bandClass: string;
}

export const WAVE_META: Record<Wave, WaveMeta> = {
  elite: {
    id: "elite",
    label: "Elite",
    blurb: "Competitive 5K runners aiming for a podium finish, roughly under 25 minutes. Starts 8:30 AM.",
    bandLabel: "ELITE",
    offsetMinutes: 30,
    distance: "5K",
    startTime: "8:30 AM",
    bandClass: "bg-yellow text-charcoal",
  },
  open: {
    id: "open",
    label: "Open",
    blurb: "The 5K fun run — adults running or walking at their own pace. Most people belong here. Starts 8:30 AM, right behind the elite field.",
    bandLabel: "OPEN",
    offsetMinutes: 30,
    distance: "5K",
    startTime: "8:30 AM",
    bandClass: "bg-charcoal text-white",
  },
  kids: {
    id: "kids",
    label: "Kids 1K",
    blurb:
      "The Kids 1K, for children and anyone running with them, including strollers. Each child needs their own registration, and an adult running alongside should pick this wave too. Starts first, at 8:00 AM, on a clear course.",
    bandLabel: "KIDS 1K",
    offsetMinutes: 0,
    distance: "1K",
    startTime: "8:00 AM",
    bandClass: "bg-green-deep text-white",
  },
};

export const DEFAULT_WAVE: Wave = "open";

export function isWave(value: unknown): value is Wave {
  return typeof value === "string" && (WAVES as readonly string[]).includes(value);
}

/** Falls back to Open rather than throwing — a bad value must never block a
 *  registration or strand a runner without a start time. */
export function coerceWave(value: unknown): Wave {
  return isWave(value) ? value : DEFAULT_WAVE;
}

