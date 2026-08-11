# ADR-0003 — The ops passcode fails closed; public reads stay open

**Status:** accepted · **Date:** 2026-07

## Context
Race screens change results and show registrant data; results pages are
for everyone.

## Decision
`RACE_OPS_PASSCODE` gates every mutating/registrant screen, enforced
server-side via an `x-race-ops` header; with the variable unset those
routes return 503. An unset secret is a one-minute deploy fix; a wave sent
by a stranger cannot be undone. `GET /api/race` and runner pages stay
unauthenticated.

## References
`/api/health` reports whether it is configured.
