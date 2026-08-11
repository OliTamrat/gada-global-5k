# Architecture

Next.js 16.2.9 (App Router, Turbopack), React 19, Tailwind v4, Postgres on
Neon via `pg`, Stripe Checkout (server-side redirect — the publishable key
is unused), Resend for email, deployed on Vercel from `master` (there is no
`main`). **This Next.js version has breaking changes from training data**
— read `node_modules/next/dist/docs/` before writing framework code
(`AGENTS.md` is the standing warning).

## The timing model (the most designed part of the system)

Runners are never scanned at the start. The starter sends a **wave** — one
tap at `/race/start` writes one row to `wave_starts` and backfills
`start_time` for the whole wave. Three waves (`src/lib/waves.ts`): elite →
open → kids — a safety measure as much as a timing one. Sending a wave is
**idempotent**: a second tap returns the original timestamp. Finish scans
inherit their wave's start if missing; timing is gun-time per wave.
`docs/runbooks/race-day.md` carries the operational half.

## The money paths

- Registration: price chosen server-side by tier and date.
- Merch: `/api/checkout` reads price from `products.ts` — the browser
  never names a price (it once could: a crafted POST bought a $55 hoodie
  for a cent; ADR-0004).
- Webhook idempotency: the Stripe event id is claimed in `stripe_events`
  inside the side-effect transaction — the fleet-standard claim-first
  pattern.
- Email failures never fail the webhook; unsent confirmations stay
  findable (`confirmation_sent_at is null`).

## Access control

`RACE_OPS_PASSCODE` gates every result-changing or registrant-data screen,
enforced server-side, failing closed (503 when unset). Public reads stay
open. Organizers get a per-registration email and the `/organizers`
dashboard (CSV export is formula-injection-safe).
