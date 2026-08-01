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

**Vercel is NOT currently deploying `master`.** As of 2026-07-27 the live site is
frozen at commit `41eba44`, and none of the merged work has shipped. Evidence: all
four PRs opened against this repo show only a GitGuardian check and **no Vercel
check at all**, which a Vercel-connected repo always produces for preview
deployments. Most likely the project's Git integration is disconnected or its
Production Branch is set to `main` rather than `master`. Fix in
Vercel → Settings → Git. Until that is resolved, merging changes nothing visible.

| PR | Contents | State |
|---|---|---|
| #2 | Venue, times, prize section | **Merged** |
| #3 | Contact email → `gadaglobalrun.com` (7 marketing refs) | Open, ready, no dependencies |
| #1 | Postgres + Resend confirmation email | **Draft** — blocked on env vars |

PR #1 branch: `claude/gada-global-5k-status-35dp69`
PR #3 branch: `claude/domain-gadaglobalus-35dp69`

After #3 merges, PR #1 needs a rebase onto `master`.

## Infrastructure status

| Item | Status |
|---|---|
| Neon Postgres | **Provisioned**, schema applied, 6 tables. Password rotated 2026-07-26. |
| `DATABASE_URL` in Vercel | Not set |
| Resend account | Dedicated account on `gadaglobalrun@gmail.com` (2026-07-27), replacing the earlier personal `sifanbone` account. No API key set, no domain verified. |
| Stripe webhook endpoint | Not registered |
| `gadaglobalrun.com` | Chosen 2026-07-27, registration status unconfirmed |
| **Vercel Git integration** | **Broken — not deploying `master`. Blocks everything visible.** |

Neon tables: `registrations`, `race_entries`, `scan_logs`, `disputes`,
`merch_orders`, `stripe_events`. Apply or re-apply with `npm run db:setup`
(idempotent) or paste `schema.sql` into the Neon SQL Editor.

---

## NEXT TODO — in order

0. **Reconnect Vercel to the repo** (Settings → Git; Production Branch must be
   `master`). Nothing that has been merged is visible until this is fixed, so it
   comes before everything else.
1. **Register `gadaglobalrun.com`**, set up `info@` mailbox or forwarder.
2. **Merge PR #3** once that address works.
3. **Resend**: create API key, add the **apex** domain `gadaglobalrun.com` (not the www
   host), add DKIM/SPF records at the registrar. Slowest step — DNS propagation.
   Start early.
4. **Vercel env vars** (Production + Preview), then redeploy:
   - `DATABASE_URL` — Neon pooled connection string
   - `RESEND_API_KEY`
   - `REGISTRATION_FROM_EMAIL="Gada Global 5K <info@gadaglobalrun.com>"`
   - `NEXT_PUBLIC_SITE_URL=https://www.gadaglobalrun.com`
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
5. **Stripe**: Developers → Webhooks → endpoint `https://<domain>/api/webhook`,
   event `checkout.session.completed`. This is the real gate — without it nothing
   marks a registration paid or assigns a bib, so no email fires.
6. **Rebase PR #1** onto `master`, mark ready, merge.
7. **End-to-end test**: Stripe test-mode registration → check the `registrations`
   row has `payment_status='paid'` and a bib >= 101 → confirm the email arrives.

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
- **Sandbox egress is allowlisted.** Neon (TCP 5432), `api.resend.com`, and Stripe are
  all unreachable from the agent sandbox — connections hang or return
  `403 CONNECT tunnel failed`. Anything touching those services must be verified by the
  user. Local Postgres 16 is installed and can be used for real integration testing.
