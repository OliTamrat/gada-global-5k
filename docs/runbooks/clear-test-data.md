# Clearing test data

The exact SQL block (single transaction, bib_seq restart at 101, and the
verification queries) is maintained in the repo CLAUDE.md "Still open"
section — run it in the Neon SQL editor **before real registrations
exist, never after**. It wipes every row; the `wave_starts` row matters
more than it looks (see `runbooks/race-day.md`). Confirm afterwards: all
counts zero, `bib_seq.last_value` = 101 with `is_called` false.
