# 0008 — The NPS permit sets the schedule, the prizes and the sponsor offer

**Status:** accepted (2026-09, organizers)
**Supersedes:** the 9:00 AM start, the 8:15 opening ceremony, the 10:45–noon
community gathering, and the exhibitor-space sponsor benefit.

## Context

Rock Creek Park issued the race permit conditions, and several of them
contradicted what the site had been advertising for months. They are
conditions of being allowed to hold the event at all, not preferences.

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

### The schedule

```
6:00   Setup begins            (earliest permitted)
6:30   Packet pickup and check-in
7:30   Welcome and course briefing
7:45   Wave 1 — elite
7:50   Wave 2 — open
7:55   Wave 3 — kids & family   ← every wave away before the 8:00 cap
9:00   Course closes, sweep complete
9:15   Awards
9:30   Road cleared and reopened (hard deadline)
10:00  Site clear               (permit allows 11:00 — this is slack)
```

Three waves at five-minute spacing means the **last** wave is away before the
cap, not just the first. A 20-minute-per-mile walker starting at 7:55 finishes
about 8:57, so a 9:00 course close is real rather than optimistic.

`src/lib/event.ts` holds these times; `docs-truth` keeps the briefing in step.

### The prize purse

The permit forbids **distribution** of prizes on park grounds, and the form
caps prizes at "under $5 in value, such as ribbons or medals".

The organizers' decision is to **keep the $1,200 purse advertised**, announce
winners at the awards ceremony, and have them **collect in person afterwards**
— nothing is handed over inside the park. Every surface naming the purse now
says so: the FAQ, `PrizePodium`, the schedule, the Stripe checkout text, and
both the runner and organizer emails.

**This reading is not yet confirmed in writing by the permit specialist.** The
condition is about distribution rather than about advertising a purse, which
is why the reading is defensible — but it is the specialist's call, and the
purse is printed on Stripe's checkout page and in confirmation emails, so the
confirmation should be in hand before race day.

### The sponsor offer

"No advertising or sales of any kind is permitted on park grounds," with
sponsor visibility limited to name or logo on the event banner at **no more
than one third** of the event-name lettering.

An exhibitor table therefore cannot be sold at any level. The `booth` benefit
becomes **logo in the runner packet** — which leaves the park with the field
rather than sitting on a table inside it — and the banner benefit states the
lettering rule and the real window (6:30 to 10:00, not "five hours through
noon"). No sponsor had signed on the old terms, so this was corrected before
anyone was quoted.

On-site merchandise sales are out for the same reason; the shop stays online.

## Consequences

- **Registration must be entirely in advance.** No money may be collected on
  site. Day-of entry is only possible if the runner pays online at the venue;
  sign-in and packet pickup are the only on-site desk functions.
- **Costs the permit imposes:** a US Park Police officer at $92–100/hr with a
  **five-hour minimum** (~$460–500, billed after the permit issues); $1M per
  incident / $3M aggregate liability insurance naming the National Park
  Service as additional insured; Picnic Grove 24 at $65 via recreation.gov if
  used.
- **Staffing and kit:** at least four marshals in clearly marked shirts or
  armbands, first aid kits, a communications plan, traffic cones to close the
  parking lot, and a declared generator — there is no electricity on site.
- **Food** distributed on site must be commercially prepackaged; fruit needs a
  non-edible skin.
- `src/lib/race-window.ts` needs no change: it locks timing to the calendar
  day, not to a time of day, so the earlier start does not affect it.
- The printed brochure and letterhead were regenerated from the new times.

Permit contact: Michael Brockmeier, michael_brockmeier@nps.gov, (703) 202-8513.
