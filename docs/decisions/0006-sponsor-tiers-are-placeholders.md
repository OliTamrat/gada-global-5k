# ADR-0006 — Sponsorship levels, prices and benefit ladder

**Status:** accepted (supersedes the provisional placeholder version) · **Date:** 2026-08

## Context
`/sponsors` was originally built from a *sample* flyer used as structural
reference: Platinum/Gold/Silver/Bronze at invented amounts and four
benefits. Two defects came with it — Silver and Bronze unlocked identical
benefits, so a business had no reason to pay the difference, and the
flyer's contact details (`gadaaglobal5k.org`) were not this project's
domain.

## Decision
The organizers set the real figures in 2026-08: **Platinum $5,000, Gold
$2,500, Silver $1,000, Bronze $500.** The benefit ladder was rebuilt so
every level unlocks something the level below does not:

| Level | Unlocks | Headline benefit |
|---|---|---|
| Platinum | 8 of 8 | Category exclusivity, presenting billing, logo on the race bib, post-event report |
| Gold | 6 of 8 | Logo on the race shirt, exhibitor space at the festival |
| Silver | 4 of 8 | Named from the stage, website and social placement |
| Bronze | 3 of 8 | Venue signage, digital listing, two complimentary entries |

`src/lib/sponsors.ts` remains the single editable source — the page, the
about-page section, the mailto links, the QR target and the printed
tri-fold brochure all read from it. Enquiries stay email rather than
checkout: a sponsor must send artwork and agree deadlines, so a pay-now
button would leave organizers chasing files.

## Consequences
The Silver/Bronze collision is resolved. Prices appear in the site copy,
the FAQ, the link-in-bio blurb and the brochure; changing them means
changing `sponsors.ts` **and** those copy strings, which is why
`scripts/docs-truth.mjs` checks the level names against this ADR.
Contact details are `info@gadaglobalrun.com` throughout — the sample
flyer's domain is not used anywhere.
