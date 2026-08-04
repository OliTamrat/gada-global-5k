# Gada Global 5K — Project Handover

**Prepared by:** DAPS Analytics PLC
**Prepared for:** Gada Global Inc.
**Platform:** https://www.gadaglobalrun.com
**Repository:** `OliTamrat/gada-global-5k`
**Delivered:** August 3, 2026 · **Event:** Saturday, October 3, 2026

---

## 1. Summary

The Gada Global 5K digital platform is **built, deployed and live**, taking real payments.

A complete registration was processed end to end on August 3: card charged through Stripe
in live mode, payment confirmed by webhook, bib number assigned, and a branded confirmation
email delivered to the runner. The database is clean and ready, with the first runner set to
receive bib 101.

The platform delivers everything the June 26 proposal set out for Phase 1, plus the majority
of the Phase 2 enhancements that were quoted separately, plus a complete race-day timing
system that was not in the original scope at all.

**By the numbers:** 16 pages · 11 API endpoints · 7 database tables · 64 commits over six
weeks.

---

## 2. What the platform does

### For runners

- A full marketing site — cinematic hero with video and animated headline, live countdown,
  event details, race-day schedule, Irrecha heritage section, prize podium and FAQ
- Three-tier registration with a start-wave selection, collecting name, contact, age,
  gender, t-shirt size and emergency contact
- Secure card payment through Stripe, with Apple Pay, Google Pay and Link available
- A branded confirmation email carrying their bib number, wave, tier, amount, shirt size,
  race-day timings, directions to the venue, and a link to print their bib
- A printable race bib with their number, name and wave band
- Live results on race day, searchable by name or bib, with age-group rankings
- A merchandise store with cart, size selection and US shipping

### For organizers

- **A dashboard** showing paid registrations, total revenue across registrations and merch,
  abandoned checkouts, and breakdowns by wave, tier and **t-shirt size for ordering** —
  plus a CSV export of every paid registration
- **An email on every registration** with the runner's details, bib, wave, amount and the
  running total, so nobody has to go looking
- **A sponsorship offer online** — four levels with benefits, on its own page, on the
  homepage and on the about page, with enquiries arriving pre-filled with the level
- **A link-in-bio page** for Instagram and flyers, and a **QR code kit** producing
  print-resolution codes for registration, results, shop, sponsors and links
- **A health check** at one URL that confirms the site can see its database, that Stripe is
  in live mode, that email is working, and which version is deployed

### On race day

- **Wave starts** — elite, open and kids. One volunteer taps once per wave and every runner
  in it is timed from that moment. No runner is scanned at the start.
- **Finish scanning** by multiple volunteers, with confidence rising when they agree
- **Live results** published publicly as runners cross
- **Dispute resolution** for contested times
- **Passcode protection** on every screen that changes results or shows runner data

---

## 3. Delivered against the proposal

### Phase 1 — complete

All 25 line items from Section 2 of the proposal are delivered: the marketing website and
all its sections, the registration system and form, Stripe payment processing, the success
page, the merchandise store with cart and shipping, the API layer, the design system, the
deployment setup, full source code ownership and documentation.

The site grew from the 6 sections proposed to **16 pages**, and from 3 API routes to **11**.

### Phase 2 — most of it delivered too

The proposal listed these as future enhancements to be quoted separately, at an estimated
$3,500 – $5,700. The following are built and live:

| Phase 2 item | Estimate | Delivered |
|---|---|---|
| **Admin dashboard** | $1,500 – $2,500 | Registrations, CSV export, revenue by tier and product, t-shirt size distribution |
| **Database migration to PostgreSQL** | $500 – $800 | Neon Postgres, 7 tables, payment status, order history, search |
| **Email notifications** | $500 – $800 | Registration confirmation with bib number (organizer alerts added on top) |
| **Race results system** | $800 – $1,200 | Results page, search by name or bib, age-group rankings |
| **Custom domain** | $200 – $400 | gadaglobalrun.com, DNS on Cloudflare, inbound mail routing |

Roughly **$3,000 – $4,500** of that estimate was built inside this engagement.

Five smaller Phase 2 items were not built: merchandise order confirmation emails, pre-race
and post-race emails, downloadable finisher certificates, a photo gallery, and analytics.
None affects the event. They remain available as future work.

---

## 4. Built beyond the proposal

None of the following was in the original scope.

**A complete race-day timing system.** The proposal promised results but did not describe
how a time gets recorded. Scanning 500 runners individually at a start line takes roughly 25
minutes, so a workable model had to be designed and built: wave starts that time an entire
group from a single tap, finish scanning by multiple volunteers, a rule that lets a finisher
be recorded even if their start was missed, and dispute resolution for contested times.
Waves also separate fast runners from walkers and children in the opening stretch, which
matters as much for safety as for timing.

**Organizer notifications and dashboard**, so registrations are visible as they happen
rather than at the end.

**The printable race bib**, carrying the runner's number, name and wave band, delivered
through the link in their own confirmation email.

**Sponsorship pages** with four levels and benefits, all driven from a single file so the
homepage, about page and sponsors page can never disagree.

**The link-in-bio page and QR code kit** for promotion.

**A health endpoint** that turns "is the deployment configured correctly" into one URL
rather than guesswork.

**Security work carried out during the build**, including moving merchandise pricing
server-side so it cannot be manipulated from a browser, adding authentication to race-day
screens, hardening the CSV export, and making the payment webhook safe against duplicate
delivery.

---

## 5. Live status

Confirmed from production on August 3, 2026:

| | |
|---|---|
| Database | Connected — all 7 tables and the bib sequence present |
| Stripe | **Live mode** — key and webhook secret in place |
| Email | Sending as `Gada Global 5K <info@gadaglobalrun.com>` |
| Race-day passcode | Set |
| Domain | https://www.gadaglobalrun.com |

**Verified end to end with a real payment.** Stripe Checkout → card charged → webhook →
registration marked paid → bib assigned → confirmation email delivered with the correct
event details, tier, amount, wave and shirt size.

**Ready for registrations.** The database is clean and the bib sequence is at 101, so the
first runner receives bib 101.

---

## 6. Operating it

**You own the source code** — the full repository, with `master` as the deployed branch.

**The runbook lives with it.** `.claude/CLAUDE.md` documents the event facts, infrastructure,
race-day timing model, go-live steps, and every issue encountered during the build so the
next person does not repeat them.

**Race morning, in order:**

1. Volunteers open the start screen and enter the passcode once per device
2. The starter sends each wave with two taps as it goes — elite, then open, then kids
3. Finish-line volunteers scan bibs as runners cross
4. Results appear publicly in real time
5. Contested times are resolved on the disputes screen

**Checking a deployment:** load `/api/health`. It reports what is and is not configured, and
never prints a secret.

**Changing prices, products or sponsorship levels:** each lives in exactly one file, and
every page that shows them reads from there, so they cannot drift apart.

---

## 7. Changes since the proposal

Recorded for completeness. The site reflects the current facts throughout.

| | Proposal (June 26) | Current |
|---|---|---|
| Venue | Rock Creek Parkway | Rock Creek Park Tennis Center, 5220 16th St NW |
| Course | Point-to-point | Start and finish in the same place |
| Race start | 7:30 AM | 9:00 AM |
| Programme | 6:00 AM – 2:00 PM | 7:00 AM – noon |
| Registration | $25 / $35 / $45 | $45 / $48 / $50 |
| Merchandise | Race Tee $28, Irrecha Gold $35, Heritage Hoodie $55 | Race Day Tee $35, Hoodie $55, Bundle $80 |
| Prize purse | not specified | $300 / $200 / $100 for top three men and women — $1,200 |
| Timing | bib with timing chip | gun time per wave, scanned at the finish |
| Domain | gadaglobal5k.com | gadaglobalrun.com |

The registration prices and the sponsorship figures on the site are worth a final
confirmation before wider promotion.

---

## 8. Remaining items

All configuration or content, none blocking:

- Upload a logo in Stripe → Branding so Checkout carries the event's identity
- Review which payment methods are enabled in Stripe (Klarna and Affirm are on by default)
- Provide Instagram, Facebook and X URLs to activate the social links
- Confirm the sponsorship levels and benefits, which are currently placeholders
- Plan the finish-line chute and volunteer rota — expect 40–60 finishers within a
  two-minute window

---

## 9. Development record

- **64 commits**, June 26 – August 3, 2026
- **16 pages**, 11 API routes, 7 database tables
- Every change reviewed through a pull request before merging
- Type checking, linting and a production build run clean on every merge

---

*Prepared by DAPS Analytics PLC · Burtonsville, Maryland · oli@dapsanalytics.com*
