# Resend

Domain `gadaglobalrun.com` verified (DKIM, SPF, MX feedback all green) —
sends come from `info@gadaglobalrun.com`. **Resend only sends**; inbound
mail for `info@` is Cloudflare Email Routing → the gmail account. Exactly
one `v=spf1` record on the apex; Resend's records live on
`send.gadaglobalrun.com`, so there is no SPF conflict — check before
adding any mail-related DNS.

Email failure must never fail the Stripe webhook (Stripe would retry and
re-process the payment). Sends happen after commit; failures leave
`confirmation_sent_at` null, which is how unsent confirmations stay
findable.
