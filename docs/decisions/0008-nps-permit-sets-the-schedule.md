# 0008 — The NPS permit sets race-day times

**Status:** accepted (2026-09, organizers)
**Supersedes:** the 9:00 AM start, the 8:15 opening ceremony and the
10:45–noon community gathering.
**Source:** the Event Safety Plan filed with the NPS for October 3, 2026.

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

Race day follows the **Event Safety Plan** the organizers filed with the
National Park Service (2026-10). An earlier draft of this ADR used a 7:45
start with three waves five minutes apart; the safety plan replaced it before
merge, and the site matches the plan because the plan is what the Park Service
holds.

```
6:00   Pre-race preparation; volunteer briefing   (earliest permitted)
7:00   Packet pickup — bibs and T-shirts
7:30   Opening ceremony                            (site only; not in the plan)
8:00   Kids 1K
8:30   5K — elite race and fun run
9:30   All races complete; road reopened           (hard deadline)
9:30   Awards; post-race events begin
10:30  Post-race events conclude
11:00  Field clean; site clear
```

What this changes in the timing system, not just the copy:

- **Wave order is kids → elite → open.** The Kids 1K goes first, on a clear
  course.
- **The Kids 1K is a separate race.** `WAVE_META` carries a `distance`;
  `computeResults` ranks and paces each distance on its own, and the
  leaderboard and runner recap name the race. Without this a child's 1K time
  would have placed first on the 5K board.
- **The 5K has a 60-minute limit.** 8:30 to the 9:30 road reopening is about
  19:20 per mile. The FAQ no longer says there is no minimum pace.
- Each wave carries its own `startTime`, printed on the bib and in the
  confirmation email, so a Kids 1K runner is not told 8:30.

### Open: the 8:30 5K start and the permit's 8:00 condition

The permit conditions read "race must start no later than 8:00 AM". The safety
plan starts the Kids 1K at 8:00 and the 5K at 8:30. If the NPS reads the 8:00
condition as the first start of the morning, the plan satisfies it; if it
applies to every race, the 5K is half an hour late. **The organizers must
confirm this with the permit contact** — it is not something the site can
settle.

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
  day, not to a time of day, so the start times do not affect it.
- The brochure and letterhead carry the new times.

Permit contact: Michael Brockmeier, michael_brockmeier@nps.gov, (703) 202-8513.
