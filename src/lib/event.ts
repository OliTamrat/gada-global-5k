// The event's identity, in one place.
//
// This used to live in lib/email.ts, which meant six page components imported
// their own name from an email module, and a rename touched 39 string literals
// across 18 files. Everything that names the event now reads it from here.
//
// The event was renamed from "Gada Global 5K — Irrecha Celebration Run" to the
// Gada Global Peace Run in 2026; see docs/decisions/0007. The race is held on
// the Irreechaa weekend, but it is not an Irreechaa event: it is a public road
// race open to every community, and the name and copy say so.

export const EVENT = {
  /** Full public name. Use this in headings, metadata, emails and receipts. */
  name: "Gada Global Peace Run",
  /** For tight spaces — bib headers, QR labels, nav. */
  shortName: "Peace Run",
  /** The distance, kept separate: the name no longer carries it. */
  distance: "5K",
  /** Name and distance together, for the places that need both. */
  nameWithDistance: "Gada Global Peace Run 5K",

  // The public-facing brand. "Gada Global Inc." below is the registered legal
  // entity the brand operates under — use it only where the legal name is
  // required, never as a heading a runner reads.
  brand: "Gada Global Run",
  organization: "Gada Global Inc.",

  date: "Saturday, October 3, 2026",
  startTime: "9:00 AM",
  packetPickup: "7:00 AM",
  awardsTime: "10:00 AM",
  programHours: "7:00 AM to 12:00 PM",
  location: "Rock Creek Park Tennis Center",
  address: "5220 16th St NW, Washington, DC 20011",
  supportEmail: "info@gadaglobalrun.com",

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
