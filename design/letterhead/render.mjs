// Renders the letterhead sheets at 300dpi (2550 x 3300, US Letter portrait).
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

for (const sheet of ["blank", "letter"]) {
  const page = await browser.newPage({ viewport: { width: 850, height: 1100 }, deviceScaleFactor: 3 });
  await page.goto("file://" + path.join(DIR, `letterhead-${sheet}.html`), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);

  // A letter that runs past the footer is a letter that prints wrong.
  const spill = await page.evaluate(() => {
    const body = document.querySelector(".body");
    const foot = document.querySelector(".foot");
    return body.getBoundingClientRect().bottom > foot.getBoundingClientRect().top + 1;
  });
  console.log(`${sheet}: ${spill ? "BODY OVERFLOWS THE FOOTER" : "fits"}`);

  await page.screenshot({ path: path.join(DIR, `gada-5k-letterhead-${sheet}.png`) });
  await page.close();
}
await browser.close();
