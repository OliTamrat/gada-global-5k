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
Postgres via `pg`, Resend for email, `qrcode` for generated QR codes.
Deployed on Vercel from `master`.

Bib entry at the finish line is typed, not camera-scanned. `html5-qrcode` was a
dependency for a scanner that was never built and has been removed; add it back
only alongside actual scanning code.

> Read `AGENTS.md`: this Next.js version has breaking changes from training data.
> Consult `node_modules/next/dist/docs/` before writing framework code.

## Event facts (current as of 2026-08-02)

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
| Registration tiers | Early Bird **$45**, Standard **$48**, Race Week **$50** (`src/lib/registration.ts` is the source of truth) |

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

Every pull request opened for this project has been merged; none are outstanding.
The full history is on GitHub, so rather than a table that goes stale every time,
what matters is: **`master` is the deployable truth and contains everything** —
Postgres persistence, the Stripe webhook, Resend confirmations for runners and
organizers, wave starts, the printable bib, QR codes, the link-in-bio page, the
organizer dashboard, and the passcode on race-day screens.

## Infrastructure status

| Item | Status |
|---|---|
| Neon Postgres | **Provisioned**, schema applied, 6 tables. Password rotated 2026-07-26. |
| `DATABASE_URL` in Vercel | **Set**, verified reachable from production via `/api/health` |
| Resend account | Dedicated account on `gadaglobalrun@gmail.com`. **Domain `gadaglobalrun.com` VERIFIED 2026-08-01** — DKIM, SPF, and the `send` MX feedback record all green. API key created and set; `/api/health` reports `email: ok`. |
| Inbound mail for `info@` | **Cloudflare Email Routing configured** → `gadaglobalrun@gmail.com`. Resend still only sends; routing handles inbound. |
| Stripe account | **Created 2026-08-01** — "Gada Global Run", live mode activated. Live secret + publishable keys exist. |
| Stripe webhook endpoint | **Sandbox registered** and verified end to end. A **second, live-mode endpoint** is still required before real payments — signing secrets are per-mode. |
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
   entry sits in the results.

   Run this in the **Neon SQL Editor** as one block, while nothing real has
   been taken yet. It wipes every row — do not run it once real registrations
   exist.
   ```sql
   begin;
   delete from race_entries;   -- cascades to scan_logs and disputes
   delete from registrations;
   delete from merch_orders;
   delete from stripe_events;
   delete from wave_starts;
   alter sequence bib_seq restart with 101;
   commit;
   ```
   **`wave_starts` matters more than it looks.** Sending a wave is idempotent
   by design — a second tap returns the original timestamp rather than resetting
   the clock. So a leftover test row means that on race morning the starter taps
   "send", gets a silent success, and every runner in that wave is timed from a
   rehearsal weeks earlier. Verify it is empty before race day:
   `select * from wave_starts;` must return zero rows.

   Afterwards confirm with:
   ```sql
   select (select count(*) from registrations) as regs,
          (select count(*) from race_entries) as entries,
          (select count(*) from merch_orders) as merch,
          (select count(*) from wave_starts) as waves,
          last_value from bib_seq;
   ```
   All counts zero. `bib_seq.last_value` reads 101 and `is_called` is false, so
   the first real runner gets 101.
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
- Proposal documents (`GADA_GLOBAL_5K_BUSINESS_PROPOSAL.md`, `public/proposal.html`,
  `proposal/index.html`) still carry the old venue and 7:30 AM start. Intentionally
  untouched — they may already be with sponsors.

---

## Link-in-bio page

**`/links`** collects register, event details, shop, live results, print-your-bib,
about, and contact into one tap-per-row screen for Instagram bios, flyers, and
QR codes. `/api/qr/links` generates the matching code, listed on `/promo`.

Built to match the Nooruu Official linktree: a coloured icon tile per row,
centred divider labels between groups, a Share-this-page button (native share
sheet, clipboard fallback), and a brand/copyright/Olink footer block.
Glyphs live in `src/components/LinkIcons.tsx`, keyed by the `icon` field on a
link so `links.ts` stays plain data — the footer draws from the same set.

Destinations live in `src/lib/links.ts`, shared with the footer so the two can
never drift. **Social hrefs are still `#` placeholders and are filtered out
rather than rendered as dead icons** — replace the href in that file and they
appear in both places at once.

The site footer is hidden on `/links` (it repeated the same destinations
directly beneath them), which is why `Footer` is a client component.

---

## Sponsorship

**`/sponsors`** is the page to send a business to, and `src/lib/sponsors.ts` is
the only place the levels and benefits are written down. The page, the
`Become a Sponsor` section on `/about`, the enquiry mailto links and the
`/api/qr/sponsors` code all read from it, so they cannot drift apart from each
other — or from the printed flyer, as long as the file is kept in step with it.

Four levels, mirroring the flyer: Platinum $2,000+, Gold $1,000+, Silver $500+,
Bronze $250+.

**The figures on the page are placeholders.** The four levels, the prices and
the four benefits came from a *sample* sponsorship flyer used as a visual and
structural reference — not from Gada Global's own agreed offer. Nobody has
signed these off. Confirm the real levels, prices and benefits with the
organizers before the page is promoted or anything is printed from it.

Everything is editable from `src/lib/sponsors.ts` alone: prices, level names,
blurbs, and which levels unlock which benefits. Adding or removing a benefit
needs an entry in `SPONSOR_BENEFITS` plus a glyph in `SponsorTiers`' `ICONS`
map — the coverage meter sizes itself. As the placeholders stand, Silver and
Bronze unlock the same two benefits, so if the real offer keeps four levels,
each should get something the level below does not have.

The **design** is the site's own and does not need revisiting: it deliberately
does not reproduce the reference flyer's four-column table, star medallions,
metal gradients or headlines. An earlier pass did, and was rebuilt.

`SponsorTiers` is a vertical accordion in the site's own language: charcoal
surfaces, a single yellow accent, and a left rail whose opacity comes from the
level's `weight` rather than from a metal colour. Each row carries a **coverage
meter** — four segments, filled for each benefit the level unlocks, with an
"N of 4" readout. That is what conveys hierarchy, and it is also what makes the
Silver/Bronze collision below impossible to miss (both read "2 of 4").

Opening a level lists every benefit, included or not. What is *not* included
shows a muted icon and a link to the cheapest level that unlocks it — so every
"no" is a route to a higher level instead of a rejection. `unlockedBy()` derives
that from the benefit's tier list; nothing is hard-coded per level.

**Two things to settle with the organizers before this is promoted widely:**

1. **Silver and Bronze currently unlock exactly the same two benefits**, so
   there is no reason to pay $500 rather than $250. This is carried over from
   the flyer deliberately rather than silently patched. Moving
   `Logo on website & social media` down to include `silver` fixes it in one
   line and costs nothing to give.
2. **The flyer's contact details do not match the site.** It prints
   `info@gadaaglobal5k.org` and `www.gadaaglobal5k.org` (note the double "a"),
   neither of which is this project's domain. The code uses
   `info@gadaglobalrun.com`. Whichever is right, the two must be reconciled
   before the flyer goes out or sponsor enquiries will land nowhere.

Enquiries are **email, not checkout** — deliberately. A sponsor has to send
logo artwork and agree a printing deadline, so a pay-now button would just
leave the organizers chasing files. `sponsorMailto()` pre-fills the level in
the subject line and a short form in the body. If instant sponsor payment is
ever wanted, it is a new Stripe line item, not a change to this page.

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

## Stripe Checkout page

Checkout is hosted by Stripe, so what it looks like is split between this repo
and the Stripe Dashboard. Knowing which half owns a given complaint saves a lot
of searching.

**This repo controls the content** (`src/app/api/register/route.ts` and
`src/app/api/checkout/route.ts`):

- The line item carries a real product name, a description naming the runner,
  their wave, shirt size, and the date, time and venue, and the Gada Global
  logo as a thumbnail via `product_data.images`.
- `custom_text.submit` lists what the entry includes and the $1,200 purse;
  `custom_text.after_submit` says the confirmation email is coming and gives
  the support address. Both cap at 1200 characters.
- `client_reference_id` is the registration id, so a Stripe payment can be
  traced back to a row without opening the metadata panel.
- **`payment_method_types` is deliberately not set.** Omitting it lets Stripe
  offer everything enabled on the account, so Apple Pay, Google Pay and Link
  appear above the card form. Pinning it back to `["card"]` is what makes the
  page a bare card field again.
- Line-item images are absolute URLs built by `publicAsset()` in
  `src/lib/site.ts`, which returns null for a non-https origin. Stripe fetches
  these from its own servers and cannot reach localhost, so in local dev the
  thumbnail is omitted rather than broken.

**The Stripe Dashboard controls the appearance** — nothing in this repo can
change these:

- *Settings → Business → Branding*: logo, icon, brand colour and accent colour.
  An account with no logo set is why Checkout looks generic.
- *Settings → Business details*: the business name in the header and the
  statement descriptor on the card statement.
- *Settings → Payment methods*: which wallets and methods actually appear.

**Merch prices are looked up server-side.** `/api/checkout` takes only `id`,
`size` and `quantity` from the browser and reads the price from
`src/lib/products.ts`. It previously passed the request body's `price` straight
into `unit_amount`, so a crafted POST could buy a $55 hoodie for a cent. Sizes
are validated against the product and quantity is capped at 20. Keep it that
way: the browser must never name a price.

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
- **The webhook URL must carry the `www` AND the `/api/webhook` path.** Exactly:
  `https://www.gadaglobalrun.com/api/webhook`. This cost three real runners their
  bibs and emails on 2026-08-05. Stripe does not follow redirects, so each wrong
  form fails in its own way and none of them is obvious from the Stripe UI:
  - `https://gadaglobalrun.com/api/webhook` → apex redirects to www → **308**
  - `https://www.gadaglobalrun.com` → lands on the homepage → **405**
  - correct URL, wrong signing secret → **400** `{"error":"Invalid signature"}`
  - working → **200** `{"received":true}`

  **Payments succeed regardless.** Stripe charges the card at Checkout; the bib,
  the runner's confirmation and the organizer alert all come from the webhook. So
  the failure looks like "money arrived, nothing happened" — rows sit at
  `payment_status='pending'` with no bib, and `/organizers` shows nothing because
  it counts only paid rows.

  **Before announcing registration, open a delivery in Stripe → Webhooks and
  confirm it returned 200.** `/api/health` cannot check this: it only sees that a
  `whsec_` exists, not what URL Stripe has registered or whether deliveries land.

  **Recovery is safe.** The webhook is idempotent, so any failed event can be
  replayed from Stripe → Webhooks → the destination → the event → **Resend**. It
  assigns the bib, emails the runner and emails the organizers. Stripe also
  auto-retries failed events for ~3 days, so fixing the URL often heals the
  backlog without touching anything.

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
