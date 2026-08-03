/**
 * Sponsorship levels and what each one actually buys.
 *
 * This mirrors the printed "Sponsor Levels & Benefits" flyer. If the flyer is
 * revised, change it here — the /sponsors page, the about-page section and the
 * enquiry links all read from this file, so they cannot drift apart.
 *
 * KNOWN ISSUE, carried over from the flyer deliberately rather than silently
 * "fixed": Silver ($500) and Bronze ($250) currently unlock exactly the same
 * two benefits, so there is no reason for a business to choose Silver. Moving
 * "Logo on website & social media" down to Silver (below) resolves it and costs
 * the organizers nothing. Left as-is until they decide.
 */

export type SponsorTierId = "platinum" | "gold" | "silver" | "bronze";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** Display amount, as printed on the flyer. */
  amount: string;
  /** One line on who the level suits. */
  blurb: string;
  /** Medal disc gradient. */
  medal: string;
  /** Tier colour for headings, ticks and rules. */
  accent: string;
  /** Card surface when the level is selected. */
  panel: string;
  border: string;
}

/** Highest first — a sponsor should read the best offer before the cheapest. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    name: "Platinum",
    amount: "$2,000+",
    blurb: "Full visibility across every surface the race has.",
    medal: "linear-gradient(145deg,#FFFFFF 0%,#DFE6EF 45%,#AFB9C7 100%)",
    accent: "#E9EFF7",
    panel: "linear-gradient(160deg,rgba(27,94,32,0.30) 0%,rgba(20,18,16,0.7) 100%)",
    border: "rgba(233,239,247,0.45)",
  },
  {
    id: "gold",
    name: "Gold",
    amount: "$1,000+",
    blurb: "Your logo on the shirt runners keep and wear all year.",
    medal: "linear-gradient(145deg,#F7DE7A 0%,#E8B930 45%,#C49B20 100%)",
    accent: "#F5D245",
    panel: "linear-gradient(160deg,rgba(232,185,48,0.20) 0%,rgba(20,18,16,0.7) 100%)",
    border: "rgba(232,185,48,0.55)",
  },
  {
    id: "silver",
    name: "Silver",
    amount: "$500+",
    blurb: "On-site presence at the start, finish and awards.",
    medal: "linear-gradient(145deg,#F2F4F7 0%,#C9CDD4 45%,#9AA1AA 100%)",
    accent: "#DDE2E8",
    panel: "linear-gradient(160deg,rgba(221,226,232,0.16) 0%,rgba(20,18,16,0.7) 100%)",
    border: "rgba(221,226,232,0.4)",
  },
  {
    id: "bronze",
    name: "Bronze",
    amount: "$250+",
    blurb: "A local business standing visibly behind the race.",
    medal: "linear-gradient(145deg,#E8B183 0%,#C4763A 45%,#96552A 100%)",
    accent: "#E0A070",
    panel: "linear-gradient(160deg,rgba(196,118,58,0.18) 0%,rgba(20,18,16,0.7) 100%)",
    border: "rgba(196,118,58,0.5)",
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
    label: "Logo on event banner & signage",
    detail:
      "On the event banner and on-site signage at the Rock Creek Park Tennis Center, in front of everyone arriving from 7:00 AM through the festival at noon.",
    icon: "banner",
    tiers: ["platinum", "gold", "silver", "bronze"],
  },
  {
    id: "web",
    label: "Logo on website & social media",
    detail:
      "Your logo on gadaglobalrun.com and in the event's social media posts in the run-up to race day and afterwards.",
    icon: "globe",
    tiers: ["platinum"],
  },
  {
    id: "stage",
    label: "Recognition during opening & closing",
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

export function benefitsFor(tier: SponsorTierId): SponsorBenefit[] {
  return SPONSOR_BENEFITS.filter((b) => b.tiers.includes(tier));
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
