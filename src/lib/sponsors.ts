/**
 * Sponsorship levels and what each one actually buys.
 *
 * The levels, prices and the four benefits come from the organizers' printed
 * flyer — that is the offer, and it has to match. Nothing else does: the flyer
 * is a reference for *what* is on sale, not for how this page looks. The
 * presentation here is the site's own (charcoal surfaces, the single yellow
 * accent, DM Sans headings) rather than a reproduction of the flyer's
 * four-column table, its medallions or its colour coding.
 *
 * If the offer is revised, change it here — the /sponsors page, the about-page
 * section and the enquiry links all read from this file, so they cannot drift
 * apart.
 *
 * KNOWN ISSUE, carried over from the flyer deliberately rather than silently
 * "fixed": Silver ($500) and Bronze ($250) currently unlock exactly the same
 * two benefits, so there is no reason for a business to choose Silver. Adding
 * "silver" to the `web` benefit below resolves it and costs the organizers
 * nothing. Left as-is until they decide.
 */

export type SponsorTierId = "platinum" | "gold" | "silver" | "bronze";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** Display amount. Every level is a floor, not a fixed price. */
  amount: string;
  /** One line on who the level suits. */
  blurb: string;
  /**
   * Weight of the yellow accent rail, 0-1. Hierarchy is carried by this and by
   * the coverage meter — deliberately not by platinum/gold/silver/bronze metal
   * gradients, which would be mimicking the flyer rather than designing.
   */
  weight: number;
}

/** Highest first — a sponsor should read the best offer before the cheapest. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    name: "Platinum",
    amount: "$2,000+",
    blurb: "Everywhere the race puts a name: the shirt, the banner, the site and the stage.",
    weight: 1,
  },
  {
    id: "gold",
    name: "Gold",
    amount: "$1,000+",
    blurb: "Your logo on the shirt runners keep and wear long after race day.",
    weight: 0.7,
  },
  {
    id: "silver",
    name: "Silver",
    amount: "$500+",
    blurb: "On-site presence from packet pickup through the awards.",
    weight: 0.46,
  },
  {
    id: "bronze",
    name: "Bronze",
    amount: "$250+",
    blurb: "A local business standing visibly behind the race.",
    weight: 0.3,
  },
];

export type BenefitIcon = "shirt" | "banner" | "globe" | "mic";

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
    id: "tshirt",
    label: "Your logo on the race t-shirt",
    detail:
      "Printed on the official race t-shirt that every registered runner receives at packet pickup and wears on the course.",
    icon: "shirt",
    tiers: ["platinum", "gold"],
  },
  {
    id: "banner",
    label: "Logo on the event banner and signage",
    detail:
      "On the event banner and on-site signage at the Rock Creek Park Tennis Center, in front of everyone arriving from 7:00 AM through the festival at noon.",
    icon: "banner",
    tiers: ["platinum", "gold", "silver", "bronze"],
  },
  {
    id: "web",
    label: "Logo on the website and social posts",
    detail:
      "Your logo on gadaglobalrun.com and in the event's social media posts in the run-up to race day and afterwards.",
    icon: "globe",
    tiers: ["platinum"],
  },
  {
    id: "stage",
    label: "Named from the stage at the ceremony and awards",
    detail:
      "Your business named from the stage at the 8:15 AM opening ceremony and again at the 10:00 AM awards, while the crowd is gathered.",
    icon: "mic",
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

/** How many of the four a level unlocks — drives the coverage meter. */
export function includedCount(tier: SponsorTierId): number {
  return SPONSOR_BENEFITS.filter((b) => b.tiers.includes(tier)).length;
}

export const SPONSOR_EMAIL = "info@gadaglobalrun.com";

/** Pre-fills the enquiry so the organizers get the level in the subject line. */
export function sponsorMailto(tier?: SponsorTier): string {
  const subject = tier
    ? `${tier.name} sponsorship (${tier.amount}) — Gada Global 5K`
    : "Sponsorship enquiry — Gada Global 5K";
  const body = [
    tier
      ? `We would like to sponsor the Gada Global 5K at the ${tier.name} level (${tier.amount}).`
      : "We would like to sponsor the Gada Global 5K.",
    "",
    "Business name:",
    "Contact name:",
    "Phone:",
    "",
    "Please send us the next steps and the artwork deadline.",
  ].join("\n");
  return `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
