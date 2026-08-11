# ADR-0002 — Sending a wave is idempotent

**Status:** accepted · **Date:** 2026-07

## Context
A second tap on "send wave" that reset the clock would corrupt the times
of every runner already on the course — undetectably, mid-race.

## Decision
`wave_starts`' primary key makes the second send return the original
timestamp. The UI also requires two taps.

## Consequences
The safety cuts both ways: a leftover **rehearsal** row means race-morning
sends silently no-op onto a weeks-old clock. Hence the race-day rule that
`wave_starts` must be verified empty beforehand.

## References
`runbooks/race-day.md`, `runbooks/clear-test-data.md`.
