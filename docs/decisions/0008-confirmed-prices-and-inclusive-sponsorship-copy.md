# ADR-0008 — Confirmed sponsorship prices, and sponsorship copy that names no community

**Status:** accepted · **Date:** 2026-08 · **Supersedes the price half of ADR-0006**

## Context
ADR-0006 recorded the four levels as *placeholders* taken from a sample flyer,
with nobody signed off on them. Separately, every sponsorship artefact opened
by describing the race as "a community race celebrating Oromo heritage and the
Irrecha festival" — copy inherited from the website, where the same framing
runs through the homepage, the schedule, the FAQ and the metadata.

## Decision
**Prices are confirmed** by the organizers: Platinum $5,000, Gold $2,500,
Silver $1,000, Bronze $500. They are minimum commitments, not the flyer's
open-ended `+` figures. `src/lib/sponsors.ts` remains the single source, so the
website, the letter, the Word documents and the printed tri-fold all moved
together on one edit.

**The sponsorship materials name no particular community.** The race is
described as a community road race run by Gada Global Inc., a licensed
Washington DC company, open to runners and walkers of every age and background.
The reasoning is the organizers': some people do not want to be part of the
Irrecha celebration, and a business being asked for money should read a welcome
rather than a qualifier. Applied to the tri-fold, the letterhead and letter
PDFs, the Word documents, the `/sponsors/letter` page and the "why sponsor"
card on `/sponsors`.

## Consequences
The benefit list is **still** the flyer's and still unconfirmed — Silver and
Bronze unlock the same two, so nothing justifies paying $1,000 rather than
$500. That half of ADR-0006 stands and the warnings now say so specifically
rather than blaming the prices.

**The rest of the site was deliberately not changed.** The homepage hero, the
about page, the interactive schedule, the FAQ, the shop copy, the confirmation
email footer and the page metadata all still carry the heritage framing. That
is a whole-brand positioning decision rather than a sponsorship one, it is the
organizers' to make, and half-applying it across a site would read worse than
either version. If it should go site-wide, that is its own change.
