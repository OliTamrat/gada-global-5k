# 0008 — The NPS permit sets race-day times

**Status:** accepted (2026-09, organizers)
**Supersedes:** the 9:00 AM start, the 8:15 opening ceremony and the
10:45–noon community gathering.

## Context

Rock Creek Park issued the race permit conditions. Every race-day time the
site advertised broke at least one of them — the start was a full hour late,
the opening ceremony sat *after* the start deadline, and the programme ran two
hours past the site-clear time.

| Condition | Value |
|---|---|
| Race must start | no later than **8:00 AM** |
| All racers off the road, road reopened | **9:30 AM** |
| All post-race activity complete | **10:30 AM** |
| Equipment out, site clean and clear | **11:00 AM** |
| Setup may begin | no earlier than **6:00 AM** |
| Season | Labor Day through Memorial Day |
| Races per weekend | one |

The date survives: Labor Day 2026 was September 7, so October 3 is inside the
permitted season.

## Decision

```
6:00   Setup begins            (earliest permitted)
6:30   Packet pickup and check-in
7:30   Opening ceremony
7:45   Wave 1 — elite
7:50   Wave 2 — open
7:55   Wave 3 — kids & family   ← every wave away before the 8:00 cap
9:00   Course closes
9:15   Awards
9:30   Road cleared and reopened (hard deadline)
9:45   Community gathering
10:00  Site clear               (permit allows 11:00 — this is slack)
```

Two things make this hold rather than merely look compliant:

- **Five-minute wave spacing puts the *last* wave away before the cap**, not
  just the first. A single 8:00 start with waves trailing after it would breach
  the condition on the second and third waves.
- **A 20-minute-per-mile walker starting at 7:55 finishes about 8:57**, so the
  9:00 course close has real margin against the 9:30 road reopening rather than
  assuming everyone runs.

`src/lib/event.ts` holds these times and carries the reason in a comment;
`docs-truth` keeps the briefing in step.

## Scope of this decision

**This ADR changed times and nothing else.** The permit carries conditions that
are not about the clock, and the organizers' decision (2026-09) is that they are
handled operationally on the day rather than reflected in site copy:

- **No distribution of prizes on park grounds**; the form caps prizes at "under
  $5 in value, such as ribbons or medals". The site still advertises the $1,200
  purse as it did.
- **No advertising or sales of any kind on park grounds**, with sponsor
  visibility limited to name or logo on the event banner at no more than a third
  of the event-name lettering. The sponsor offer, including exhibitor space at
  Gold and Platinum, is unchanged on the site.
- **No money collected on site** — registration in advance, sign-in and packet
  pickup only.

They are recorded here so nobody has to re-read the permit to find them, and so
a future session does not mistake the silence in the copy for their absence.

## Consequences

- **Costs the permit imposes:** a US Park Police officer at $92–100/hr with a
  **five-hour minimum** (~$460–500, billed after the permit issues); $1M per
  incident / $3M aggregate liability insurance naming the National Park Service
  as additional insured; Picnic Grove 24 at $65 via recreation.gov if used.
- **Staffing and kit:** at least four marshals in clearly marked shirts or
  armbands, first aid kits, a communications plan, traffic cones for the
  parking lot, and a declared generator — there is no electricity on site.
- `src/lib/race-window.ts` needs no change: it locks timing to the calendar
  day, not to a time of day, so the earlier start does not affect it.
- The brochure and letterhead carry the new times.

Permit contact: Michael Brockmeier, michael_brockmeier@nps.gov, (703) 202-8513.
