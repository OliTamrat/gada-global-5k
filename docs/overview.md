# Gada Global | 5K Peace Run — overview

Marketing site, registration, and race-day timing for an annual, timed 5K
road race open to every community, run by Gada Global
Inc. Saturday, October 3, 2026, Rock Creek Park Tennis Center, Washington
DC — Kids 1K 8:00 AM and 5K 8:30 AM, per the NPS safety plan (see decisions/0008). (The venue moved from Rock Creek Parkway in July
2026; anything describing a point-to-point parkway course is stale.)

The event's name and public details live in `src/lib/event.ts` — the one
place to change them (see `decisions/0007`). Registration tiers live in
`src/lib/registration.ts` (Early Bird /
Standard / Race Week); prize purse is $1,200 — top three men and top three
women. Domain: **gadaglobalrun.com** — site canonical on the www host,
email on the apex (`info@gadaglobalrun.com`; Resend verifies the apex).

## The pipeline, verified end to end (2026-08-02)

A sandbox registration went the whole way: Stripe Checkout → payment →
webhook → `payment_status='paid'` → bib assignment → confirmation email
with correct event details. The plumbing works; what remains before real
registrations is configuration, not code (`runbooks/go-live.md`).

## What is decided vs assumed

Four content decisions came from timeout defaults and were never explicitly
confirmed (ADR-0005): the purse split, the festival end time, the removed
Lincoln Memorial card, website-only updates. The sponsor tiers are
placeholder figures from a sample flyer (ADR-0006). Neither should reach
print before confirmation — the ADRs exist so nobody mistakes them for
settled.
