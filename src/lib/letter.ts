/**
 * The sponsorship approach letter, as data.
 *
 * The letter exists in two forms — a letterheaded sheet to print and sign, and
 * plain text to paste into an email — and they have to say the same thing.
 * Writing the prose twice guarantees they diverge the first time a sentence is
 * improved in one of them, so both are rendered from here.
 *
 * Every figure comes from the modules that already own it: the levels and the
 * enquiry address from `sponsors.ts`, the date, venue and organization from
 * `EVENT`. Nothing about the race is retyped in this file.
 *
 * WHAT IS DELIBERATELY NOT IN THE LETTER, and should be added by whoever sends
 * it once it is actually known:
 *
 *  - **How many runners to expect.** It is the first question a business asks
 *    and the most persuasive sentence in the letter, and nobody has a real
 *    number for a first running. An invented one is a figure a sponsor can
 *    hold the organizers to in October.
 *  - **The artwork deadline.** Real, and set by whoever prints the shirts. The
 *    letter promises to send it rather than guessing at it.
 *
 * The prices themselves are still placeholders (ADR-0006). The page carries a
 * warning about that on screen only — it must never print onto a letter that
 * goes to a business.
 */

import { EVENT } from "@/lib/email";
import {
  SPONSOR_BENEFITS,
  SPONSOR_EMAIL,
  SPONSOR_TIERS,
  unlockedBy,
  type SponsorTier,
} from "@/lib/sponsors";
import { siteUrl } from "@/lib/site";

export interface LetterFields {
  /** The business being written to. */
  businessName: string;
  /** Who it is addressed to. Blank falls back to a role-neutral salutation. */
  contactName: string;
  /** The level being proposed, or undefined to present all of them. */
  tier?: SponsorTier;
  /** Who is signing. */
  senderName: string;
  senderTitle: string;
  /** Rendered date string — passed in so the server and client agree on it. */
  date: string;
}

export const LETTER_DEFAULTS: Omit<LetterFields, "date" | "tier"> = {
  businessName: "",
  contactName: "",
  senderName: "",
  senderTitle: "Race Director",
};

/** Placeholders read as instructions when a field is blank, so the printed
 *  sheet shows a bracketed prompt rather than a gap somebody misses. */
export function orPlaceholder(value: string, placeholder: string): string {
  return value.trim() || `[${placeholder}]`;
}

export function salutation(contactName: string): string {
  const name = contactName.trim();
  // "Dear Sir or Madam" is worse than addressing the business itself: it is
  // the register of a form letter, which is what this is trying not to be.
  return name ? `Dear ${name},` : "To the owner or manager,";
}

export function subjectLine(tier?: SponsorTier): string {
  return tier
    ? `Sponsorship of the ${EVENT.name} — ${tier.name} level`
    : `Sponsorship of the ${EVENT.name}`;
}

/**
 * The body, paragraph by paragraph.
 *
 * Four short paragraphs and a list, which is about as long as a cold letter to
 * a small business can be before it stops being read — and it is measured, not
 * guessed: the sheet is checked against a US Letter page so every variant fits
 * on ONE side. Each paragraph does one job: what the event is, why the morning
 * is worth being part of, what is being asked for, what happens next.
 */
export function letterParagraphs(fields: LetterFields): string[] {
  const { businessName, tier } = fields;
  const business = orPlaceholder(businessName, "Business name");

  const levelSentence = tier
    ? `We would like to invite ${business} to sponsor the race at the ${tier.name} level, ${tier.amount}. ${tier.blurb}`
    // The four amounts are NOT spelled out here: the list below already names
    // every level that is not included and what it costs, so repeating them in
    // prose bought a line of the page and said nothing new.
    : `We would like to invite ${business} to sponsor the race. There are four levels, from ${
        SPONSOR_TIERS[SPONSOR_TIERS.length - 1].amount
      }, and each is a floor rather than a fixed price.`;

  return [
    `On ${EVENT.date}, ${EVENT.organization} is holding the first ${EVENT.name} at the ${EVENT.location}, ${EVENT.address}. Packet pickup opens at ${EVENT.packetPickup}, the race starts at ${EVENT.startTime}, and a cultural festival runs until noon. It is a community race celebrating Oromo heritage and the Irrecha festival, open to runners and walkers of every age.`,

    `The morning is built to keep people in one place for five hours rather than five minutes. Families arrive at ${EVENT.packetPickup} and stay through the awards at ${EVENT.awardsTime} and the festival after it. Prize money of $1,200 goes to the top three men and the top three women, which brings out serious local runners alongside them.`,

    levelSentence,

    `If this is something ${business} would consider, a reply to this letter is all it takes to start. We will confirm the amount, send you the artwork specification and the printing deadline, and you will hear from us again after race day with photographs of where your name appeared. If you would rather talk it through first, write to ${SPONSOR_EMAIL} and we will call you.`,
  ];
}

export interface LetterBenefits {
  /** Heading above the list — names the level, or says these are the levels. */
  heading: string;
  included: string[];
  /** Benefits the proposed level does not reach, each with the level that does. */
  upsell: Array<{ label: string; tierName: string; amount: string }>;
  /**
   * The line under the list. It used to be a paragraph of its own and cost
   * three lines of a page that has to stay one sheet; attached to the list it
   * is the caption to the thing it is about, which is also where it reads
   * better.
   */
  note: string;
}

function benefitNote(): string {
  const site = siteUrl().replace(/^https?:\/\//, "");
  return `A shirt is not a flyer: the race t-shirt is worn around Washington DC long after October. Every level side by side is at ${site}/sponsors.`;
}

/**
 * What the letter lists, derived from `SPONSOR_BENEFITS` rather than written
 * out in prose.
 *
 * The prose version got this WRONG and could not help it: it said "the higher
 * levels add your logo to the race t-shirt", which is a true sentence in a
 * Bronze letter and a false one in a Gold letter — Gold is a level that
 * includes the shirt. A sentence cannot be right for four different offers,
 * and a letter that misstates what a business is buying is worse than no
 * letter at all.
 *
 * Deriving it also means moving a benefit between levels in `sponsors.ts`
 * changes the letter, the /sponsors page and the enquiry email together.
 */
export function letterBenefits(tier?: SponsorTier): LetterBenefits {
  if (!tier) {
    // No level proposed: list what EVERY level carries, so nothing here can
    // be read as a promise the cheapest level does not keep.
    const universal = SPONSOR_BENEFITS.filter((b) =>
      SPONSOR_TIERS.every((t) => b.tiers.includes(t.id)),
    );
    return {
      heading: "Every level includes",
      included: universal.map((b) => b.label),
      upsell: SPONSOR_BENEFITS.filter((b) => !universal.includes(b)).map((b) => {
        const by = unlockedBy(b);
        return { label: b.label, tierName: by.name, amount: by.amount };
      }),
      note: benefitNote(),
    };
  }

  return {
    heading: `${tier.name} includes`,
    included: SPONSOR_BENEFITS.filter((b) => b.tiers.includes(tier.id)).map(
      (b) => b.label,
    ),
    upsell: SPONSOR_BENEFITS.filter((b) => !b.tiers.includes(tier.id)).map(
      (b) => {
        const by = unlockedBy(b);
        return { label: b.label, tierName: by.name, amount: by.amount };
      },
    ),
    note: benefitNote(),
  };
}

/**
 * The same letter as plain text, for pasting into an email client.
 *
 * The printed sheet carries the letterhead as a design; an email cannot, so
 * the address block is written out at the bottom as a signature instead. The
 * two are the same letter, not two drafts of one.
 */
export function letterPlainText(fields: LetterFields): string {
  const site = siteUrl().replace(/^https?:\/\//, "");
  const lines: string[] = [
    subjectLine(fields.tier),
    "",
    fields.date,
    "",
    orPlaceholder(fields.businessName, "Business name"),
    "",
    salutation(fields.contactName),
    "",
  ];

  const paras = letterParagraphs(fields);
  const benefits = letterBenefits(fields.tier);

  // The list lands after the level paragraph, exactly where the printed sheet
  // puts it — the two versions of this letter must read the same.
  paras.forEach((p, i) => {
    lines.push(p, "");
    if (i === 2) {
      lines.push(`${benefits.heading}:`);
      for (const b of benefits.included) lines.push(`  - ${b}`);
      // Plain text has no grey. On the printed sheet a not-included benefit is
      // dimmed and unmistakable; pasted into an email it would sit in the same
      // list as the included ones and read as part of the offer, so it has to
      // say so in words.
      for (const u of benefits.upsell) {
        lines.push(`  - ${u.label} — not at this level; ${u.tierName}, ${u.amount}`);
      }
      lines.push("", benefits.note, "");
    }
  });

  lines.push(
    "With thanks,",
    "",
    orPlaceholder(fields.senderName, "Your name"),
    orPlaceholder(fields.senderTitle, "Your title"),
    EVENT.organization,
    "",
    EVENT.supportEmail,
    site,
  );

  return lines.join("\n");
}
