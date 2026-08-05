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
 */

export const WAVES = ["elite", "open", "kids"] as const;
export type Wave = (typeof WAVES)[number];

export interface WaveMeta {
  id: Wave;
  label: string;
  /** Shown on the registration form. */
  blurb: string;
  /** Printed on the bib so runners find the right corral without being told. */
  bandLabel: string;
  /** Minutes after the first wave. Display only — the real time is the tap. */
  offsetMinutes: number;
  /** Tailwind classes for the bib band and UI chips. */
  bandClass: string;
}

export const WAVE_META: Record<Wave, WaveMeta> = {
  elite: {
    id: "elite",
    label: "Elite",
    blurb: "Competitive runners aiming for a podium finish, roughly under 25 minutes.",
    bandLabel: "ELITE",
    offsetMinutes: 0,
    bandClass: "bg-yellow text-charcoal",
  },
  open: {
    id: "open",
    label: "Open",
    blurb: "Adults running or walking for fun. Most people belong here.",
    bandLabel: "OPEN",
    offsetMinutes: 3,
    bandClass: "bg-charcoal text-white",
  },
  kids: {
    id: "kids",
    label: "Kids & Family",
    blurb:
      "Children and anyone running with them, including strollers. Each child needs their own registration, and an adult running alongside should pick this wave too. Sets off last into a clear course.",
    bandLabel: "KIDS & FAMILY",
    offsetMinutes: 6,
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

