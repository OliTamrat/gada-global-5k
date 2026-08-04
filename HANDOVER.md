# Gada Global 5K — Project Handover

**From:** DAPS Analytics PLC
**To:** Gada Global Inc.
**Platform:** https://www.gadaglobalrun.com
**Repository:** `OliTamrat/gada-global-5k` (branch `master` is production)
**Proposal dated:** June 26, 2026 · **Handover dated:** August 3, 2026
**Event:** Saturday, October 3, 2026

---

## 1. Bottom line

The Phase 1 platform is **delivered, deployed and verified with a real payment**. A live
registration was taken end to end on August 3: card charged, webhook received, bib 101
assigned, confirmation email delivered.

Beyond that, **most of what the proposal quoted separately as Phase 2 ($3,500 – $5,700) has
been built and is live** — the database migration, the organizer dashboard, transactional
email, the race results system, and the custom domain. A race-day timing system that was
never in the proposal at all was also built, because without it the event has no results.

Six items from the proposal were **not** delivered, and a handful of promises made in the
proposal **no longer match the event as it is actually being run**. Both lists are in
sections 5 and 6. Nothing there is hidden; the point of this document is that you can hand
it to anyone and they can check every line.

---

## 2. Phase 1 — what was promised, what shipped

Quoted at **$3,500**. Every line item below is from Section 2 of the proposal.

| Promised | Status | Notes |
|---|---|---|
| Event marketing website, 6 sections | **Delivered** | Grew to 16 pages |
| Cinematic hero — video, typewriter headline, particles, 2 CTA cards | **Delivered** | |
| Live countdown timer | **Delivered** | Counts to the corrected 9:00 AM start |
| Dashboard-style stat cards | **Delivered** | |
| About section — Irrecha, Oromo heritage, 4 feature cards | **Delivered** | |
| Event details section | **Delivered** | Rewritten for the new venue |
| Race day schedule timeline | **Delivered** | Rebuilt to 7:00 AM – noon |
| Irrecha heritage section | **Delivered** | |
| Call-to-action section | **Delivered** | |
| Responsive navbar, cart badge, mobile menu | **Delivered** | |
| Four-column footer | **Delivered** | |
| Registration page, 3-tier pricing selector | **Delivered** | **Prices differ — see §6** |
| Registration form — name, email, phone, age, gender, shirt, emergency contact | **Delivered** | Plus start wave |
| "What's Included" list | **Delivered** | **Timing chip removed — see §6** |
| Stripe Checkout payment processing | **Delivered** | **Live mode, verified with a real charge** |
| Branded success page | **Delivered** | |
| Merchandise store, 3 products | **Delivered** | **Different products — see §6** |
| Size selection XS–XXL | **Delivered** | |
| Shopping cart, quantities, persistent state | **Delivered** | |
| Cart → Stripe checkout with US shipping | **Delivered** | |
| `/api/register`, `/api/checkout`, `/api/webhook` | **Delivered** | 11 API routes now |
| Design system — tokens, fonts, no emojis, scroll reveal, responsive | **Delivered** | Held throughout |
| Deployment setup — Vercel, env vars, Stripe guidance | **Delivered** | |
| Full source code ownership transfer | **Delivered** | You own the repository |
| Deployment documentation | **Delivered** | `.claude/CLAUDE.md` — see §8 |

**Phase 1 is complete.**

---

## 3. Phase 2 — quoted separately, largely delivered anyway

The proposal listed these under "Future Enhancements", estimated at **$3,500 – $5,700**,
to be quoted separately. Most are live now.

| Phase 2 item | Estimate | Status |
|---|---|---|
| **Admin dashboard** | $1,500 – $2,500 | **Delivered** — `/organizers` |
| View and export all registrations (CSV) | | Delivered |
| Track t-shirt size distribution for ordering | | Delivered |
| Monitor revenue by tier and product | | Delivered — registrations + merch combined |
| Manage product inventory and pricing | | **Not delivered** — prices are edited in code |
| Send bulk email to participants | | **Not delivered** |
| **Database migration to PostgreSQL** | $500 – $800 | **Delivered** — Neon, 7 tables |
| Registration records with payment status | | Delivered |
| Order history | | Delivered |
| Participant search and filtering | | Delivered |
| **Email notifications** | $500 – $800 | **Partly delivered** |
| Registration confirmation with bib number | | Delivered |
| Order confirmation for merch | | **Not delivered** — buyers get Stripe's receipt only |
| Pre-race reminder emails | | **Not delivered** |
| Post-race thank you email | | **Not delivered** |
| **Race results system** | $800 – $1,200 | **Delivered** |
| Results page, search by name or bib | | Delivered |
| Age group rankings | | Delivered — on each runner's result page |
| Finisher certificates (PDF) | | **Not delivered** |
| Photo gallery | | **Not delivered** |
| **Custom domain + analytics** | $200 – $400 | **Partly delivered** |
| Custom domain | | Delivered — `gadaglobalrun.com`, DNS on Cloudflare |
| Google Analytics / Plausible | | **Not delivered** — no analytics installed |

**Roughly $3,000 – $4,500 of the Phase 2 estimate has been built inside this engagement.**
What that means commercially is a conversation between the two parties; this document only
records what exists.

---

## 4. Delivered beyond the proposal

None of the following appears anywhere in the proposal. Most of it exists because building
the promised platform surfaced problems the proposal had not anticipated.

**Race-day timing system.** The proposal promised results but never described how a time
gets recorded. Scanning 500 runners individually at a start line takes about 25 minutes, so
that could never have worked. What was built instead:

- **Wave starts** — elite, open and kids, set off a few minutes apart. One volunteer taps
  once per wave and every runner in it inherits that timestamp. Separating the waves is a
  safety measure as much as a timing one: fast runners weaving through walkers and children
  in the first 200 m is how people get hurt.
- **Sending a wave is idempotent** — a second tap returns the original timestamp rather
  than resetting the clock on runners already on the course.
- **Finish scanning** at `/race/scan`, with multiple volunteers able to scan the same bib
  and confidence rising when they agree.
- **A finish scan for a runner with no start time inherits their wave's start** rather than
  being rejected. A volunteer at a finish line cannot fix a missing start, and turning a
  finisher away loses their result permanently.
- **Dispute resolution** at `/race/disputes` for contested times.
- **Passcode protection** on every screen that changes results or shows registrant data,
  enforced server-side and failing closed if the secret is unset.

**Organizer visibility.** Organizers had no way of knowing anyone had registered. Now every
paid registration emails the organizers with the runner, bib, wave, tier, amount, shirt
size and running total, and `/organizers` is the standing answer to "how many so far".

**Printable race bib** with the runner's number, name and wave band, reachable only from
the link in their own confirmation email.

**Sponsorship pages** — `/sponsors` plus a section on the homepage and about page, all
reading from one data file. Figures are placeholders pending your real offer (§7).

**Link-in-bio page** — `/links`, one tap-per-row screen for Instagram bios and flyers.

**QR code kit** — `/promo` generates print-resolution codes for register, results, shop,
links and sponsors. Targets are allowlisted so the endpoint cannot be turned into a
phishing tool.

**`/api/health`** — a single URL that reports whether the deployment can see its database,
whether the Stripe key is test or live and whether the webhook secret is set, whether email
is wired, and what commit is deployed. It never prints a secret. This is what you use to
check a deploy instead of guessing.

**Security hardening found and fixed during the build:**

- The merchandise checkout took the **price from the browser** and passed it to Stripe. A
  crafted request could have bought a $55 hoodie for one cent. Prices are now read
  server-side from the catalogue.
- Race-day screens, including a reset endpoint that wipes timing data, were **completely
  unauthenticated**.
- CSV export escaped cells beginning `=`, `+`, `-` or `@` so a runner's name cannot execute
  as a spreadsheet formula.
- The Stripe webhook claims each event id inside the same transaction as its side effects,
  so a redelivery cannot issue a second bib or send a duplicate email.

---

## 5. Not delivered

Stated plainly. Six items, all from the Phase 2 "Future Enhancements" list.

| Item | Where it was promised |
|---|---|
| Merchandise order confirmation email | §6.3 |
| Pre-race reminder emails (1 week, 1 day) | §6.3 |
| Post-race thank you email with results link | §6.3 |
| Finisher certificates (downloadable PDF) | §6.4 |
| Photo gallery integration | §6.4 |
| Google Analytics / Plausible | §6.5 |
| Multi-language support (Afaan Oromo, Amharic) | §6.5 |
| Volunteer registration form | §6.5 |
| Sponsor logo upload | §6.5 |
| Mobile PWA support | §6.5 |
| Product inventory management | §6.1 |
| Bulk email to participants | §6.1 |

All were explicitly Phase 2 and separately quoted. None blocks the event.

**The nearest thing to a gap that matters on the day:** merch buyers currently receive only
Stripe's automatic receipt, not a branded confirmation. Registrants do get a full branded
email.

---

## 6. Changed since the proposal — read this before promoting anything

These are places where the proposal and the live platform disagree. Some are decisions the
organizers made after June 26; one needs confirming.

### Registration pricing — CONFIRM THIS

| Tier | Proposal | Live now |
|---|---|---|
| Early Bird | $25 | **$45** |
| Standard | $35 | **$48** |
| Race Week | $45 | **$50** |

The live prices are what runners are actually charged. `src/lib/registration.ts` is the
source of truth. If the proposal figures are the agreed ones, this needs changing before
more registrations are taken.

### Timing chips — removed

The proposal's "What's Included" promised an *"official race bib with timing chip"*. There
are no chips. Timing is **gun time per wave**, recorded by volunteers scanning bibs at the
finish. All references to chips were removed from the site and the confirmation email so
nobody is promised something they will not get. True net time requires chip timing
hardware, which is a separate purchase.

### Venue and schedule

| | Proposal | Actual |
|---|---|---|
| Venue | Rock Creek Parkway | **Rock Creek Park Tennis Center**, 5220 16th St NW |
| Course | Point-to-point | **Start and finish in the same place** |
| Race start | 7:30 AM | **9:00 AM** |
| Programme | 6:00 AM – 2:00 PM | **7:00 AM – noon** |

Changed by the organizers in July 2026. The site reflects the new facts throughout.

### Merchandise

| Proposal | Live now |
|---|---|
| Official Race Tee — $28 | Race Day Tee — **$35** |
| Irrecha Gold Edition — $35 | *not built* |
| Gada Heritage Hoodie — $55 | Race Day Hoodie — **$55** |
| — | Race Day Bundle (tee + hoodie) — **$80** |

### Prize purse — added

Not in the proposal at all: **$300 / $200 / $100 for the top three men and the top three
women**, a $1,200 purse, announced at the 10:00 AM awards. This is now on the site, in the
FAQ and in the confirmation email.

### Domain

The proposal suggested `gadaglobal5k.com`. The registered domain is **`gadaglobalrun.com`**
— `gadaglobal.com` belongs to a third party and must not be used.

> **Note on the printed sponsorship flyer:** it carries `info@gadaaglobal5k.org` and
> `www.gadaaglobal5k.org` (double "a"), which is neither this project's domain nor a
> working address. Reconcile before it goes to any business.

---

## 7. Where things stand in production

Verified from the live deployment on August 3, 2026 via `GET /api/health`:

| Check | State |
|---|---|
| Database | **ok** — Neon Postgres, all 7 tables and `bib_seq` present |
| Stripe | **ok** — **live mode** key and webhook secret present |
| Email | **ok** — Resend, sending as `Gada Global 5K <info@gadaglobalrun.com>` |
| Race ops passcode | **ok** — set |
| Site URL | **ok** — `https://www.gadaglobalrun.com` |
| Deployment | production |

**End-to-end verified with a real payment:** Stripe Checkout → card charged → webhook →
`payment_status = paid` → bib assigned → confirmation email delivered with correct event
details, tier, amount, wave and shirt size.

**The database is clean and ready.** All tables empty, `bib_seq` at 101 and uncalled, so
your first real runner gets bib **101**.

**Inbound mail** for `info@gadaglobalrun.com` routes to `gadaglobalrun@gmail.com` via
Cloudflare Email Routing.

---

## 8. What you own and how to operate it

**Source code.** The `OliTamrat/gada-global-5k` repository, in full. `master` is what
deploys.

**Operating documentation.** `.claude/CLAUDE.md` in the repository is the working runbook:
event facts, infrastructure state, the race-day timing model, the go-live steps, and a
gotchas section recording every trap hit during the build so the next person does not hit
it again.

**Race morning, in order:**

1. Volunteers open `/race/start` and enter the passcode once per device
2. Starter sends each wave with two taps as it goes — elite, then open, then kids
3. Finish-line volunteers scan bibs at `/race/scan`
4. Results appear publicly at `/race` as runners cross
5. Contested times are resolved at `/race/disputes`

**Before race day, verify `wave_starts` is empty.** Sending a wave is idempotent by design,
so a leftover row from testing means the starter taps "send", gets a silent success, and the
whole wave is timed from a rehearsal. `select * from wave_starts;` must return zero rows.

**Checking a deployment:** load `/api/health`. It returns 503 until everything required is
present, and names the specific fault. Do not guess.

**Changing prices, products or sponsorship levels:** each lives in exactly one file —
`src/lib/registration.ts`, `src/lib/products.ts`, `src/lib/sponsors.ts`. Every page that
displays them reads from those, so they cannot drift apart.

---

## 9. Open items for the organizers

None of these are code. All are yours to action.

| Item | Why it matters |
|---|---|
| **Confirm registration pricing** | Live prices differ from the proposal (§6) |
| **Confirm the sponsorship offer** | Levels, prices and benefits on `/sponsors` are placeholders taken from a sample flyer, not your agreed offer |
| **Reconcile the flyer's contact details** | It prints a domain that does not exist |
| Upload a logo in Stripe → Branding | Checkout renders generically without it; a 512×512 icon has been prepared |
| Decide on Klarna / Affirm | Both are enabled by default in Stripe and carry higher fees than card at $45 |
| Provide Instagram / Facebook / X URLs | `src/lib/links.ts` — placeholders are filtered out rather than shown as dead links |
| Confirm the finish-line plan | Expect 40–60 finishers inside a two-minute window. Needs a single-file chute, 3–4 volunteers scanning in parallel, and someone writing bib numbers on paper as a fallback. **This is the biggest un-derisked part of race day and it is a staffing question, not a software one.** |

---

## 10. Known limits

Stated so nobody is surprised.

- **Timing is gun time per wave, not net time.** Elite goes first in a small wave so the
  prize places are decided on a few seconds of spread.
- **The platform has not been load-tested at 500 concurrent users.** The proposal's capacity
  figure is untested. Registration traffic arriving gradually is not a concern; a
  simultaneous rush has not been simulated.
- **The finish line is the real bottleneck**, and it is solved by volunteers, not code.
- **Trial and refund flows are manual** — refunds are issued in the Stripe dashboard and the
  database row is removed by hand.
- **Three pre-existing lint warnings** remain in the codebase (`react-hooks/set-state-in-effect`
  in `race/page.tsx`, `Countdown.tsx` and `WordRotator.tsx`). They do not affect behaviour and
  predate this work.

---

## 11. Development record

- **64 commits**, June 26 – August 3, 2026
- **16 pages**, 11 API routes, 7 database tables
- Every change reviewed through a pull request before merging to `master`
- `tsc --noEmit`, `eslint` and a production build run clean on every merge

---

*Prepared by DAPS Analytics PLC · Burtonsville, Maryland · oli@dapsanalytics.com*
