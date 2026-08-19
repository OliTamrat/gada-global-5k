// Print PDFs from the rendered sheets — one blank, one carrying the model letter.
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

for (const sheet of ["blank", "letter"]) {
  const b64 = fs.readFileSync(path.join(DIR, `gada-5k-letterhead-${sheet}.png`)).toString("base64");
  const page = await browser.newPage();
  await page.setContent(`<style>
    @page { size: 8.5in 11in; margin: 0; }
    html, body { margin: 0; padding: 0; }
    img { display: block; width: 8.5in; height: 11in; }
  </style><img src="data:image/png;base64,${b64}">`, { waitUntil: "load" });
  await page.pdf({
    path: path.join(DIR, `gada-5k-letterhead-${sheet}.pdf`),
    width: "8.5in", height: "11in", printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await page.close();
}
await browser.close();
console.log("letterhead PDFs written");
