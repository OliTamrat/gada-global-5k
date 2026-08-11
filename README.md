# Gada Global 5K

Marketing site, registration, payment, and race-day timing system for the
**Gada Global 5K** — an annual community race celebrating Oromo heritage and
the Irrecha festival, run by **Gada Global Inc.**

Runners register and pay through Stripe Checkout, get a printable bib with a
QR code, and are timed by wave rather than individually scanned at the
start line — a volunteer sends each wave once, and every runner in it gets
a start time backfilled from that single tap. Organizers get a live
dashboard: paid count, revenue across registrations and merch, breakdowns
by wave/tier/shirt size, and a CSV export.

**Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19, Tailwind v4,
Stripe, Postgres via `pg`, Resend for email, `qrcode` for generated codes.
Deployed on Vercel from `master`.

> This Next.js version has breaking changes from most training data — see
> `AGENTS.md` before writing framework code.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run db:setup`
applies `schema.sql` to whatever `DATABASE_URL` points at (idempotent).

## Documentation

`docs/` is this product's OKM (Olink Knowledge Management) tree —
`overview.md`, `architecture.md`, `runbooks/`, `integrations/`, and
`decisions/` (ADRs, including two marked *provisional* because they came
from timeout defaults and still need organizer confirmation — see
`docs/decisions/0005-timeout-default-decisions.md`). Checkable claims there
(registration tiers, wave order, sponsor levels, ADR numbering) are graded
against the code by `scripts/docs-truth.mjs` in CI.

`.claude/CLAUDE.md` is the full operational briefing — event facts,
infrastructure status, the exact webhook and timing gotchas that have
already cost real runners a bib once. Read it before touching Stripe,
the race clock, or anything under `/race`.

All seven Olink products follow this same `docs/` taxonomy and aggregate
into one searchable portal at
[`olink-knowledge`](https://github.com/OliTamrat/olink-knowledge).

## Deploy

Vercel, from `master` (this repo has no `main`). Check
`GET /api/health` after any change to secrets or environment — it reports
database, Stripe mode, and email configuration without ever printing a
secret.

---

*A product of [Olink Technologies](https://olinkgo.us).*
