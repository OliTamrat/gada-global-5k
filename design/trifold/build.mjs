/**
 * The printed sponsorship brochure — a tri-fold, both sides, as one HTML file.
 *
 * US Letter landscape (11 x 8.5in), two sheets, three panels each. A business
 * gets handed this across a counter; the letter goes in an envelope and the
 * /sponsors page is where they read it afterwards. All three say the same
 * thing because all three are built from `src/lib/sponsors.ts`.
 *
 *   node design/trifold/build.mjs     # -> design/trifold/brochure.html
 *   node design/trifold/render.mjs    # -> the PDF and 300dpi PNGs
 *
 * PANEL ORDER, which is the thing that is easy to get wrong and expensive to
 * get wrong. Printed left to right on the flat sheet:
 *
 *   OUTSIDE   back cover | at a glance | FRONT COVER
 *   INSIDE    overview   | the morning | sponsorship levels
 *
 * Every panel is SELF-CONTAINED. Letting a block span two panels uses the
 * inside spread more efficiently and puts a sentence, or a table column, on a
 * fold — which on a folded leaflet is a crease through the middle of a word.
 *
 * Folded as a ROLL fold: the right panel of the outside becomes the front, the
 * left panel tucks inside. The tuck-in panel is cut narrower so the fold
 * closes flat — if your printer folds the other way, swap the panel order in
 * the two sheets at the bottom of this file rather than re-laying anything
 * out.
 *
 * The design is the reference deck's language rendered in Gada's palette: a
 * near-black field, two-tone display type in Oromo red and the brand yellow,
 * numbered discs, and a hairline rule under every heading. Colour is used at
 * display size only, so nothing here depends on a reader distinguishing two
 * similar hues.
 */

import QRCode from "qrcode";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  readDomain,
  readEvent,
  readRegistration,
  readSponsors,
  repoPath,
} from "../lib/source.mjs";
import { paletteFromArgs } from "../lib/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

/* ------------------------------------------------------------- palette */

// src/app/globals.css, unchanged. The field is charcoal rather than the deep
// green because the two display colours have to sit on it at 3:1 or better —
// Oromo red on dark green does not, and the whole cover depends on that pair.
const C = paletteFromArgs();

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function dataUri(file, mime) {
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

/* ---------------------------------------------------------------- data */

const event = readEvent();
const { tiers, benefits } = readSponsors();
const domain = readDomain();
const entry = readRegistration();
const dateNoWeekday = event.date.replace(/^[A-Za-z]+,\s*/, "");
const org = event.organization;
const weekday = (event.date.match(/^([A-Za-z]+),/) || [, ""])[1];

const LOGO = dataUri(repoPath("public/images/brand/gada-global-logo.png"), "image/png");

/**
 * A QR to the levels page, on the back cover.
 *
 * The one thing a printed leaflet can do that a letter cannot: put the reader
 * on the page in two seconds, while they are still holding it. Drawn as SVG so
 * it stays crisp at any size — a raster QR at 0.9in is exactly where a phone
 * camera starts failing in poor light.
 *
 * `margin: 1` keeps the quiet zone; dropping it to 0 to save space is what
 * makes a code unscannable, and it looks fine right up until somebody tries.
 */
const QR = await QRCode.toString(`https://${domain}/sponsors`, {
  type: "svg",
  margin: 1,
  color: { dark: C.fieldDeep, light: "#ffffff" },
});
// Fraunces for the big words and Bricolage for the labels, both variable.
// Anton was the first choice and it is a competent poster face that a hundred
// other leaflets also use — "lacking creativity" was the note, and it was
// right. Fraunces has a WONK axis that tilts its terminals off the vertical,
// which is where the character comes from; Bricolage is a grotesque with
// deliberately irregular joins, so the labels are not a neutral default
// either.
const FRAUNCES = dataUri(resolve(HERE, "fonts/fraunces-latin.woff2"), "font/woff2");
const BRICOLAGE = dataUri(resolve(HERE, "fonts/bricolage-latin.woff2"), "font/woff2");
const DM400 = dataUri(resolve(HERE, "fonts/dm-sans-latin-400.woff2"), "font/woff2");
const DM700 = dataUri(resolve(HERE, "fonts/dm-sans-latin-700.woff2"), "font/woff2");

/* --------------------------------------------------------------- pieces */

/** Numbered disc, as on the reference's sessions page. */
function disc(n, title, sub) {
  return `
    <div class="disc-item">
      <div class="disc">${n}</div>
      <div>
        <div class="disc-title">${esc(title)}</div>
        <div class="disc-sub">${esc(sub)}</div>
      </div>
    </div>`;
}

/**
 * The levels table — derived, never described.
 *
 * A check for every benefit a level unlocks and a dash for every one it does
 * not, straight from `SPONSOR_BENEFITS`. Writing this as prose is how the
 * letter's first draft ended up saying "the higher levels add your logo to
 * the race t-shirt", which is true of Bronze and false of Gold.
 */
function levelsTable() {
  const head = tiers
    .map(
      (t) => `<th><span class="lvl">${esc(t.name)}</span><span class="amt">${esc(t.amount)}</span></th>`,
    )
    .join("");

  const rows = benefits
    .map((b) => {
      const cells = tiers
        .map((t) =>
          b.tiers.includes(t.id)
            ? `<td class="yes">${CHECK}</td>`
            : `<td class="no">&ndash;</td>`,
        )
        .join("");
      return `<tr><th scope="row">${esc(b.label)}</th>${cells}</tr>`;
    })
    .join("");

  return `
    <table class="levels">
      <colgroup><col class="spec"><col><col><col><col></colgroup>
      <thead><tr><th scope="col"></th>${head}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

const CHECK = `<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M3 8.4l3.2 3.2L13 4.6" fill="none" stroke="${C.field}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ---------------------------------------------------------------- panels */

const frontCover = `
  <section class="panel navy cover">
    <div class="cover-frame" aria-hidden="true"></div>
    <div class="cover-mark" aria-hidden="true"></div>

    <div class="cover-top">
      <img class="cover-logo" src="${LOGO}" alt="">
      <div class="powered">
        <span>Powered by</span>
        <strong>${esc(org)}</strong>
      </div>
    </div>

    <div class="cover-type">
      <div class="display d1">Sponsorship</div>
      <div class="display d2">Proposal</div>
      <div class="cover-rule"></div>
      <div class="cover-meta">
        <div class="cover-event">${esc(event.name)}</div>
        <div>${esc(weekday)}, ${esc(dateNoWeekday)}</div>
        <div>${esc(event.location)}, Washington DC</div>
      </div>
    </div>
  </section>`;

const atAGlance = `
  <section class="panel cream glance">
    <h2 class="kicker">At a glance</h2>
    <div class="glance-rule"></div>

    <dl class="facts">
      <div><dt>Date</dt><dd>${esc(weekday)}, ${esc(dateNoWeekday)}</dd></div>
      <div><dt>Venue</dt><dd>${esc(event.location)}<br>${esc(event.address)}</dd></div>
      <div><dt>Programme</dt><dd>${esc(event.programHours)}</dd></div>
      <div><dt>Race start</dt><dd>${esc(event.startTime)}, in three waves</dd></div>
      <div><dt>Prize purse</dt><dd>$1,200 &mdash; $300 / $200 / $100 to the top three men and the top three women</dd></div>
      <div><dt>Entry</dt><dd>$${entry.lowest}&ndash;$${entry.highest}, runners and walkers of every age</dd></div>
    </dl>

    <h3 class="glance-sub">Why it works</h3>
    <ul class="reasons">
      <li>Five hours in one place, not five seconds on a roadside.</li>
      <li>The t-shirt leaves with them and gets worn all year.</li>
      <li>Neighbours, not passing traffic &mdash; and your name is in front of them.</li>
    </ul>

    <p class="glance-note">
      A five-hour morning, not a five-minute one. Families arrive at
      ${esc(event.packetPickup)} for packet pickup and stay through the awards at
      ${esc(event.awardsTime)} and the community festival after it.
    </p>
  </section>`;

const backCover = `
  <section class="panel navy back">
    <img class="back-logo" src="${LOGO}" alt="">
    <h2 class="back-title">Back<br>the run</h2>
    <div class="back-rule"></div>

    <p class="back-lede">
      Every level puts your name in front of the people who live here, on a
      morning they will remember.
    </p>

    <div class="mini-levels">
      ${tiers
        .map(
          (t) => `<div class="mini-level"><span>${esc(t.name)}</span><span>${esc(t.amount)}</span></div>`,
        )
        .join("")}
    </div>

    <p class="back-steps">
      <strong>Three steps, no paperwork.</strong> Pick a level and email us. We
      confirm the amount and send you the artwork specification and the printing
      deadline. After race day you get photographs of where your name appeared.
    </p>

    <div class="back-contact">
      <div class="contact-row"><span class="contact-label">Email</span><span class="contact-value">${esc(event.supportEmail)}</span></div>
      <div class="contact-row"><span class="contact-label">Levels</span><span class="contact-value">${esc(domain)}/sponsors</span></div>
    </div>

    <div class="qr-block">
      <div class="qr">${QR}</div>
      <div class="qr-text">
        <strong>Scan for every level</strong>
        <span>Benefits side by side, and the enquiry form.</span>
      </div>
    </div>

    <div class="back-foot">${esc(org)} &middot; Washington, DC</div>
  </section>`;

const overview = `
  <section class="panel cream overview">
    <h2 class="sec-title">Overview</h2>
    <div class="sec-rule"></div>

    <p class="lede">
      The ${esc(event.name)} is a community road race run by ${esc(org)},
      a licensed Washington DC company. The first one is
      on ${esc(weekday)}, ${esc(dateNoWeekday)} at the ${esc(event.location)},
      and it is open to runners and walkers of every age and background.
    </p>
    <p>
      It is a race and a festival on the same morning. Packet pickup opens at
      ${esc(event.packetPickup)}, the gun goes at ${esc(event.startTime)}, awards
      are at ${esc(event.awardsTime)}, and the cultural programme runs to noon.
      Runners and walkers of every age are welcome, and the $1,200 purse brings
      out serious local runners alongside the families.
    </p>

    <div class="stats">
      <div class="stat"><div class="stat-n">5</div><div class="stat-l">hours on&nbsp;site</div></div>
      <div class="stat"><div class="stat-n">3</div><div class="stat-l">start waves</div></div>
      <div class="stat"><div class="stat-n">$1,200</div><div class="stat-l">prize purse</div></div>
    </div>

    <h3 class="sub">Who you reach</h3>
    <div class="audience">
      <div class="aud"><div class="aud-node">01</div><div class="aud-label">Runners and their families</div></div>
      <div class="aud-line" aria-hidden="true"></div>
      <div class="aud"><div class="aud-node hot">02</div><div class="aud-label">Neighbours and spectators</div></div>
      <div class="aud-line" aria-hidden="true"></div>
      <div class="aud"><div class="aud-node">03</div><div class="aud-label">Local businesses and neighbours</div></div>
    </div>

    <p class="overview-foot">
      Sponsoring this race puts your business in front of your own
      neighbourhood, on a morning it will remember.
    </p>
  </section>`;

const theMorning = `
  <section class="panel navy morning">
    <div class="morning-mark" aria-hidden="true"></div>
    <h2 class="kicker">The<br>morning</h2>
    <div class="glance-rule"></div>

    <div class="discs">
      ${disc("01", "Packet pickup", `Doors at ${event.packetPickup}`)}
      ${disc("02", "Opening ceremony", "8:15 AM")}
      ${disc("03", "The 5K", `${event.startTime} start, three waves`)}
      ${disc("04", "Awards", `${event.awardsTime}, in front of the crowd`)}
      ${disc("05", "Community festival", "Music, food and dance until noon")}
    </div>

    <p class="morning-note">
      Your signage is in front of them for five hours, not five seconds &mdash;
      and the race t-shirt leaves with them.
    </p>
  </section>`;

const levels = `
  <section class="panel cream levels-panel">
    <h2 class="sec-title">Sponsorship<br>levels</h2>
    <div class="sec-rule"></div>
    <p class="lede">
      Each amount is a floor rather than a fixed price.
    </p>

    ${levelsTable()}

    <div class="tier-blurbs">
      ${tiers
        .map(
          (t) => `
        <div class="tier-blurb">
          <div class="tier-blurb-head"><span>${esc(t.name)}</span><span>${esc(t.amount)}</span></div>
          <p>${esc(t.blurb)}</p>
        </div>`,
        )
        .join("")}
    </div>

    <p class="levels-note">
      A shirt is not a flyer: the race t-shirt is worn around Washington DC long
      after October.
    </p>
  </section>`;

/* ---------------------------------------------------------------- sheets */

// Roll fold: the panel that tucks inside is cut narrower so the fold closes
// flat instead of bowing the front cover.
const sheets = `
  <div class="sheet" data-sheet="outside">
    ${backCover}
    ${atAGlance}
    ${frontCover}
  </div>
  <div class="sheet" data-sheet="inside">
    ${overview}
    ${theMorning}
    ${levels}
  </div>`;

const css = `
@font-face { font-family: "Fraunces"; src: url("${FRAUNCES}") format("woff2"); font-weight: 100 900; font-display: block; }
@font-face { font-family: "Bricolage"; src: url("${BRICOLAGE}") format("woff2"); font-weight: 200 800; font-stretch: 75% 100%; font-display: block; }
@font-face { font-family: "DM Sans"; src: url("${DM400}") format("woff2"); font-weight: 400; font-display: block; }
@font-face { font-family: "DM Sans"; src: url("${DM700}") format("woff2"); font-weight: 700; font-display: block; }

*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #6f6f6f; }
body { font-family: "DM Sans", sans-serif; -webkit-font-smoothing: antialiased; }

/* A sheet is one side of the flat paper: 11 x 8.5in landscape, no bleed, so it
   prints on any office printer rather than needing a trade press. The panels
   are exact thirds apart from the tuck allowance. */
.sheet {
  width: 11in; height: 8.5in;
  display: grid; grid-template-columns: 3.653in 3.667in 3.68in;
  background: #fff; overflow: hidden;
  page-break-after: always; break-after: page;
}
.sheet:last-child { page-break-after: auto; break-after: auto; }

.panel { padding: 0.44in 0.34in; position: relative; overflow: hidden; display: flex; flex-direction: column; }
/* Three fields, and the alternation is what makes the folds legible. Two
   adjacent panels in the same colour read as one wide page and the reader
   cannot see where it folds. */
/* Three panels, alternating dark and light across every fold. Two adjacent
   panels in one colour read as a single wide page and the reader cannot see
   where it folds. */
.navy   { background: ${C.field}; color: ${C.onDark}; }
.cream  { background: ${C.cream}; color: ${C.ink}; }

/* ---- front cover ---- */
.cover-frame {
  position: absolute; inset: 0.17in; border: 1px solid rgba(232,236,247,.24); z-index: 1;
}
.cover-top { display: flex; align-items: center; gap: 10px; position: relative; z-index: 2; }
.cover-logo { width: 44px; height: 44px; object-fit: contain; }
.powered { line-height: 1.3; }
.powered span {
  display: block; font-size: 6.5pt; letter-spacing: .22em; text-transform: uppercase; color: ${C.accentSoft}; font-family: "Bricolage", sans-serif;
}
.powered strong { display: block; font-size: 8pt; color: ${C.onDark}; font-weight: 700; }

/* One shape, cropped by the panel edge — depth without a photograph nobody
   has taken yet. */
.cover-mark {
  position: absolute; right: -1.25in; top: 1.35in;
  width: 3.9in; height: 3.9in; border-radius: 50%;
  /* One warm disc, cropped by the panel edge — depth without a photograph
     nobody has taken yet, and on gold it reads as light rather than as a
     smudge. */
  background: ${C.fieldSoft}; z-index: 0;
}
.cover-mark::after {
  content: ""; position: absolute; inset: 0.45in; border-radius: 50%;
  border: 1px solid rgba(240,138,36,.3);
}

.cover-type { margin-top: auto; position: relative; z-index: 2; }
.display {
  /* Bricolage at its narrowest width and heaviest weight, NOT the serif.
     "SPONSORSHIP" is eleven characters and the panel is 3in wide: Fraunces at
     display size measures about 300pt in a 216pt column and ran straight off
     the edge. A condensed face is not a style choice here, it is the only
     thing that fits — and Bricolage's irregular joins keep it from being the
     anonymous poster condensed everything else uses. */
  font-family: "Bricolage", "DM Sans", sans-serif; font-weight: 800;
  font-variation-settings: "wdth" 75, "wght" 800, "opsz" 96;
  text-transform: uppercase; line-height: .84; letter-spacing: -.015em;
}
.d1 { font-size: 40pt; color: ${C.d1}; }
.d2 { font-size: 40pt; color: ${C.d2}; }
.cover-rule { width: 1.5in; height: 4px; background: ${C.accent}; margin: 15px 0 12px; }
.cover-meta { font-size: 8pt; line-height: 1.7; color: ${C.onDarkMuted}; }
.cover-event {
  color: ${C.accentSoft}; font-weight: 700; letter-spacing: .12em; font-family: "Bricolage", sans-serif;
  text-transform: uppercase; font-size: 7.5pt; margin-bottom: 2px;
}

/* ---- dark panels ---- */
.kicker {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 144;
  text-transform: uppercase; font-size: 23pt; line-height: .9; letter-spacing: -.02em;
  margin: 0; color: ${C.field};
}
.glance-rule { width: .85in; height: 3px; background: ${C.accent}; margin: 13px 0 18px; }
.facts { margin: 0; display: grid; gap: 12px; }
.facts > div { display: grid; gap: 2px; }
.facts dt {
  font-size: 6.4pt; letter-spacing: .18em; text-transform: uppercase; color: ${C.accentInk}; font-weight: 700; font-family: "Bricolage", sans-serif;
}
.facts dd { margin: 0; font-size: 8.4pt; line-height: 1.5; color: ${C.ink}; }
.glance-note {
  margin: auto 0 0; font-size: 7.8pt; line-height: 1.65; color: ${C.inkSoft};
  border-top: 1px solid ${C.rule}; padding-top: 14px;
}

.glance-sub {
  margin: 20px 0 9px; font-size: 6.6pt; letter-spacing: .2em; text-transform: uppercase;
  color: ${C.accentInk}; font-weight: 700;
}
.reasons { margin: 0; padding: 0; list-style: none; display: grid; gap: 7px; }
.reasons li {
  position: relative; padding-left: 13px; font-size: 7.8pt; line-height: 1.5;
  color: ${C.inkSoft};
}
.reasons li::before {
  content: ""; position: absolute; left: 0; top: 6px;
  width: 5px; height: 5px; background: ${C.accent};
}

.qr-block { display: flex; align-items: center; gap: 11px; margin-top: 16px; }
.qr {
  width: .82in; height: .82in; flex: 0 0 .82in;
  /* A white card behind the code. Inverted QR (light modules on a dark
     field) is legal in the spec and unreliable in practice — plenty of phone
     cameras will not read one in poor light. */
  background: #fff; padding: 4px; border-radius: 3px;
}
.qr svg { width: 100%; height: 100%; display: block; }
.qr-text strong { display: block; font-size: 7.4pt; color: ${C.onDark}; }
.qr-text span { display: block; font-size: 6.8pt; line-height: 1.45; color: ${C.onDarkMuted}; margin-top: 2px; }

/* .kicker is set for the cream panel it mostly appears on. "The morning" uses
   the same class on the DARK panel, where that colour is the field itself —
   it rendered navy on navy and the heading was invisible in the PDF. A class
   shared across two fields needs the field-specific override. */
.navy .kicker { color: ${C.accentSoft}; }

.morning-mark {
  position: absolute; left: -1.5in; bottom: -1.3in;
  width: 3.4in; height: 3.4in; border-radius: 50%;
  background: ${C.fieldSoft}; z-index: 0;
}
/* NOT a bare .morning > * selector — that has the same specificity as
   .morning-mark and comes later, so it overrode position:absolute and the
   decorative disc became a 3.4in block in the flow, pushing the heading a
   third of the way down the panel. Excluding the decoration is the fix;
   raising specificity would only hide it until the next shape. */
.morning > *:not([aria-hidden="true"]) { position: relative; z-index: 1; }
.discs { display: grid; gap: 13px; }
.disc-item { display: flex; align-items: center; gap: 11px; }
.disc {
  width: 30px; height: 30px; border-radius: 50%; flex: 0 0 30px;
  display: grid; place-items: center; background: ${C.accent}; color: ${C.fieldDeep};
  font-size: 7.6pt; font-weight: 800; font-family: "Bricolage", sans-serif;
}
.disc-title { font-size: 8.4pt; font-weight: 700; color: ${C.onDark}; }
.disc-sub { font-size: 7.2pt; color: ${C.onDarkMuted}; }
.morning-note {
  margin: auto 0 0; font-size: 7.8pt; line-height: 1.65; color: ${C.accentSoft};
  border-top: 1px solid rgba(232,236,247,.2); padding-top: 14px;
}

/* ---- cream panels ---- */
.sec-title {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 144;
  text-transform: uppercase; font-size: 23pt; line-height: .9; letter-spacing: -.02em;
  margin: 0; color: ${C.field};
}
.sec-rule { width: .8in; height: 3px; background: ${C.accent}; margin: 13px 0 15px; }
.lede { margin: 0 0 10px; font-size: 8.4pt; line-height: 1.6; color: ${C.ink}; }
.overview p { margin: 0 0 10px; font-size: 8pt; line-height: 1.6; color: ${C.inkSoft}; }
.sub {
  margin: 16px 0 11px; font-size: 6.8pt; letter-spacing: .2em; text-transform: uppercase;
  color: ${C.accentInk}; font-weight: 700; font-family: "Bricolage", sans-serif;
}

.stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  border-top: 1px solid ${C.rule}; border-bottom: 1px solid ${C.rule};
  padding: 12px 0; margin: 14px 0 2px;
}
.stat { text-align: center; }
.stat-n {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 90;
  font-size: 17pt; line-height: 1; color: ${C.field};
}
.stat-l { font-size: 6.4pt; letter-spacing: .1em; text-transform: uppercase; color: ${C.inkMuted}; margin-top: 4px; }

.audience { display: flex; align-items: flex-start; gap: 5px; }
.aud { display: grid; justify-items: center; gap: 7px; width: .8in; text-align: center; }
.aud-node {
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
  background: ${C.field}; color: ${C.onDark}; font-size: 7.4pt; font-weight: 700;
}
.aud-node.hot { background: ${C.accent}; color: ${C.fieldDeep}; }
.aud-node { font-family: "Bricolage", sans-serif; font-weight: 800; }
.aud-label { font-size: 6.5pt; line-height: 1.4; color: ${C.inkSoft}; }
.aud-line { height: 1px; background: ${C.rule}; flex: 1; margin-top: 15px; }
.overview-foot {
  margin: auto 0 0 !important; font-size: 7.6pt; line-height: 1.6; color: ${C.inkSoft} !important;
  border-left: 3px solid ${C.accent}; background: ${C.paper}; padding: 11px 12px;
}

/* ---- levels ---- */
.levels { width: 100%; border-collapse: collapse; margin: 2px 0 14px; table-layout: fixed; }
.levels col.spec { width: 40%; }
.levels th, .levels td { padding: 6px 1px; }
.levels thead th { border-bottom: 2px solid ${C.field}; text-align: center; vertical-align: bottom; }
.levels thead th:first-child { border-bottom-color: transparent; }
.lvl {
  /* Condensed here too. "PLATINUM" is the widest cell in the table and the
     column is 43px: at normal width it measured 53 and ran out of the cell,
     which is the failure the width check exists to catch. */
  display: block; font-family: "Bricolage", sans-serif; font-weight: 800;
  font-variation-settings: "wdth" 78, "wght" 800;
  text-transform: uppercase; letter-spacing: -.01em;
  font-size: 7.8pt; color: ${C.field}; line-height: 1;
}
.amt { display: block; font-size: 6.6pt; font-weight: 700; color: ${C.accentInk}; margin-top: 3px; }
.levels tbody th {
  text-align: left; font-size: 7pt; font-weight: 400; line-height: 1.35; color: ${C.inkSoft};
  border-bottom: 1px solid ${C.rule}; padding-right: 5px;
  /* table-layout: fixed will not shrink a column to fit a long word, it just
     lets the word run out of the cell — and "t-shirt" is exactly the kind of
     token that does it. */
  overflow-wrap: anywhere;
}
.levels tbody td { text-align: center; border-bottom: 1px solid ${C.rule}; }
.levels tbody tr:last-child th, .levels tbody tr:last-child td { border-bottom: none; }
.levels .no { color: ${C.inkMuted}; font-size: 9pt; }

.tier-blurbs { display: grid; gap: 9px; }
.tier-blurb-head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 8px;
  border-bottom: 1px solid ${C.rule}; padding-bottom: 3px; margin-bottom: 4px;
}
.tier-blurb-head span:first-child {
  font-size: 6.8pt; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; color: ${C.ink};
}
.tier-blurb-head span:last-child { font-size: 7.4pt; font-weight: 700; color: ${C.accentInk}; }
.tier-blurb p { margin: 0; font-size: 7pt; line-height: 1.45; color: ${C.inkSoft}; }
.levels-note {
  margin: auto 0 0; font-size: 7.4pt; line-height: 1.55; color: ${C.inkSoft};
  background: ${C.paper}; border-left: 3px solid ${C.accent}; padding: 10px 12px;
}

/* ---- back cover ---- */
.back-logo { width: 48px; height: 48px; object-fit: contain; }
.back-title {
  font-family: "Fraunces", Georgia, serif; font-weight: 900;
  font-variation-settings: "SOFT" 45, "WONK" 1, "opsz" 144;
  text-transform: uppercase; font-size: 25pt; line-height: .9; letter-spacing: -.02em;
  margin: 16px 0 0; color: ${C.accentSoft};
}
.back-rule { width: .85in; height: 3px; background: ${C.accent}; margin: 13px 0 15px; }
.back-lede { margin: 0 0 15px; font-size: 8.4pt; line-height: 1.6; color: ${C.onDarkMuted}; }
.mini-levels {
  display: grid; gap: 0; border-top: 1px solid rgba(232,236,247,.2); margin-bottom: 15px;
}
.mini-level {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1px solid rgba(232,236,247,.2); padding: 6px 0;
}
.mini-level span:first-child {
  font-size: 7pt; letter-spacing: .18em; text-transform: uppercase; font-weight: 700; color: ${C.onDark};
}
.mini-level span:last-child { font-size: 8pt; font-weight: 700; color: ${C.accentSoft}; }
.back-steps {
  margin: 0 0 15px; font-size: 7.6pt; line-height: 1.6; color: ${C.fieldDeep};
  background: ${C.accentSoft}; border-left: 3px solid ${C.accent}; padding: 11px 12px;
}
.back-contact { display: grid; gap: 7px; }
.contact-row { display: grid; grid-template-columns: .52in 1fr; align-items: baseline; gap: 8px; }
.contact-label {
  font-size: 6.4pt; letter-spacing: .18em; text-transform: uppercase; color: ${C.onDarkMuted}; font-weight: 700;
}
.contact-value { font-size: 8pt; font-weight: 700; color: ${C.onDark}; word-break: break-word; }
.back-foot {
  margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(232,236,247,.2);
  font-size: 6.4pt; letter-spacing: .16em; text-transform: uppercase; color: ${C.inkMuted};
}

@media print { html, body { background: #fff; } .sheet { box-shadow: none; } }
@media screen {
  body { padding: 24px; display: grid; gap: 24px; justify-content: center; }
  .sheet { box-shadow: 0 18px 50px rgba(0,0,0,.35); }
}
@page { size: 11in 8.5in; margin: 0; }
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(event.name)} — sponsorship brochure</title>
<style>${css}</style>
</head>
<body>
${sheets}
</body>
</html>
`;

const out = resolve(HERE, "brochure.html");
writeFileSync(out, html);
console.log(`wrote ${out}`);
