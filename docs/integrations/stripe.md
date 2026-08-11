# Stripe

## The two-variable trap — this repo's most expensive lesson

`STRIPE_SECRET_KEY` (`sk_…`) authenticates **us calling Stripe** (creating
the Checkout session). `STRIPE_WEBHOOK_SECRET` (`whsec_…`) verifies
**Stripe calling us** (payment completed). They are different credentials
for opposite directions. Here, the `whsec_` was pasted into
`STRIPE_SECRET_KEY` and the second variable never created — producing a
successful payment with **no bib and no email**. `/api/health` names this
exact fault now.

## Test and live are parallel worlds

Separate keys, separate webhook endpoints, separate signing secrets. A
live `whsec_` will not verify a test event: `constructEvent` throws, the
route 400s, the payment succeeds, nothing is recorded. Going live means a
second endpoint in live mode (same URL, `checkout.session.completed`,
payload style Snapshot) — not just swapping the API key.

## Invariants

- Event ids claimed in `stripe_events` inside the transaction (redelivery
  is a no-op; mid-flight failure rolls back for retry).
- The browser never names a price; sizes validated; quantity capped.
- Checkout page content is split-brained by design: this repo controls
  the line items and custom text; the Stripe Dashboard controls branding,
  business name, and which wallets appear.
