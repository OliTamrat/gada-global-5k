# ADR-0004 — The browser never names a price

**Status:** accepted · **Date:** 2026-07 (after a real vulnerability)

## Context
`/api/checkout` once passed the request body's `price` into
`unit_amount` — a crafted POST could buy a $55 hoodie for one cent.

## Decision
The client sends only `id`, `size`, `quantity`; the server reads the price
from `src/lib/products.ts`, validates sizes, caps quantity. Registration
prices likewise resolve server-side from `registration.ts`.

## Consequences
Fleet rule status: the same principle appears in dispatch (Stripe tier
from price id) and bank-assist. Keep it that way.

## References
`src/app/api/checkout/route.ts`, `src/lib/products.ts`.
