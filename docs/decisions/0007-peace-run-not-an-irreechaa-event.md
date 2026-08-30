# 0007 — The event is the Gada Global 5K Peace Run, and is not an Irreechaa event

**Status:** accepted (2026-08, organizers)
**Supersedes:** the "Gada Global 5K — Irrecha Celebration Run" naming and the
cultural-celebration framing that came with it.

## Decision

The brand is **Gada Global**; the event is the **5K Peace Run**. They lock up
with a rule between them — **Gada Global | 5K Peace Run** — which is the form
the wordmark, page titles and share cards use. The pipe is a lockup device, so
it never appears mid-sentence: prose says "the Gada Global 5K Peace Run".

Both halves, the lockup and the prose name are fields on `EVENT` (`brand`,
`eventName`, `lockup`, `name`), and `scripts/docs-truth.mjs` requires the README,
the briefing and the overview to use one of the two legitimate forms.

The public copy describes a professionally produced road race open to every
community, not a cultural or religious celebration.

Concretely:

- The name drops "5K" as an identifier. The distance is still 5K and is still
  stated everywhere it matters — it is a fact about the race, not its name.
- Nothing in the runner-facing copy asks anyone to celebrate Irreechaa, and
  the festival is not named on the site.
- The post-race programme is described as a **post-race festival** rather than
  an Irreechaa cultural festival.
- The FAQ answers the question directly — "Is this a cultural or religious
  event?" — rather than leaving a reader to infer it.

## Why

Two reasons, both from the organizers.

**It read as a community group, not a company.** Gada Global Inc. is a
registered entity that produces timed road races. Copy that led with heritage
and celebration undersold the operating standard — permitted course, staffed
race-day operations, published results, a written report to partners — which is
what a sponsor is actually buying.

**Naming the race for Irreechaa excluded the people it most wanted to invite.**
The race is held on the Irreechaa weekend and will stay there. But naming an
event for a festival makes it that festival's event, and someone who does not
celebrate it reads the name as an answer to whether they are expected. The
purpose was always a race open to everyone; the name now says so.

## What was deliberately kept

The company still explains where its **own name** comes from, on `/about`: the
Gadaa system, a governance tradition recognised by UNESCO and built on
consensus, accountability and the peaceful handover of authority. That is the
origin of "Gada" and the reason "Peace Run" is the right name rather than a
bland one. A company accounting for its name is not asking anyone to celebrate
anything.

The athlete profiles on `/about` also stay. They are biography, and the
section is framed around distance running rather than heritage.

## Consequences

- **`src/lib/event.ts` is the single source** for the event's name and public
  details. It previously lived in `src/lib/email.ts`, which meant six page
  components imported their name from an email module and a rename touched 39
  string literals across 18 files. `scripts/docs-truth.mjs` now fails if the
  README or `.claude/CLAUDE.md` names an event that `event.ts` does not.
- **Physical goods may carry the old name or Irreechaa artwork.** Medals,
  shirts and printed material already ordered are not changed by this decision
  and need checking against their proofs before anything is reprinted.
- **The sponsor proposal documents are untouched** — `GADA_GLOBAL_5K_BUSINESS_PROPOSAL.md`,
  `public/proposal.html` and `proposal/index.html` still carry the old name,
  the old venue and a 7:30 AM start. They may already be with sponsors, and
  rewriting a document someone is holding is worse than a document that is
  visibly of its date. Reissue them deliberately, or not at all.
- The domain `gadaglobalrun.com` is unaffected: it never carried the distance
  or the festival.
