# Race day

- **Before the day:** `select * from wave_starts;` must return zero rows.
  Sending a wave is idempotent by design, so a leftover rehearsal row
  means the starter taps "send", gets a silent success, and every runner
  in that wave is timed from weeks ago.
- **Start:** one volunteer at `/race/start`, two taps to send each wave
  (elite → open → kids, minutes apart).
- **Finish:** the bottleneck is real — expect 40–60 finishers inside a
  two-minute window. Single-file chute, 3–4 volunteers scanning in
  parallel (`recordScan` supports multiple volunteers per bib and raises
  confidence when they agree), plus one person writing bib numbers on
  paper as fallback.
- A finisher with no start time inherits their wave's start; "Late Start"
  on `/race/scan` is a per-runner override, not how the race starts.
- Every ops screen needs `RACE_OPS_PASSCODE`, entered once per device.
