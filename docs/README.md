# The knowledge base — OKM Phase 1

Durable knowledge for the Gada Global 5K, on the OKM taxonomy. The agent
briefing (`.claude/CLAUDE.md` → `AGENTS.md`) stays the operational
quick-reference; this tree holds what must survive it. Checkable claims are
graded by `scripts/docs-truth.mjs` — zero dependencies, run by
`.github/workflows/docs-truth.yml`, which is also this repository's first CI
workflow (until now PRs were checked only by GitGuardian and Vercel).

One rule above the others here: **`src/lib/` is the source of truth for
every number.** Prices in `registration.ts` and `products.ts`, waves in
`waves.ts`, sponsor levels in `sponsors.ts`, link destinations in
`links.ts`. Prose that repeats a number is prose that will lie eventually —
the checker holds the few places that must.

| Where | What |
|---|---|
| `overview.md` | The event, the registration pipeline, what is verified vs pending |
| `architecture.md` | Next.js 16, Neon, the timing model, the money paths |
| `runbooks/` | Go-live, race day, clearing test data |
| `integrations/` | Stripe, Resend, Neon, Cloudflare/Vercel DNS |
| `decisions/` | ADRs — including the ones taken from timeout defaults, flagged as such |
