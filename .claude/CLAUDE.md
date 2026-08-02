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

### Done as of 2026-08-02

- **Resend API key** created and set. `/api/health` reports `email: ok`.
- **Neon** reachable from production — `database: ok`, all 6 tables and `bib_seq`
  verified through the live deployment, not just locally.
- **Stripe sandbox webhook destination** created: `Gada 5K registration (sandbox)`
  → `https://www.gadaglobalrun.com/api/webhook`, payload style **Snapshot**,
  listening to `checkout.session.completed` only.
- **Vercel env vars** set for Production + Preview: `DATABASE_URL`,
  `NEXT_PUBLIC_SITE_URL`, `REGISTRATION_FROM_EMAIL`, `STRIPE_SECRET_KEY`,
  `STRIPE_WEBHOOK_SECRET`. `RESEND_API_KEY` was Production-only — widen it to
  Preview so preview builds can send.
- **Vercel production deploys** were lagging behind `master` even with previews
  green. Check *Settings → Git → Production Branch* is `master`, and use
  **Promote to Production** on a current deployment rather than **Redeploy** on a
  stale one (Redeploy rebuilds that row's own commit).

### END-TO-END VERIFIED — 2026-08-02

A sandbox registration with card `4242 4242 4242 4242` went the whole way:
Stripe Checkout → payment → webhook → `payment_status='paid'` → **bib 101** →
confirmation email delivered. Event details, tier, amount, and t-shirt size all
rendered correctly in the email. **The registration pipeline works.**

Cloudflare Email Routing is configured for `info@gadaglobalrun.com` →
`gadaglobalrun@gmail.com` (destination verified, routing rule created). Exactly
one `v=spf1` record exists on the apex, so there is no SPF conflict with Resend
— Resend's records live on `send.gadaglobalrun.com`.

**The two-variable Stripe trap cost the most time here.** `STRIPE_SECRET_KEY`
(`sk_test_…`) and `STRIPE_WEBHOOK_SECRET` (`whsec_…`) are *different
credentials for opposite directions*: the first authenticates you calling
Stripe (creating the Checkout session), the second verifies Stripe calling you
(the payment-completed webhook). Checkout working proves **only** the first.
The `whsec_` was pasted into `STRIPE_SECRET_KEY` and the second variable was
never created, which produced a successful payment with no bib and no email.
`/api/health` names this exact fault now.

### Still open

1. **Clear the test data before real registrations open.** Bib 101 is consumed
   by the sandbox test above, and test and live Stripe modes share **one
   database**. Leaving it means the first real runner gets bib 102 and a fake
   entry sits in the results. Clean up with:
   ```sql
   delete from race_entries where bib in (select bib from registrations where payment_status = 'paid' and email = '<test email>');
   delete from registrations where email = '<test email>';
   delete from stripe_events;            -- test-mode event ids, no longer needed
   alter sequence bib_seq restart with 101;
   ```
2. **Go live.** Swap `STRIPE_SECRET_KEY` to `sk_live_…`, register a *second*
   webhook endpoint in **live** mode (same URL, same `checkout.session.completed`,
   payload style **Snapshot**), and replace `STRIPE_WEBHOOK_SECRET` with that
   endpoint's signing secret. Signing secrets are per-mode — reusing the sandbox
   one silently drops every live payment. Redeploy, then confirm `/api/health`
   shows `stripe: ok` rather than `warn`.
3. Optionally add a DMARC TXT record on `_dmarc` (`v=DMARC1; p=none;`).
4. Optionally widen `RESEND_API_KEY` to Preview (it is Production-only), so
   preview deployments can send test confirmations.

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

## Link-in-bio page

**`/links`** collects register, event details, shop, live results, print-your-bib,
about, and contact into one tap-per-row screen for Instagram bios, flyers, and
QR codes. `/api/qr/links` generates the matching code, listed on `/promo`.

Destinations live in `src/lib/links.ts`, shared with the footer so the two can
never drift. **Social hrefs are still `#` placeholders and are filtered out
rather than rendered as dead icons** — replace the href in that file and they
appear in both places at once.

The site footer is hidden on `/links` (it repeated the same destinations
directly beneath them), which is why `Footer` is a client component.

---

## Race operations and organizer visibility

**`RACE_OPS_PASSCODE` gates every screen that changes results or shows registrant
data:** `/race/start`, `/race/scan`, `/race/disputes`, `/organizers`, and the
routes behind them, plus the `?seed=true` reset. Volunteers enter it once per
device; it is stored in localStorage and sent as an `x-race-ops` header.

The gate is **enforced server-side** — the component is convenience only.
It **fails closed**: with the variable unset those routes return 503. An unset
secret is a deploy mistake fixable in a minute, whereas a wave sent by a
stranger cannot be undone. `/api/health` reports whether it is configured.

Public reads stay open: `GET /api/race` (results) and the runner pages are
unauthenticated, as they should be.

**Organizers are emailed on every paid registration** — runner, bib, wave, tier,
amount, shirt size, phone, emergency contact, and the running total, with
reply-to set to the runner. Recipients come from `ORGANIZER_EMAILS`
(comma-separated), defaulting to the support address so a missed variable never
leaves organizers blind. Like the runner confirmation, a send failure is logged
and swallowed — it must never fail the webhook and trigger a Stripe retry.

**`/organizers`** is the standing answer to "how many have registered": paid
count, **total revenue across registrations and merch**, merch order count,
abandoned checkouts, breakdowns by wave, tier and **t-shirt size for ordering**,
the 25 most recent registrations, recent merch orders, and a CSV export of every
paid registration. The revenue figure combines both streams so it reconciles
against a Stripe payout without adding two numbers by hand.
CSV cells starting `=`, `+`, `-` or `@` are prefixed with an apostrophe so a
runner's name cannot execute as a spreadsheet formula.

---

## Race-day timing model

**Runners are never scanned at the start line.** Scanning 500 people individually
would take ~25 minutes; instead the starter sends a wave and one volunteer taps
once at `/race/start`, which writes a single row to `wave_starts` and backfills
`start_time` for every runner in that wave.

Three waves, in `src/lib/waves.ts`: **elite → open → kids**, a few minutes apart.
Separating them is a safety measure as much as a timing one — fast runners
weaving through walkers and children in the first 200 m is how people get hurt.

- Wave is chosen at registration, stored on `registrations` and `race_entries`,
  printed as a coloured band on the bib so runners self-sort into a corral, and
  named in the confirmation email.
- **Sending a wave is idempotent.** The primary key on `wave_starts` means a
  second tap returns the original timestamp rather than resetting the clock on
  runners already on the course. The UI also requires two taps to send.
- A finish scan for a runner with no `start_time` **inherits their wave's start**
  rather than being rejected. A volunteer at a finish line cannot fix a missing
  start, and turning a finisher away loses their result. It only fails if the
  wave itself was never sent.
- Day-of registrations seed `start_time` from `wave_starts` at insert, so someone
  who registers after their wave has gone still has a running clock.
- `/race/scan` keeps a "Late Start" mode as a manual override for a single runner.
  It is not how the race is started.
- Timing is **gun time per wave**, not net time. Elite goes first in a small wave
  so the prize places are decided on a few seconds of spread. True net time needs
  chip timing.

**Not solved in code — the finish line is the real bottleneck.** Expect 40–60
finishers inside a two-minute window around 28–32 min. That needs a single-file
chute with 3–4 volunteers scanning in parallel, plus someone writing bib numbers
in finish order on paper as a fallback. `recordScan` already supports multiple
volunteers per bib and raises confidence when they agree.

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
- **3 pre-existing eslint errors** (`react-hooks/set-state-in-effect`), one each in
  `race/page.tsx`, `Countdown.tsx`, and `WordRotator.tsx`. Not introduced by recent
  work — verify against a clean tree before blaming a change. New code avoids the
  rule by deferring the first fetch with `void Promise.resolve().then(load)` rather
  than calling it in the effect body.
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
