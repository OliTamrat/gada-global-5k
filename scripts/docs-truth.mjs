// The docs are claims about the code, so the code gets to grade them.
//
// Zero dependencies on purpose: this repo had no test framework and no CI
// when OKM arrived, and a checker that needs an install is a checker that
// stops running. Regex over source is cruder than importing modules, but
// every extractor below guards itself against matching nothing, so rot
// fails loudly instead of passing vacuously.
import { readFileSync, readdirSync } from "node:fs";

let failures = 0;
const fail = (msg) => { failures++; console.error("FAIL:", msg); };
// Whitespace-normalised reads: prose wraps lines, and a claim must not
// fail the check because an editor re-flowed a paragraph.
const read = (p) => readFileSync(p, "utf8").replace(/\s+/g, " ");

// --- registration tiers: cents in src/lib/registration.ts ---------------
const reg = read("src/lib/registration.ts");
const prices = [...reg.matchAll(/price:\s*(\d+)/g)].map((m) => Number(m[1]) / 100);
if (prices.length < 3) fail("registration.ts price extractor matched <3 tiers — fix the regex, not the docs");
// The root CLAUDE.md is a one-line pointer (@AGENTS.md); the real
// briefing with the tier table is .claude/CLAUDE.md.
const claude = read(".claude/CLAUDE.md");
for (const p of prices) {
  if (!claude.includes(`$${p}`)) fail(`CLAUDE.md does not mention the $${p} tier that registration.ts charges`);
}

// --- waves: order in src/lib/waves.ts -----------------------------------
const wavesSrc = read("src/lib/waves.ts");
const wavesMatch = wavesSrc.match(/WAVES\s*=\s*\[([^\]]+)\]/);
if (!wavesMatch) { fail("waves.ts WAVES extractor matched nothing"); }
else {
  const waves = [...wavesMatch[1].matchAll(/"(\w+)"/g)].map((m) => m[1]);
  const arch = read("docs/architecture.md");
  const stated = waves.join(" → ");
  if (!arch.includes(stated)) fail(`docs/architecture.md must state the wave order "${stated}" as waves.ts defines it`);
}

// --- sponsor levels: names in src/lib/sponsors.ts -----------------------
const sponsors = read("src/lib/sponsors.ts");
const levels = [...sponsors.matchAll(/name:\s*"(\w+)"/g)].map((m) => m[1]);
if (levels.length < 2) fail("sponsors.ts level extractor matched <2 levels");
const adr6 = read("docs/decisions/0006-sponsor-tiers-are-placeholders.md");
for (const level of levels) {
  if (!adr6.includes(level)) fail(`sponsor level "${level}" exists in sponsors.ts but ADR-0006 does not name it`);
}

// --- event name: src/lib/event.ts is the only place it is written -------
// The rename to "Gada Global 5K Peace Run" touched 39 literals across 18 files
// because nothing owned the name. Now event.ts does, and the prose has to
// agree with it. See docs/decisions/0007.
// Two forms are legitimate: the lockup "Gada Global | 5K Peace Run" for titles
// and headings, and the prose name for sentences. A doc must use one of them.
const eventSrc = read("src/lib/event.ts");
const eventName = eventSrc.match(/\bname:\s*"([^"]+)"/);
const eventLockup = eventSrc.match(/lockup:\s*"([^"]+)"/);
if (!eventName || !eventLockup) {
  fail("event.ts name/lockup extractor matched nothing — fix the regex, not the docs");
} else {
  const forms = [eventName[1], eventLockup[1]];
  for (const doc of ["README.md", ".claude/CLAUDE.md", "docs/overview.md"]) {
    const text = read(doc);
    if (!forms.some((f) => text.includes(f))) {
      fail(`${doc} names neither "${forms[0]}" nor "${forms[1]}", the forms event.ts defines`);
    }
  }
}

// --- ADRs: sequential, indexed ------------------------------------------
const adrs = readdirSync("docs/decisions").filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();
const nums = adrs.map((f) => parseInt(f.slice(0, 4), 10));
if (nums.length === 0) fail("no ADRs found");
nums.forEach((n, i) => { if (n !== i + 1) fail(`ADR numbering broken at ${adrs[i]}`); });
const index = read("docs/decisions/README.md");
for (const f of adrs) {
  if (!index.includes(`| ${f.slice(0, 4)} |`)) fail(`ADR ${f.slice(0, 4)} missing from decisions/README.md`);
}

if (failures) { console.error(`\n${failures} doc-truth failure(s)`); process.exit(1); }
console.log("docs-truth: all claims match the code");
