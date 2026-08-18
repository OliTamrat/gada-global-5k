# ADR-0007 — The sponsor letter is generated from the code, not a template file

**Status:** accepted · **Date:** 2026-08

## Context
There was no brochure and no letter anywhere in this repo. The only
outreach artefacts were the proposal documents
(`GADA_GLOBAL_5K_BUSINESS_PROPOSAL.md`, `public/proposal.html`,
`proposal/index.html`), and all three still carry the **old venue and the
7:30 AM start** — left untouched on purpose because they may already be
with sponsors (see the briefing). So the obvious move, a `.docx` or a
markdown template somebody edits and prints, would have produced a
fourth artefact free to go stale in exactly the same way. That is the
failure this repo has already had once.

Every fact a sponsorship letter needs is already owned by a module: the
date, venue and times by `EVENT` in `src/lib/email.ts`, the levels and
benefits by `src/lib/sponsors.ts`.

## Decision
The letter is a page — `/sponsors/letter` — rendered from those modules.
Nothing about the race is retyped into it. `src/lib/letter.ts` holds the
prose, and renders it twice from one source: the letterheaded sheet to
print and sign, and plain text to paste into an email. `Letterhead.tsx`
carries the masthead separately, because the next letter is a new body on
the same masthead.

Three properties are load-bearing rather than incidental:

- **The benefit list is derived, never described.** The prose version said
  "the higher levels add your logo to the race t-shirt" — a true sentence in
  a Bronze letter and a false one in a Gold letter. One sentence cannot be
  right for four different offers, and a letter that misstates what a
  business is buying is worse than no letter. The list comes from
  `SPONSOR_BENEFITS`, so moving a benefit between levels changes the letter,
  the page and the enquiry email together.
- **It fits on one sheet, and that is measured.** Every variant is checked
  against a US Letter page in a browser under print media; the tightest
  (all four levels, a long business name) leaves 0.37in spare.
- **The brand is on the sheet, and it prints.** Green-into-gold rule, gold
  eyebrow, gold subject mark, cream benefit panel with a gold rail and
  deep-green checks — the site's own palette, so a business that reads the
  letter and then visits the page sees one organization. All of it is
  `background`, which Chrome drops from a print job unless told otherwise;
  `print-color-adjust: exact` is what stops the branding silently not
  existing on paper. Colour is accent only and never carries meaning alone,
  so black-and-white printing degrades it rather than breaking it.
- **Nothing is stored.** Composed, printed or copied, gone. A page that kept
  a list of every business approached would be holding outreach records
  nobody asked it to hold.

## Consequences
The placeholder-price problem of ADR-0006 now reaches print, so the page
carries a screen-only warning naming it — along with the three things
deliberately left out of the letter because no honest value exists yet:
**how many runners to expect**, **the artwork deadline**, and a **postal
address** on the letterhead (it reads "Washington, DC"; the venue address
is the park's, not the organization's). That warning must never print.

Still open, and not addressed here: there is no **brochure** — a one-page
leave-behind a volunteer hands across a counter is a different artefact
from a letter, and would want the same generated-not-templated treatment.
