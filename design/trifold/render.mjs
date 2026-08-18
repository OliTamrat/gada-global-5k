/**
 * brochure.html -> a print PDF and 300dpi PNGs.
 *
 * Vector, not raster. An earlier attempt in this repo had to assemble the PDF
 * from images because its design used `mix-blend-mode` and backdrop filters,
 * which Chromium's print pipeline does not composite. Nothing here uses them,
 * so `page.pdf()` keeps the text selectable and the file small — which also
 * means a print shop can pull it straight in.
 *
 * It FAILS the build if any element escapes its panel. A tri-fold that overflows
 * silently is a stack of paper with a sentence cut in half down the fold, and
 * you find out at the printer.
 *
 *   npm i --no-save --no-package-lock playwright-core
 *   CHROMIUM_PATH=/path/to/chrome node design/trifold/render.mjs
 */

import { chromium } from "playwright-core";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(HERE, "brochure.html");

const executablePath =
  process.env.CHROMIUM_PATH ||
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({
  viewport: { width: 1056, height: 816 },
  deviceScaleFactor: 3, // 96dpi * 3 = 288; close enough to 300 for a leaflet
});

const problems = [];
page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));

await page.goto(pathToFileURL(SRC).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

/* ---- the check that makes this safe to send to a printer ---- */
const overflow = await page.evaluate(() => {
  const bad = [];

  // Decorative shapes are absolutely positioned and DELIBERATELY run off the
  // panel — the disc behind the cover type, the one behind the schedule. They
  // still count toward scrollHeight, so measuring with them visible reported
  // 125px of overflow on a panel that was two-thirds empty. Hide them for the
  // measurement and put them back: the check is about content a reader could
  // lose, and `aria-hidden` is already the mark for "carries no information".
  const decor = [...document.querySelectorAll('[aria-hidden="true"]')];
  for (const d of decor) d.style.display = "none";

  for (const panel of document.querySelectorAll(".panel")) {
    const p = panel.getBoundingClientRect();
    // 1px of tolerance: sub-pixel rounding on a rule or a border is not an
    // overflow, and failing on it would make the check unusable.
    if (panel.scrollHeight > panel.clientHeight + 1) {
      bad.push(`${panel.className}: content is ${panel.scrollHeight - panel.clientHeight}px taller than its panel`);
    }
    // Decorative shapes are DELIBERATELY cropped by the panel edge — the disc
    // behind the cover type runs off the side, which is the point of it, and
    // the panel's own `overflow: hidden` is what makes that safe. They are
    // marked `aria-hidden` because they carry no information, and that is the
    // same set this check is allowed to ignore. Anything a reader could read
    // is still checked.
    for (const el of panel.querySelectorAll("*")) {
      if (el.closest('[aria-hidden="true"]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > p.right + 1 || r.left < p.left - 1) {
        bad.push(`${panel.className} — <${el.tagName.toLowerCase()} class="${el.className}"> crosses the fold`);
        break;
      }
      // A long unbreakable word overflows its BOX while the box itself stays
      // inside the panel, so comparing rectangles alone missed the cover
      // headline running off the edge entirely. scrollWidth is what catches
      // it, and it is the failure that would have reached the printer.
      if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
        bad.push(`${panel.className} — <${el.tagName.toLowerCase()} class="${el.className}"> text is ${el.scrollWidth - el.clientWidth}px wider than its box`);
        break;
      }
    }
  }

  for (const d of decor) d.style.display = "";
  return bad;
});
problems.push(...overflow);

/* ---- the PDF ---- */
await page.pdf({
  path: resolve(HERE, "Gada-Global-5K-Sponsorship-Brochure.pdf"),
  width: "11in",
  height: "8.5in",
  printBackground: true,
  preferCSSPageSize: true,
});

/* ---- one PNG per side, for a phone or a slide ---- */
const sheets = await page.$$(".sheet");
for (let i = 0; i < sheets.length; i++) {
  const name = i === 0 ? "outside" : "inside";
  await sheets[i].screenshot({ path: resolve(HERE, `brochure-${name}.png`) });
}

await browser.close();

if (problems.length) {
  console.error("BROCHURE LAYOUT FAILED — do not send this to a printer:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`wrote Gada-Global-5K-Sponsorship-Brochure.pdf and ${sheets.length} PNGs`);
