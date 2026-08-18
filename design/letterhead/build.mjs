/**
 * The letterhead and the sponsorship letter, as print-ready pages.
 *
 * Three artefacts now carry the same design: this, the tri-fold, and the Word
 * documents under `design/letter/`. This one is the PDF an organizer prints on
 * plain paper and writes or types on — the `.docx` is for editing, the PDF is
 * for printing, and they are not the same request.
 *
 *   node design/letterhead/build.mjs           # -> letterhead.html + letter.html
 *   node design/letterhead/render.mjs          # -> both PDFs
 *
 * Same rule as everything under `design/`: the offer is not typed in here. It
 * is parsed out of `src/lib/sponsors.ts` and `src/lib/email.ts` by
 * `design/lib/source.mjs`, which throws when an extractor matches nothing.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDomain,
  readEvent,
  readSponsors,
  repoPath,
  unlockedBy,
} from "../lib/source.mjs";
import { paletteFromArgs } from "../lib/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const FONTS = resolve(HERE, "../trifold/fonts");

/* --------------------------------------------------------------- palette */

// The tri-fold's palette, so a business that gets the leaflet and then the
// letter sees one organization. Midnight navy carries the masthead and the
// headings, amber the rules and labels.
const C = paletteFromArgs();

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const dataUri = (file, mime) =>
  `data:${mime};base64,${readFileSync(file).toString("base64")}`;

/* ------------------------------------------------------------------ data */

const event = readEvent();
const { tiers, benefits } = readSponsors();
const domain = readDomain();
const org = event.organization;
const orgMidSentence = org.replace(/\.$/, "");
const weekday = (event.date.match(/^([A-Za-z]+),/) || [, ""])[1];
const dateNoWeekday = event.date.replace(/^[A-Za-z]+,\s*/, "");

const LOGO = dataUri(repoPath("public/images/brand/gada-global-logo.png"), "image/png");
const FRAUNCES = dataUri(resolve(FONTS, "fraunces-latin.woff2"), "font/woff2");
const BRICOLAGE = dataUri(resolve(FONTS, "bricolage-latin.woff2"), "font/woff2");
const DM400 = dataUri(resolve(FONTS, "dm-sans-latin-400.woff2"), "font/woff2");
const DM700 = dataUri(resolve(FONTS, "dm-sans-latin-700.woff2"), "font/woff2");

/* ----------------------------------------------------------------- parts */

const FILL = {
  business: "[BUSINESS NAME]",
  contact: "[CONTACT NAME]",
  sender: "[YOUR NAME]",
  title: "[YOUR TITLE]",
  date: "[DATE]",
};

const masthead = `
  <header class="masthead">
    <div class="mast-row">
      <img class="mast-logo" src="${LOGO}" alt="">
      <div class="mast-name">
        <div class="org">${esc(org)}</div>
        <div class="eyebrow">${esc(event.name)} &nbsp;&middot;&nbsp; ${esc(dateNoWeekday)}</div>
      </div>
      <div class="mast-contact">
        <div>Washington, DC</div>
        <div class="strong">${esc(event.supportEmail)}</div>
        <div>${esc(domain)}</div>
      </div>
    </div>
    <div class="mast-rule" aria-hidden="true"><span></span><span></span></div>
  </header>`;

function benefitPanel() {
  const universal = benefits.filter((b) => tiers.every((t) => b.tiers.includes(t.id)));
  const missing = benefits.filter((b) => !universal.includes(b));
  return `
    <div class="panel">
      <div class="panel-head">Every level includes</div>
      <ul class="panel-list">
        ${universal.map((b) => `<li class="yes">${esc(b.label)}</li>`).join("")}
        ${missing
          .map((b) => {
            const by = unlockedBy(b, tiers);
            return `<li class="no">${esc(b.label)} <b>&mdash; ${esc(by.name)}, ${esc(by.amount)}</b></li>`;
          })
          .join("")}
      </ul>
      <p class="panel-note">
        A shirt is not a flyer: the race t-shirt is worn around Washington DC
        long after October. Every level side by side is at ${esc(domain)}/sponsors.
      </p>
    </div>`;
}

const letterBody = `
  <p class="date">${FILL.date}</p>
  <p class="to">${FILL.business}</p>
  <p class="subject"><span class="mark" aria-hidden="true"></span>Sponsorship of the ${esc(event.name)}</p>
  <p>Dear ${FILL.contact},</p>

  <p>On ${esc(event.date)}, ${esc(org)} is holding the first ${esc(event.name)} at
  the ${esc(event.location)}, ${esc(event.address)}. Packet pickup opens at
  ${esc(event.packetPickup)}, the race starts at ${esc(event.startTime)}, and a
  cultural festival runs until noon. It is a community race celebrating Oromo
  heritage and the Irrecha festival, open to runners and walkers of every age.</p>

  <p>The morning is built to keep people in one place for five hours rather than
  five minutes. Families arrive at ${esc(event.packetPickup)} and stay through the
  awards at ${esc(event.awardsTime)} and the festival after it. Prize money of
  $1,200 goes to the top three men and the top three women, which brings out
  serious local runners alongside them.</p>

  <p>We would like to invite ${FILL.business} to sponsor the race. There are four
  levels, from ${esc(tiers[tiers.length - 1].amount)}, and each is a floor rather
  than a fixed price.</p>

  ${benefitPanel()}

  <p>If this is something ${FILL.business} would consider, a reply to this letter
  is all it takes to start. We will confirm the amount, send you the artwork
  specification and the printing deadline, and you will hear from us again after
  race day with photographs of where your name appeared. If you would rather talk
  it through first, write to ${esc(event.supportEmail)} and we will call you.</p>

  <p class="signoff">With thanks,</p>
  <div class="sign-space" aria-hidden="true"></div>
  <p class="sig-name">${FILL.sender}</p>
  <p class="sig-line">${FILL.title}</p>
  <p class="sig-line">${esc(org)}</p>`;

const blankBody = `
  <p class="date">${FILL.date}</p>
  <p class="to">[RECIPIENT NAME]</p>
  <p class="sig-line">[ADDRESS LINE]</p>
  <p class="salutation">Dear [NAME],</p>
  <p class="prompt">[Write the letter here. Delete these bracketed prompts as you
  go — they are here so an unfilled field cannot be sent by accident. This sheet
  prints on plain paper; the masthead above and the footer below are the
  letterhead.]</p>

  <p class="signoff">With thanks,</p>
  <div class="sign-space" aria-hidden="true"></div>
  <p class="sig-name">${FILL.sender}</p>
  <p class="sig-line">${FILL.title}</p>
  <p class="sig-line">${esc(orgMidSentence)}.</p>`;

const css = `
@font-face { font-family: "Fraunces"; src: url("${FRAUNCES}") format("woff2"); font-weight: 100 900; font-display: block; }
@font-face { font-family: "Bricolage"; src: url("${BRICOLAGE}") format("woff2"); font-weight: 200 800; font-stretch: 75% 100%; font-display: block; }
@font-face { font-family: "DM Sans"; src: url("${DM400}") format("woff2"); font-weight: 400; font-display: block; }
@font-face { font-family: "DM Sans"; src: url("${DM700}") format("woff2"); font-weight: 700; font-display: block; }

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #6f6f6f; }
body { font-family: "DM Sans", sans-serif; -webkit-font-smoothing: antialiased; }

/* 8.5 x 11in with 0.6in top/bottom and 0.75in sides — correspondence margins.
   The sheet is a fixed box rather than flowing type, so what is on screen is
   what comes out of the printer. */
.sheet {
  width: 8.5in; height: 11in; background: #fff; color: ${C.ink};
  padding: 0.6in 0.75in; display: flex; flex-direction: column;
  page-break-after: always; break-after: page;
}
.sheet:last-child { page-break-after: auto; break-after: auto; }

/* ---- masthead ---- */
.mast-row { display: flex; align-items: center; gap: 14px; }
.mast-logo { width: 52px; height: 52px; object-fit: contain; flex: 0 0 52px; }
.mast-name { flex: 1; }
.org {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 90;
  font-size: 19pt; line-height: 1; letter-spacing: -.02em; color: ${C.field};
}
.eyebrow {
  font-family: "Bricolage", sans-serif; font-weight: 800;
  font-size: 7pt; letter-spacing: .18em; text-transform: uppercase;
  color: ${C.accentInk}; margin-top: 5px;
}
.mast-contact { text-align: right; font-size: 8pt; line-height: 1.7; color: ${C.inkSoft}; }
.mast-contact .strong { font-weight: 700; color: ${C.field}; }

/* Two segments, because a border cannot be two colours. Emerald into gold. */
.mast-rule { display: flex; height: 4px; margin-top: 12px; }
.mast-rule span:first-child { width: 22%; background: ${C.field}; }
.mast-rule span:last-child { flex: 1; background: ${C.accent}; }

/* ---- body ---- */
.body { flex: 1; padding-top: 22px; }
.body p { margin: 0 0 10px; font-size: 9.6pt; line-height: 1.62; color: ${C.ink}; }
.date { font-size: 8.6pt !important; color: ${C.inkMuted} !important; margin-bottom: 16px !important; }
.to { font-weight: 700; margin-bottom: 14px !important; }
.subject {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 40;
  font-size: 11.5pt !important; letter-spacing: -.015em; color: ${C.field};
  margin-bottom: 14px !important; display: flex; align-items: baseline; gap: 8px;
}
.mark { width: 8px; height: 8px; background: ${C.accent}; flex: 0 0 8px; }
.salutation { margin-bottom: 14px !important; }
.prompt { color: ${C.inkMuted} !important; }

/* ---- the benefit panel ---- */
.panel {
  background: ${C.cream}; border-left: 4px solid ${C.accent};
  padding: 13px 16px; margin: 4px 0 12px;
}
.panel-head {
  font-family: "Bricolage", sans-serif; font-weight: 800;
  font-size: 7.5pt; letter-spacing: .18em; text-transform: uppercase;
  color: ${C.accentInk}; margin-bottom: 8px;
}
.panel-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.panel-list li {
  font-size: 9pt; line-height: 1.5; color: ${C.ink};
  padding-left: 17px; position: relative;
}
.panel-list li.yes::before {
  content: ""; position: absolute; left: 0; top: 4px;
  width: 9px; height: 5px; border-left: 2px solid ${C.field};
  border-bottom: 2px solid ${C.field}; transform: rotate(-45deg);
}
.panel-list li.no { color: ${C.inkMuted}; }
.panel-list li.no::before {
  content: ""; position: absolute; left: 0; top: 8px;
  width: 9px; height: 2px; background: ${C.inkMuted};
}
.panel-list li.no b { color: ${C.inkSoft}; }
.panel-note {
  margin: 9px 0 0 !important; padding-top: 8px; border-top: 1px solid ${C.rule};
  font-size: 8pt !important; line-height: 1.5; color: ${C.inkSoft} !important;
}

/* ---- sign-off ---- */
.signoff { margin-bottom: 0 !important; }
/* Room for an actual pen. A printed letter with nowhere to sign reads as a
   mailshot, which is the opposite of the point. */
.sign-space { height: 0.5in; }
.sig-name { font-weight: 700; margin-bottom: 0 !important; }
.sig-line { font-size: 8.8pt !important; color: ${C.inkSoft} !important; margin-bottom: 0 !important; }

/* ---- footer ---- */
.foot {
  margin-top: auto; padding-top: 12px; border-top: 1px solid ${C.rule};
  display: flex; justify-content: space-between; gap: 12px;
  font-family: "Bricolage", sans-serif; font-weight: 700;
  font-size: 6.8pt; letter-spacing: .14em; text-transform: uppercase; color: ${C.inkMuted};
}

@media screen {
  body { padding: 24px; display: grid; gap: 24px; justify-content: center; }
  .sheet { box-shadow: 0 18px 50px rgba(0,0,0,.35); }
}
@media print { html, body { background: #fff; } .sheet { box-shadow: none; } }
@page { size: 8.5in 11in; margin: 0; }
`;

function page(body) {
  return `
  <div class="sheet">
    ${masthead}
    <div class="body">${body}</div>
    <div class="foot">
      <span>${esc(org)}</span>
      <span>${esc(event.supportEmail)} &nbsp;&middot;&nbsp; ${esc(domain)}</span>
    </div>
  </div>`;
}

function doc(title, body) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head>
<body>${page(body)}</body>
</html>
`;
}

writeFileSync(resolve(HERE, "letterhead.html"), doc(`${org} letterhead`, blankBody));
writeFileSync(
  resolve(HERE, "letter.html"),
  doc(`Sponsorship of the ${event.name}`, letterBody),
);
console.log("wrote letterhead.html and letter.html");
