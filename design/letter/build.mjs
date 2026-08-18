/**
 * The sponsorship letter as an editable Word document.
 *
 * The web page at /sponsors/letter prints and copies; this is the file an
 * organizer opens in Word or Google Docs, types into, saves and emails as an
 * attachment. Same letter, different delivery — a business that asks for "the
 * letter" usually means a document, not a URL.
 *
 * THE OFFER IS NOT TYPED IN HERE. `readSponsors()` parses the levels, prices
 * and benefits straight out of `src/lib/sponsors.ts`, and the event facts out
 * of `src/lib/email.ts` — the same modules the website renders from. Change a
 * price in `sponsors.ts`, rebuild, and this document follows. That is the whole
 * reason it is a build script and not a .docx somebody hand-edited once: the
 * three proposal documents in this repo went stale exactly that way, and they
 * still carry the old venue and the 7:30 AM start.
 *
 *   node design/letter/build.mjs            # -> Gada-Global-5K-Sponsor-Letter.docx
 *   node design/letter/build.mjs --tier gold
 *
 * With no --tier the letter presents all four levels; with one it proposes
 * that level and lists what it includes.
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  ImageRun,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");

/* ------------------------------------------------------------ the brand */

// The site's own tokens, from src/app/globals.css. Word wants them without
// the hash.
const GOLD = "E8B930";
const GOLD_DIM = "C49B20";
const GREEN = "1B5E20";
const CHARCOAL = "141210";
const INK_SOFT = "5A544C";
const INK_MUTED = "8A8378";
const CREAM = "FAF6EE";

// US Letter in DXA (1440 = 1in). docx-js defaults to A4, which would reflow
// the whole letter and is invisible until it prints wrong.
const PAGE = { width: 12240, height: 15840 };
const MARGIN = { top: 900, bottom: 900, left: 1080, right: 1080 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right; // 10080 DXA = 7in

/* ------------------------------------------- the facts, read from source */

function source(file) {
  return readFileSync(resolve(REPO, file), "utf8");
}

/**
 * `EVENT` out of src/lib/email.ts.
 *
 * Regex over source rather than an import because this script is plain node
 * and that file is TypeScript inside a Next app. Every extractor below throws
 * if it matches nothing, so a rename fails loudly here instead of silently
 * producing a letter with blanks in it.
 */
function readEvent() {
  const src = source("src/lib/email.ts");
  const block = src.match(/export const EVENT = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error("EVENT extractor matched nothing in src/lib/email.ts");
  const event = {};
  for (const [, key, value] of block[1].matchAll(/(\w+):\s*"([^"]+)"/g)) {
    event[key] = value;
  }
  for (const key of ["name", "date", "startTime", "packetPickup", "awardsTime", "location", "address", "organization", "supportEmail"]) {
    if (!event[key]) throw new Error(`EVENT.${key} missing — check src/lib/email.ts`);
  }
  return event;
}

/** The levels and the benefit matrix out of src/lib/sponsors.ts. */
function readSponsors() {
  const src = source("src/lib/sponsors.ts");

  const tiersBlock = src.match(/SPONSOR_TIERS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!tiersBlock) throw new Error("SPONSOR_TIERS extractor matched nothing");
  const tiers = [];
  for (const chunk of tiersBlock[1].split(/\}\s*,\s*\{/)) {
    const id = chunk.match(/id:\s*"([^"]+)"/);
    const name = chunk.match(/name:\s*"([^"]+)"/);
    const amount = chunk.match(/amount:\s*"([^"]+)"/);
    const blurb = chunk.match(/blurb:\s*\n?\s*"([^"]+)"/);
    if (id && name && amount) {
      tiers.push({ id: id[1], name: name[1], amount: amount[1], blurb: blurb ? blurb[1] : "" });
    }
  }
  if (tiers.length < 2) throw new Error("SPONSOR_TIERS extractor found fewer than two levels");

  const benefitsBlock = src.match(/SPONSOR_BENEFITS[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!benefitsBlock) throw new Error("SPONSOR_BENEFITS extractor matched nothing");
  const benefits = [];
  for (const chunk of benefitsBlock[1].split(/\}\s*,\s*\{/)) {
    const label = chunk.match(/label:\s*\n?\s*"([^"]+)"/);
    const list = chunk.match(/tiers:\s*\[([^\]]*)\]/);
    if (label && list) {
      benefits.push({
        label: label[1],
        tiers: [...list[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]),
      });
    }
  }
  if (!benefits.length) throw new Error("SPONSOR_BENEFITS extractor found no benefits");

  return { tiers, benefits };
}

function readSiteDomain() {
  const src = source("src/lib/site.ts");
  const fallback = src.match(/"(https:\/\/[^"]+)"/);
  if (!fallback) throw new Error("site origin extractor matched nothing in src/lib/site.ts");
  return fallback[1].replace(/^https?:\/\//, "");
}

/** The cheapest level that unlocks a benefit — mirrors `unlockedBy()`. */
function unlockedBy(benefit, tiers) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (benefit.tiers.includes(tiers[i].id)) return tiers[i];
  }
  return tiers[0];
}

/* ------------------------------------------------------------ the words */

/**
 * Square brackets, on purpose.
 *
 * The whole point of this file is that somebody types into it, and a bracketed
 * prompt is impossible to send by accident — a blank line is not. Word's
 * find-and-replace also picks them up in one pass.
 */
const FILL = {
  business: "[BUSINESS NAME]",
  contact: "[CONTACT NAME]",
  sender: "[YOUR NAME]",
  title: "[YOUR TITLE]",
};

function letterParagraphs(event, tiers, tier) {
  const levelSentence = tier
    ? `We would like to invite ${FILL.business} to sponsor the race at the ${tier.name} level, ${tier.amount}. ${tier.blurb}`
    : `We would like to invite ${FILL.business} to sponsor the race. There are four levels, from ${tiers[tiers.length - 1].amount}, and each is a floor rather than a fixed price.`;

  return [
    `On ${event.date}, ${event.organization} is holding the first ${event.name} at the ${event.location}, ${event.address}. Packet pickup opens at ${event.packetPickup}, the race starts at ${event.startTime}, and a cultural festival runs until noon. It is a community race celebrating Oromo heritage and the Irrecha festival, open to runners and walkers of every age.`,
    `The morning is built to keep people in one place for five hours rather than five minutes. Families arrive at ${event.packetPickup} and stay through the awards at ${event.awardsTime} and the festival after it. Prize money of $1,200 goes to the top three men and the top three women, which brings out serious local runners alongside them.`,
    levelSentence,
    `If this is something ${FILL.business} would consider, a reply to this letter is all it takes to start. We will confirm the amount, send you the artwork specification and the printing deadline, and you will hear from us again after race day with photographs of where your name appeared. If you would rather talk it through first, write to ${event.supportEmail} and we will call you.`,
  ];
}

/* ----------------------------------------------------------- the pieces */

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: opts.after ?? 160, line: 276 },
    children: [
      new TextRun({ text, size: 21, color: opts.color ?? CHARCOAL, font: "Calibri", bold: opts.bold }),
    ],
    ...opts.paragraph,
  });

/** The masthead: logo and legal name left, reply address right. */
function letterhead(event, domain) {
  const logo = readFileSync(resolve(REPO, "public/images/brand/gada-global-logo.png"));

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [1080, 5120, 3880],
    borders: noBorders(),
    rows: [
      new TableRow({
        children: [
          // The logo column is wider than the logo: 60px of image in 0.75in of
          // column leaves a gutter, and without one the globe touches the "G"
          // of the name.
          cell(1080, [
            new Paragraph({
              children: [
                new ImageRun({
                  data: logo,
                  type: "png",
                  // 425x360 native; 0.62in wide keeps the aspect ratio.
                  transformation: { width: 60, height: 51 },
                }),
              ],
            }),
          ]),
          cell(5120, [
            new Paragraph({
              spacing: { before: 60, after: 40 },
              children: [
                new TextRun({ text: event.organization, size: 30, bold: true, color: CHARCOAL, font: "Calibri" }),
              ],
            }),
            new Paragraph({
              children: [
                // The event and its date, in gold. A business filing the
                // letter reads the date off the top. The weekday is dropped —
                // in tracked-out capitals it wraps the line, and the body
                // still says Saturday.
                new TextRun({
                  text: `${event.name}  ·  ${event.date.replace(/^[A-Za-z]+,\s*/, "")}`.toUpperCase(),
                  size: 15,
                  bold: true,
                  color: GOLD_DIM,
                  characterSpacing: 30,
                  font: "Calibri",
                }),
              ],
            }),
          ]),
          cell(3880, [
            right("Washington, DC", INK_SOFT),
            right(event.supportEmail, CHARCOAL, true),
            right(domain, INK_SOFT),
          ]),
        ],
      }),
    ],
  });
}

/**
 * The brand rule: a short deep-green segment running into gold.
 *
 * Built as a one-row table with two shaded cells rather than a paragraph
 * border, because a border cannot be two colours. 3pt so a cheap office
 * printer keeps it, and it degrades to two greys in black and white rather
 * than disappearing.
 */
function brandRule() {
  const bar = (width, fill) =>
    new TableCell({
      width: { size: width, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill, color: "auto" },
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "", size: 2 })] })],
    });

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [2200, 7880],
    borders: noBorders(),
    rows: [new TableRow({ height: { value: 44, rule: "exact" }, children: [bar(2200, GREEN), bar(7880, GOLD)] })],
  });
}

/**
 * What the level buys, in a cream panel with a gold rail.
 *
 * A list, not a sentence — it is the part a business owner scans for and reads
 * back to you on the phone. And it is DERIVED: an earlier prose version said
 * "the higher levels add your logo to the race t-shirt", which is true in a
 * Bronze letter and false in a Gold one. One sentence cannot be right for four
 * offers.
 */
function benefitPanel({ tier, tiers, benefits, domain }) {
  const universal = benefits.filter((b) => tiers.every((t) => b.tiers.includes(t.id)));
  const included = tier ? benefits.filter((b) => b.tiers.includes(tier.id)) : universal;
  const missing = tier
    ? benefits.filter((b) => !b.tiers.includes(tier.id))
    : benefits.filter((b) => !universal.includes(b));

  const rows = [
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: (tier ? `${tier.name} includes` : "Every level includes").toUpperCase(),
          size: 16,
          bold: true,
          color: GOLD_DIM,
          characterSpacing: 24,
          font: "Calibri",
        }),
      ],
    }),
    ...included.map(
      (b) =>
        new Paragraph({
          spacing: { after: 70 },
          children: [
            new TextRun({ text: "✓  ", size: 20, bold: true, color: GREEN, font: "Calibri" }),
            new TextRun({ text: b.label, size: 20, color: CHARCOAL, font: "Calibri" }),
          ],
        }),
    ),
    // Every "no" is a route upwards rather than a rejection — the same rule
    // the /sponsors accordion follows, so the letter and the page make the
    // same argument.
    ...missing.map((b) => {
      const by = unlockedBy(b, tiers);
      return new Paragraph({
        spacing: { after: 70 },
        children: [
          new TextRun({ text: "–  ", size: 20, bold: true, color: INK_MUTED, font: "Calibri" }),
          new TextRun({ text: b.label, size: 20, color: INK_MUTED, font: "Calibri" }),
          new TextRun({ text: `  — ${by.name}, ${by.amount}`, size: 20, bold: true, color: INK_SOFT, font: "Calibri" }),
        ],
      });
    }),
    new Paragraph({
      spacing: { before: 140 },
      children: [
        new TextRun({
          text: `A shirt is not a flyer: the race t-shirt is worn around Washington DC long after October. Every level side by side is at ${domain}/sponsors.`,
          size: 17,
          color: INK_SOFT,
          italics: true,
          font: "Calibri",
        }),
      ],
    }),
  ];

  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH],
    borders: {
      // The gold rail is the left border of the panel itself; the other three
      // sides are the cream fill meeting white paper.
      left: { style: BorderStyle.SINGLE, size: 18, color: GOLD },
      top: { style: BorderStyle.NIL, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NIL, size: 0, color: "auto" },
      right: { style: BorderStyle.NIL, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NIL, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NIL, size: 0, color: "auto" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: CREAM, color: "auto" },
            margins: { top: 180, bottom: 180, left: 220, right: 220 },
            children: rows,
          }),
        ],
      }),
    ],
  });
}

/* ------------------------------------------------------------- helpers */

function noBorders() {
  const nil = { style: BorderStyle.NIL, size: 0, color: "auto" };
  return { top: nil, bottom: nil, left: nil, right: nil, insideHorizontal: nil, insideVertical: nil };
}

function cell(width, children) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    verticalAlign: VerticalAlign.CENTER,
    children,
  });
}

function right(text, color, bold = false) {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 20 },
    children: [new TextRun({ text, size: 17, color, bold, font: "Calibri" })],
  });
}

function spacer(after = 0) {
  return new Paragraph({ spacing: { after }, children: [new TextRun({ text: "", size: 12 })] });
}

/* ---------------------------------------------------------------- build */

/**
 * The letterhead on its own, with nothing in the body.
 *
 * This is the file that outlives the sponsorship letter. The next piece of
 * correspondence — a thank-you to a sponsor who paid, a permit cover note, a
 * letter to a school — is written into this, so nobody rebuilds a masthead
 * from memory and gets the colours or the reply address slightly wrong.
 */
function buildBlank() {
  const event = readEvent();
  const domain = readSiteDomain();

  return new Document({
    creator: event.organization,
    title: `${event.organization} letterhead`,
    description: "Blank letterhead for correspondence.",
    sections: [
      {
        properties: { page: { size: PAGE, margin: MARGIN } },
        footers: { default: pageFooter(event, domain) },
        children: [
          letterhead(event, domain),
          spacer(60),
          brandRule(),
          spacer(220),
          body("[DATE]", { color: INK_SOFT, after: 200 }),
          body("[RECIPIENT NAME]", { bold: true, after: 0 }),
          body("[ADDRESS LINE]", { color: INK_SOFT, after: 180 }),
          body("Dear [NAME],", { after: 180 }),
          body("[Write the letter here. Delete these bracketed prompts as you go — they are here so an unfilled field cannot be sent by accident.]", { color: INK_SOFT, after: 220 }),
          body("With thanks,", { after: 0 }),
          spacer(560),
          body("[YOUR NAME]", { bold: true, after: 0 }),
          body("[YOUR TITLE]", { color: INK_SOFT, after: 0 }),
          body(event.organization, { color: INK_SOFT, after: 0 }),
        ],
      },
    ],
  });
}

function pageFooter(event, domain) {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${event.organization}  ·  ${event.supportEmail}  ·  ${domain}`,
            size: 15,
            color: INK_MUTED,
            font: "Calibri",
          }),
        ],
      }),
    ],
  });
}

function build(tierId) {
  const event = readEvent();
  const { tiers, benefits } = readSponsors();
  const domain = readSiteDomain();

  const tier = tierId ? tiers.find((t) => t.id === tierId) : undefined;
  if (tierId && !tier) {
    throw new Error(`unknown level "${tierId}" — expected one of ${tiers.map((t) => t.id).join(", ")}`);
  }

  const paragraphs = letterParagraphs(event, tiers, tier);
  const subject = tier
    ? `Sponsorship of the ${event.name} — ${tier.name} level`
    : `Sponsorship of the ${event.name}`;

  const children = [
    letterhead(event, domain),
    spacer(60),
    brandRule(),
    spacer(220),

    body("[DATE]", { color: INK_SOFT, after: 200 }),
    body(FILL.business, { bold: true, after: 180 }),

    // The subject, with a gold square in front of it.
    new Paragraph({
      spacing: { after: 180 },
      children: [
        new TextRun({ text: "■  ", size: 18, color: GOLD, font: "Calibri" }),
        new TextRun({ text: subject, size: 23, bold: true, color: CHARCOAL, font: "Calibri" }),
      ],
    }),

    body(`Dear ${FILL.contact},`, { after: 180 }),
    body(paragraphs[0]),
    body(paragraphs[1]),
    body(paragraphs[2], { after: 180 }),

    benefitPanel({ tier, tiers, benefits, domain }),
    spacer(60),

    body(paragraphs[3], { after: 220 }),
    body("With thanks,", { after: 0 }),

    // Room for an actual pen. A printed letter with nowhere to sign reads as
    // a mailshot, which is the opposite of the point.
    spacer(560),

    body(FILL.sender, { bold: true, after: 0 }),
    body(FILL.title, { color: INK_SOFT, after: 0 }),
    body(event.organization, { color: INK_SOFT, after: 0 }),
  ];

  return new Document({
    creator: event.organization,
    title: subject,
    description: `Sponsorship approach letter for the ${event.name}.`,
    sections: [
      {
        properties: { page: { size: PAGE, margin: MARGIN } },
        footers: { default: pageFooter(event, domain) },
        children,
      },
    ],
  });
}

/* ----------------------------------------------------------------- main */

const args = process.argv.slice(2);
const blank = args.includes("--blank");
const tierArg = args.includes("--tier") ? args[args.indexOf("--tier") + 1] : undefined;
const outArg = args.includes("--out") ? args[args.indexOf("--out") + 1] : undefined;
const out = resolve(
  process.cwd(),
  outArg ??
    (blank
      ? "Gada-Global-Letterhead.docx"
      : `Gada-Global-5K-Sponsor-Letter${tierArg ? `-${tierArg}` : ""}.docx`),
);

const buffer = await Packer.toBuffer(blank ? buildBlank() : build(tierArg));
writeFileSync(out, buffer);
console.log(`wrote ${out}`);
