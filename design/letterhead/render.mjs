/**
 * letterhead.html and letter.html -> print-ready PDFs.
 *
 * Vector, so the type stays selectable and a copy shop can pull it straight
 * in. Fails the build if either sheet runs past one page — a letterhead that
 * spills onto a second sheet with only a footer on it is the version of this
 * that looks worst, and it is invisible until somebody prints it.
 */

import { chromium } from "playwright-core";
import { paletteFromArgs } from "../lib/palette.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const executablePath =
  process.env.CHROMIUM_PATH ||
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

// Suffixed by palette for the same reason as the brochure: both are live
// options and neither should hold the unqualified name.
const PALETTE = paletteFromArgs();
const JOBS = [
  {
    src: "letterhead.html",
    out: `Gada-Global-Letterhead-${PALETTE.id}.pdf`,
    png: `letterhead-${PALETTE.id}.png`,
  },
  {
    src: "letter.html",
    out: `Gada-Global-5K-Sponsor-Letter-${PALETTE.id}.pdf`,
    png: `letter-${PALETTE.id}.png`,
  },
];

const browser = await chromium.launch({ executablePath });
const problems = [];

for (const job of JOBS) {
  const page = await browser.newPage({
    viewport: { width: 816, height: 1056 },
    deviceScaleFactor: 3,
  });
  page.on("pageerror", (e) => problems.push(`${job.src}: ${e.message}`));

  await page.goto(pathToFileURL(resolve(HERE, job.src)).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const fit = await page.evaluate(() => {
    const sheet = document.querySelector(".sheet");
    const body = sheet.querySelector(".body");
    return {
      sheet: sheet.scrollHeight,
      client: sheet.clientHeight,
      bodyOver: body.scrollHeight - body.clientHeight,
    };
  });
  if (fit.sheet > fit.client + 1) {
    problems.push(`${job.src}: sheet content is ${fit.sheet - fit.client}px past one page`);
  }
  if (fit.bodyOver > 1) {
    problems.push(`${job.src}: the letter body overflows by ${fit.bodyOver}px`);
  }

  await page.pdf({
    path: resolve(HERE, job.out),
    width: "8.5in",
    height: "11in",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await (await page.$(".sheet")).screenshot({ path: resolve(HERE, job.png) });
  await page.close();
}

await browser.close();

if (problems.length) {
  console.error("LETTERHEAD LAYOUT FAILED:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`wrote ${JOBS.map((j) => j.out).join(" and ")}`);
