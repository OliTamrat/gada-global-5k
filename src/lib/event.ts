// The event's identity, in one place.
//
// This used to live in lib/email.ts, which meant six page components imported
// their own name from an email module, and a rename touched 39 string literals
// across 18 files. Everything that names the event now reads it from here.
//
// The event was renamed from "Gada Global 5K — Irrecha Celebration Run" to
// Gada Global | 5K Peace Run in 2026; see docs/decisions/0007. The race is held
// on the Irreechaa weekend, but it is not an Irreechaa event: it is a public
// road race open to every community, and the name and copy say so.

// The domain, once. supportEmail is derived from it so the two cannot drift —
// site.ts already learned this lesson for the origin ("three files were each
// carrying their own copy of this fallback"), and the address had the same
// problem across six files.
const DOMAIN = "gadaglobalrun.com";

export const EVENT = {
  // The brand and the event are separate things, locked up with a rule between
  // them: Gada Global | 5K Peace Run. The pipe is a lockup device, so it goes
  // in titles and on the wordmark but never mid-sentence — prose uses `name`.
  /** The brand on its own. */
  brand: "Gada Global",
  /** The event on its own. */
  eventName: "5K Peace Run",
  /** Brand and event locked up — page titles, the wordmark, share cards. */
  lockup: "Gada Global | 5K Peace Run",
  /** Canonical prose name. Use this in sentences, emails and receipts. */
  name: "Gada Global 5K Peace Run",
  /** For tight spaces — bib headers, QR labels. */
  shortName: "5K Peace Run",
  /** The distance, kept separate so copy can state it on its own. */
  distance: "5K",

  /**
   * The registered legal entity the brand operates under. Use it only where
   * the legal name is required, never as a heading a runner reads.
   */
  organization: "Gada Global Inc.",

  date: "Saturday, October 3, 2026",
  // Race-day times are set by the Rock Creek Park permit: the race must START
  // no later than 8:00 AM, the road must be reopened by 9:30, post-race
  // activity finished by 10:30 and the site clear by 11:00. Setup cannot begin
  // before 6:00. See docs/decisions/0008 before moving any of these later.
  /** First wave. Waves follow at 7:50 and 7:55 — all away before the 8:00 cap. */
  startTime: "7:45 AM",
  packetPickup: "6:30 AM",
  awardsTime: "9:15 AM",
  programHours: "6:30 AM to 10:00 AM",
  location: "Rock Creek Park Tennis Center",
  address: "5220 16th St NW, Washington, DC 20011",
  /** Bare domain, for display in copy. */
  domain: DOMAIN,
  /** Where runners and sponsors write. Derived, so it tracks the domain. */
  supportEmail: `info@${DOMAIN}`,

  /** One line, for footers and social bios. */
  tagline: "Run Together · Achieve Together · Inspire Together",
  /**
   * The standing one-sentence description. Every surface that has to say what
   * this event *is* should say it the same way.
   */
  summary:
    "A professionally timed 5K road race in Rock Creek Park, Washington DC, " +
    "open to runners and walkers of every background, age and ability.",
} as const;
