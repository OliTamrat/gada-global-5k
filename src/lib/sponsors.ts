/**
 * Sponsorship levels and what each one buys.
 *
 * Prices confirmed by the organizers 2026-08: Platinum $5,000, Gold $2,500,
 * Silver $1,000, Bronze $500. They replace the placeholder figures that had
 * been carried over from a sample flyer (see ADR-0006).
 *
 * Everything is editable from this one file. The /sponsors page, the about-page
 * section, the enquiry links, the printed brochure and the QR target all read
 * from it, so changing a price or moving a benefit between levels needs no
 * other edit. Adding or removing a benefit needs an entry in SPONSOR_BENEFITS
 * and a matching glyph in SponsorTiers' ICONS map; the coverage meter sizes
 * itself.
 *
 * Every level unlocks something the level below does not. That is a deliberate
 * constraint, not a coincidence — the previous offer had Silver and Bronze
 * unlocking identical benefits, which gave a business no reason to pay the
 * difference.
 */

export type SponsorTierId = "platinum" | "gold" | "silver" | "bronze";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** Display amount. Each level is a minimum commitment, not a ceiling. */
  amount: string;
  /** One line on who the level suits, written for a decision-maker. */
  blurb: string;
  /**
   * Weight of the accent rail, 0-1. Hierarchy is carried by this and by the
   * coverage meter rather than by metal gradients.
   */
  weight: number;
}

/** Highest first — a sponsor should read the best offer before the cheapest. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    name: "Platinum",
    amount: "$5,000",
    blurb:
      "Presenting partner. Category exclusivity, top billing on every asset the event produces, and a post-event performance report.",
    weight: 1,
  },
  {
    id: "gold",
    name: "Gold",
    amount: "$2,500",
    blurb:
      "Brand on the race shirt runners keep, exhibitor space at the festival, and named recognition from the stage.",
    weight: 0.72,
  },
  {
    id: "silver",
    name: "Silver",
    amount: "$1,000",
    blurb:
      "Course and venue signage across the five-hour programme, with a stage mention at the awards.",
    weight: 0.48,
  },
  {
    id: "bronze",
    name: "Bronze",
    amount: "$500",
    blurb:
      "Community-supporter listing — venue signage, digital listing and complimentary entries for your team.",
    weight: 0.3,
  },
];

export type BenefitIcon =
  | "shirt" | "banner" | "globe" | "mic" | "bib" | "booth" | "ticket" | "chart";

export interface SponsorBenefit {
  id: string;
  label: string;
  /** Shown when a level is expanded — the concrete version of the promise. */
  detail: string;
  icon: BenefitIcon;
  tiers: SponsorTierId[];
}

export const SPONSOR_BENEFITS: SponsorBenefit[] = [
  {
    id: "exclusive",
    label: "Category exclusivity and presenting billing",
    detail:
      "Sole sponsor in your business category, and the presenting line on the event name wherever it appears — site, signage, email and press.",
    icon: "chart",
    tiers: ["platinum"],
  },
  {
    id: "tshirt",
    label: "Logo on the official race shirt",
    detail:
      "Printed on the shirt every registered runner receives at packet pickup. Platinum takes the primary position; Gold is placed alongside.",
    icon: "shirt",
    tiers: ["platinum", "gold"],
  },
  {
    id: "bib",
    label: "Logo on the race bib",
    detail:
      "On the bib worn by every finisher, and therefore in every finish-line and podium photograph taken on the day.",
    icon: "bib",
    tiers: ["platinum"],
  },
  {
    id: "booth",
    label: "Exhibitor space at the cultural festival",
    detail:
      "A staffed table or tent in the festival area from the awards at 10:00 through noon, with direct access to runners and families.",
    icon: "booth",
    tiers: ["platinum", "gold"],
  },
  {
    id: "banner",
    label: "Banner and on-site signage",
    detail:
      "Your banner at the Rock Creek Park Tennis Center from before 7:00 AM packet pickup through the festival at noon — a five-hour presence, not a five-second impression.",
    icon: "banner",
    tiers: ["platinum", "gold", "silver", "bronze"],
  },
  {
    id: "stage",
    label: "Named from the stage",
    detail:
      "Read out at the 8:15 opening ceremony and again at the 10:00 awards, while the field and their families are gathered.",
    icon: "mic",
    tiers: ["platinum", "gold", "silver"],
  },
  {
    id: "web",
    label: "Placement on the website and social channels",
    detail:
      "Your logo on gadaglobalrun.com and in the event's social campaign before, during and after race day, with a link to your site.",
    icon: "globe",
    tiers: ["platinum", "gold", "silver", "bronze"],
  },
  {
    id: "entries",
    label: "Complimentary entries for your team",
    detail:
      "Ten entries at Platinum, six at Gold, four at Silver, two at Bronze — for staff, clients or family, in any wave.",
    icon: "ticket",
    tiers: ["platinum", "gold", "silver", "bronze"],
  },
];

/**
 * The cheapest level that unlocks a benefit. Used to turn every "not included"
 * row into a signpost — a business reads which level would get it rather than
 * just being told no.
 */
export function unlockedBy(benefit: SponsorBenefit): SponsorTier {
  for (let i = SPONSOR_TIERS.length - 1; i >= 0; i--) {
    if (benefit.tiers.includes(SPONSOR_TIERS[i].id)) return SPONSOR_TIERS[i];
  }
  return SPONSOR_TIERS[0];
}

export function isSponsorTier(value: unknown): value is SponsorTierId {
  return (
    typeof value === "string" && SPONSOR_TIERS.some((t) => t.id === value)
  );
}

/** How many benefits a level unlocks — drives the coverage meter. */
export function includedCount(tier: SponsorTierId): number {
  return SPONSOR_BENEFITS.filter((b) => b.tiers.includes(tier)).length;
}

/** Total benefits on offer, so the meter never hard-codes a count. */
export const SPONSOR_BENEFIT_COUNT = SPONSOR_BENEFITS.length;

export const SPONSOR_EMAIL = "info@gadaglobalrun.com";

/** Pre-fills the enquiry so the organizers get the level in the subject line. */
export function sponsorMailto(tier?: SponsorTier): string {
  const subject = tier
    ? `${tier.name} sponsorship (${tier.amount}) — Gada Global 5K`
    : "Sponsorship enquiry — Gada Global 5K";
  const body = [
    tier
      ? `We would like to sponsor the Gada Global 5K at the ${tier.name} level (${tier.amount}).`
      : "We would like to discuss sponsoring the Gada Global 5K.",
    "",
    "Organization:",
    "Contact name and title:",
    "Phone:",
    "",
    "Please send the sponsorship agreement and the artwork deadline.",
  ].join("\n");
  return `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
