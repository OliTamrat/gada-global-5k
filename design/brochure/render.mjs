// Renders both brochure sides to 300dpi PNGs (3300x2550, US Letter landscape).
// Fails the run if any element escapes its panel, so a layout break cannot
// reach a printer unnoticed.
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

let broken = 0;
for (const side of ["outside", "inside"]) {
  const page = await browser.newPage({
    viewport: { width: 1100, height: 850 },
    deviceScaleFactor: 3,
  });
  await page.goto("file://" + path.join(DIR, `${side}.html`), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const escaped = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll(".panel *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.left < -2 || r.top < -2 || r.right > 1102 || r.bottom > 852)) {
        out.push(el.className || el.tagName);
      }
    });
    return out;
  });
  if (escaped.length) { broken++; console.error(`${side}: OVERFLOW -> ${escaped.join(", ")}`); }
  else console.log(`${side}: contained`);

  await page.screenshot({ path: path.join(DIR, `gada-5k-brochure-${side}.png`) });
  await page.close();
}
await browser.close();
if (broken) process.exit(1);
