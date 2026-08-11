# Go-live

**Check every step with `GET /api/health`** — it reports (without printing
secrets) DB reachability and the six tables, which Stripe mode the key is
and whether the webhook secret is set, Resend wiring, and the site URL.
503 until everything required is present. The authoritative, current
checklist lives in the repo CLAUDE.md ("NEXT TODO"); the invariants:

1. **Clear the test data first** (`runbooks/clear-test-data.md`) — bib 101
   is consumed by the sandbox test and both Stripe modes share one
   database.
2. **Live mode is a parallel world**: swap to `sk_live_…` AND register a
   second webhook endpoint in live mode AND swap `STRIPE_WEBHOOK_SECRET`
   to that endpoint's signing secret. The two-variable trap
   (`integrations/stripe.md`) cost the most time of anything in this
   project — checkout working proves only the outbound key.
3. Confirm `/api/health` says `stripe: ok`, not `warn`, after the swap.
