/**
 * The event and the offer, read out of the modules that already own them.
 *
 * Shared by everything under `design/` — the Word letter and the printed
 * brochure both build from here, so a price changed in `src/lib/sponsors.ts`
 * moves the website, the letter and the brochure together.
 *
 * Regex over source rather than an import: these scripts are plain node and
 * the files are TypeScript inside a Next app. Every extractor throws when it
 * matches nothing, so a rename fails the build loudly instead of quietly
 * producing a document with gaps where the facts should be. That is the whole
 * point — the three proposal documents in this repo were hand-written once and
 * still carry the old venue and the 7:30 AM start.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function source(file) {
  return readFileSync(resolve(REPO, file), "utf8");
}

export function repoPath(file) {
  return resolve(REPO, file);
}

export function readEvent() {
  const src = source("src/lib/email.ts");
  const block = src.match(/export const EVENT = \{([\s\S]*?)\} as const;/);
  if (!block) throw new Error("EVENT extractor matched nothing in src/lib/email.ts");
  const event = {};
  for (const [, key, value] of block[1].matchAll(/(\w+):\s*"([^"]+)"/g)) {
    event[key] = value;
  }
  for (const key of [
    "name", "date", "startTime", "packetPickup", "awardsTime",
    "programHours", "location", "address", "organization", "supportEmail",
  ]) {
    if (!event[key]) throw new Error(`EVENT.${key} missing — check src/lib/email.ts`);
  }
  return event;
}

export function readSponsors() {
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

export function readDomain() {
  const src = source("src/lib/site.ts");
  const fallback = src.match(/"(https:\/\/[^"]+)"/);
  if (!fallback) throw new Error("site origin extractor matched nothing in src/lib/site.ts");
  return fallback[1].replace(/^https?:\/\//, "");
}

/** The registration tiers, so the brochure can say what an entry costs. */
export function readRegistration() {
  const src = source("src/lib/registration.ts");
  const prices = [...src.matchAll(/price:\s*(\d+)/g)].map((m) => Number(m[1]) / 100);
  if (prices.length < 2) throw new Error("registration price extractor matched fewer than two tiers");
  return { lowest: Math.min(...prices), highest: Math.max(...prices) };
}

/** The cheapest level that unlocks a benefit — mirrors `unlockedBy()`. */
export function unlockedBy(benefit, tiers) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (benefit.tiers.includes(tiers[i].id)) return tiers[i];
  }
  return tiers[0];
}
