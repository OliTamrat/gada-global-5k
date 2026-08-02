# Gada Global 5K — Project Guidelines

## Golden Rules
- **NEVER use emojis in any UI** — use SVG icons or text instead
- No Claude attribution in commits

---

## What this is

Marketing site, registration, and race-day timing system for the **Gada Global 5K**, an
annual community race celebrating Oromo heritage and the Irrecha festival, run by
**Gada Global Inc.**

**Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19, Tailwind v4, Stripe,
Postgres via `pg`, Resend for email, `html5-qrcode` for bib scanning.
Deployed on Vercel from `master`.

> Read `AGENTS.md`: this Next.js version has breaking changes from training data.
> Consult `node_modules/next/dist/docs/` before writing framework code.

## Event facts (current as of 2026-07-26)

| | |
|---|---|
| Date | Saturday, October 3, 2026 |
| Venue | Rock Creek Park Tennis Center, 5220 16th St NW, Washington, DC 20011 |
| Packet pickup | 7:00 AM |
| Opening ceremony | 8:15 AM |
| Race start | **9:00 AM** |
| Awards | 10:00 AM |
| Cultural festival | 10:45 AM – 12:00 PM |
| Program window | 7:00 AM to noon |
| Prizes | $300 / $200 / $100 for top three **men** and top three **women** — $1,200 purse |
| Registration tiers | Early Bird $25, Standard $35, Race Week $45 |

The venue changed from Rock Creek Parkway in July 2026. Anything describing a
point-to-point parkway course (Kennedy Center finish, Lincoln Memorial) is stale —
start and finish are now the same place, inside Rock Creek Park.

## Domain

- `gadaglobal.com` is **registered to a third party** — do not use it.
- `gadaglobalus.com` and `gadaglobalinc.com` were considered and dropped.
- **`gadaglobalrun.com`** is the chosen domain (decided 2026-07-27).
- **Host split:** the site canonical is `https://www.gadaglobalrun.com` (the www host),
  but email uses the apex — `info@gadaglobalrun.com`. Email addresses never carry a
  `www`, and Resend verifies the **apex** domain, not the www subdomain.
- Site currently lives at `gada-global-5k.vercel.app`.

## Repository state

`master` holds the deployable code.

**Vercel deploy history — resolved 2026-08-01.** For a period the live site was frozen
at commit `41eba44` and no merged work shipped. Root cause: the Vercel project had
**no Git repository connected at all** (Settings → Git showed the provider picker, and
Deploy Hooks reported "This Project is not connected to a Git repository"). The tell
was that every PR showed only a GitGuardian check and **no Vercel check** — a
connected repo always produces one for preview deployments. Reconnected to
`OliTamrat/gada-global-5k` on 2026-08-01.

If deployments ever go stale again, check that first: Settings → Git must show the
connected repo, and the Production Branch must be `master` (this repo has no `main`).
Connecting does not retroactively deploy — trigger one via Deployments → Redeploy or
a fresh push.

| PR | Contents | State |
|---|---|---|
| #2 | Venue, times, prize section | **Merged** |
| #3 | Contact email → `gadaglobalrun.com` (7 marketing refs) | **Merged** |
| #1 | Postgres + Resend confirmation email | **Merged 2026-08-02** (`1a6058d`) |
| #5 | Prize podium, race bib, merch, spacing, transparent tee | **Merged 2026-08-02** (`257b7e7`) |

**All application code is merged.** `master` at `257b7e7` contains the full stack:
Postgres persistence, the Stripe webhook, Resend confirmations, and the finished
marketing page. Nothing further is blocked on code.

PR #5's body carries one stale line — it lists the tee artwork as a follow-up. That
was already done; `public/products/race-day-tee-cutout.png` is wired into the What's
Included section.

## Infrastructure status

| Item | Status |
|---|---|
| Neon Postgres | **Provisioned**, schema applied, 6 tables. Password rotated 2026-07-26. |
| `DATABASE_URL` in Vercel | Not set |
| Resend account | Dedicated account on `gadaglobalrun@gmail.com`. **Domain `gadaglobalrun.com` VERIFIED 2026-08-01** — DKIM, SPF, and the `send` MX feedback record all green. API key not yet created. |
| Inbound mail for `info@` | **Not set up.** Resend only sends; mail to `info@gadaglobalrun.com` bounces until forwarding (Cloudflare Email Routing / ImprovMX) or a mailbox (Google Workspace / Zoho) adds apex MX records. |
| Stripe account | **Created 2026-08-01** — "Gada Global Run", live mode activated. Live secret + publishable keys exist. |
| Stripe webhook endpoint | **Not registered** — this is the gate on everything below |
| `gadaglobalrun.com` | **Registered**, DNS on Cloudflare (Vercel records must be grey-cloud / DNS only) |
| **Vercel Git integration** | **Fixed 2026-08-01** — reconnected, preview + production deploys firing |

Neon tables: `registrations`, `race_entries`, `scan_logs`, `disputes`,
`merch_orders`, `stripe_events`. Apply or re-apply with `npm run db:setup`
(idempotent) or paste `schema.sql` into the Neon SQL Editor.

---

## NEXT TODO — in order

The code is done. Everything remaining is configuration the agent sandbox cannot
reach (Neon, Resend, Stripe, Vercel all blocked — see gotchas), so these are all
user-side steps.

> **Check your work with `GET /api/health`.** It reports, without ever printing a
> secret, whether the deployment can see `DATABASE_URL` (and whether all 6 tables
> plus `bib_seq` exist), whether the Stripe key is test or live and whether the
> webhook secret is set, whether Resend is wired, and what `NEXT_PUBLIC_SITE_URL`
> resolves to. Returns 503 until everything required is present. Hit it after each
> step below instead of guessing.

**Do the whole loop in Stripe test mode first.** Test and live are parallel worlds
with separate keys, separate webhook endpoints, and separate signing secrets.

1. **Resend API key** — the domain is verified but no key exists yet. Create one.
   Optionally add a DMARC TXT record on `_dmarc` (`v=DMARC1; p=none;`).
2. **Inbound mail for `info@`** — Resend only *sends*. Mail to
   `info@gadaglobalrun.com` bounces until Cloudflare Email Routing / ImprovMX
   forwarding, or a real mailbox, adds apex MX records. Not a blocker for sending
   confirmations; is a blocker for anyone replying to one.
3. **Stripe webhook endpoint** (test mode): Developers → Webhooks → add endpoint
   `https://www.gadaglobalrun.com/api/webhook`, event `checkout.session.completed`.
   Reveal the signing secret — that `whsec_…` is `STRIPE_WEBHOOK_SECRET`.
   **This is the real gate.** Without it nothing marks a registration paid or
   assigns a bib, so no email ever fires.
4. **Vercel env vars** (Production + Preview), then redeploy — Vercel does not pick
   up new vars on an existing deployment:
   - `DATABASE_URL` — Neon pooled connection string
   - `RESEND_API_KEY`
   - `REGISTRATION_FROM_EMAIL="Gada Global 5K <info@gadaglobalrun.com>"`
   - `NEXT_PUBLIC_SITE_URL=https://www.gadaglobalrun.com`
   - `STRIPE_SECRET_KEY` (`sk_test_…` for now), `STRIPE_WEBHOOK_SECRET`
5. **End-to-end test** with card `4242 4242 4242 4242`: register → the
   `registrations` row should show `payment_status='paid'` and a bib >= 101 → the
   confirmation email should arrive.
6. **Go live**: swap in `sk_live_…`, register a *second* webhook endpoint in live
   mode, and replace `STRIPE_WEBHOOK_SECRET` with that endpoint's secret.
7. **Merge PR #5** (prize podium / bib / merch / spacing). Independent of all the
   above — no env vars, no database.

**No longer needed as of 2026-08-01** — the domain is verified, so
`REGISTRATION_FROM_EMAIL="Gada Global 5K <info@gadaglobalrun.com>"` now sends to any
recipient. Kept for reference only:

**Shortcut for testing before DNS is ready:** set
`REGISTRATION_FROM_EMAIL="Gada Global 5K <onboarding@resend.dev>"` and register with
**`gadaglobalrun@gmail.com`** as the runner email. An unverified Resend account can only
send to its own signup address, so that specific address is the only one that will
receive anything until the domain verifies.

### Open questions

- Four content decisions were taken from timeout-default answers and never explicitly
  confirmed: the $1,200 split across two divisions (vs. one combined top three), the
  festival ending at noon (the source note read "7am-12am"), removing the Lincoln
  Memorial card, and updating the website only. Re-confirm before print or promotion.
- The 5K route is described generically ("looping through the surrounding park roads
  and trails"). Replace with the real route once mapped.
- `public/images/course/lincoln-memorial.jpg` is now unused. A Tennis Center or
  course photo would make a better third card in the course section.
- Proposal documents (`GADA_GLOBAL_5K_BUSINESS_PROPOSAL.md`, `public/proposal.html`,
  `proposal/index.html`) still carry the old venue and 7:30 AM start. Intentionally
  untouched — they may already be with sponsors.

---

## Gotchas

- **Switching branches changes `package.json`.** `pg` exists only on the PR #1 branch.
  Re-run `npm install` after any checkout or the build fails with
  "Cannot find module 'pg'".
- **`pg` returns int8 as a string.** `src/lib/db.ts` installs a type parser mapping
  INT8 to Number. Epoch-ms timestamps and bigserial ids are all inside
  `Number.MAX_SAFE_INTEGER`.
- **jsonb parameters must be `JSON.stringify`'d.** Passing a JS array directly makes
  node-postgres send a Postgres array literal, which jsonb rejects.
- **Bib numbers come from `bib_seq`, starting at 101** — clear of the 1–12 demo range
  used by `seedDemoData()`.
- **Webhook idempotency:** the Stripe event id is claimed in `stripe_events` inside the
  same transaction as its side effects. A redelivery is a no-op; a mid-flight failure
  rolls back cleanly for retry. Do not move the claim outside the transaction.
- **Email failure must never fail the webhook** — Stripe would retry and re-process the
  payment. Sends happen after commit; failures log and leave `confirmation_sent_at`
  null, which is how unsent confirmations stay findable:
  `select * from registrations where payment_status='paid' and confirmation_sent_at is null;`
- **`export const dynamic = "force-dynamic"` is still valid** in Next 16. Route handlers
  are uncached by default anyway.
- **3 pre-existing eslint errors** in `Countdown.tsx` and `WordRotator.tsx`
  (`react-hooks/set-state-in-effect`). Not introduced by recent work — verify against a
  clean tree before blaming a change.
- **Stripe test and live are parallel worlds.** Separate keys, separate webhook
  endpoints, and **separate signing secrets**. A live-mode `whsec_` will not verify a
  test-mode event: `constructEvent` throws, the route returns 400, the payment
  succeeds and nothing is recorded. Going live means registering a *second* webhook
  endpoint in live mode and swapping `STRIPE_WEBHOOK_SECRET` to that endpoint's
  secret — not just swapping the API key. `/api/health` reports which mode the key is.
- **The Stripe publishable key is unused.** Checkout is a server-side redirect
  (`getStripe().checkout.sessions.create` → `session.url`); nothing imports
  `@stripe/stripe-js`. Only `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` matter.
  (Publishable keys are public by design anyway — no action needed if one leaks.)
- **Sandbox egress is allowlisted.** Neon (TCP 5432), `api.resend.com`, and Stripe are
  all unreachable from the agent sandbox — connections hang or return
  `403 CONNECT tunnel failed`. Anything touching those services must be verified by the
  user. Local Postgres 16 **is** installed and `schema.sql` applies to it cleanly, so
  DB-touching code can be integration-tested for real. Two snags: `initdb` refuses to
  run as root (`su postgres -c …`, and put PGDATA somewhere postgres can traverse,
  e.g. `/tmp`), and `pkill -f "next dev"` matches its own shell — it kills the calling
  Bash tool with exit 144.
