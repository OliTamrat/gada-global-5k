# ADR-0001 — Wave starts, not start-line scanning

**Status:** accepted · **Date:** 2026-07

## Context
Scanning ~500 runners individually at a start line takes ~25 minutes and
puts fast runners, walkers and children into one moving crowd.

## Decision
Three waves (elite → open → kids, `src/lib/waves.ts`), each started by one
volunteer tap at `/race/start` that backfills `start_time` for the wave.
Wave is chosen at registration, printed as a coloured band on the bib, and
named in the confirmation email. Timing is gun-time per wave — elite goes
first in a small wave so prize places are decided on seconds of spread.

## Consequences
True net time needs chip timing — out of scope. Finish scans inherit the
wave start when missing, so a volunteer can never strand a finisher.

## References
`src/lib/waves.ts`, `runbooks/race-day.md`.
