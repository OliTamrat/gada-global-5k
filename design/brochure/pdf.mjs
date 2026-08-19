// Assembles the two-page print PDF from the rendered PNGs.
//
// Deliberately NOT page.pdf() over the DOM: Chromium's print pipeline does not
// composite mix-blend-mode, CSS masks or backdrop filters, and this design is
// built from them — printing the DOM produced a black page.
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const embed = (side) =>
  fs.readFileSync(path.join(DIR, `gada-5k-brochure-${side}.png`)).toString("base64");

const html = `<style>
  @page { size: 11in 8.5in; margin: 0; }
  html, body { margin: 0; padding: 0; background: #000; }
  .pg { width: 11in; height: 8.5in; page-break-after: always; overflow: hidden; }
  img { display: block; width: 11in; height: 8.5in; }
</style>` + ["outside", "inside"].map((s) => `<div class="pg"><img src="data:image/png;base64,${embed(s)}"></div>`).join("");

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({
  path: path.join(DIR, "gada-5k-sponsorship-brochure.pdf"),
  width: "11in", height: "8.5in", printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
console.log("gada-5k-sponsorship-brochure.pdf written");
