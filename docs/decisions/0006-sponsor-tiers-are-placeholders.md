# ADR-0006 — Sponsor tiers are placeholders from a sample flyer

**Status:** provisional — needs organizer sign-off · **Date:** 2026-08

## Context
`/sponsors` was built from a *sample* flyer used as structural reference:
Platinum/Gold/Silver/Bronze at their listed amounts, four benefits.
Nobody has signed these off. Two known problems: Silver and Bronze unlock
identical benefits (no reason to pay the difference), and the flyer's
contact details (`gadaaglobal5k.org`) are not this project's domain.

## Decision
`src/lib/sponsors.ts` is the single editable source (page, /about
section, mailto links and QR all read from it). Enquiries are email, not
checkout — a sponsor must send artwork and agree deadlines, so a pay-now
button would leave organizers chasing files.

## Consequences
Before wide promotion: confirm real levels/prices/benefits, give Silver
something Bronze lacks, reconcile the flyer's contact details.
