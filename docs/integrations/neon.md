# Neon Postgres

Six tables plus `bib_seq` (starts at 101, clear of the demo range).
`npm run db:setup` is idempotent; `schema.sql` also applies to a local
Postgres 16, which **is** installed in the agent sandbox — DB code can be
integration-tested for real there (`initdb` refuses root: `su postgres`,
PGDATA somewhere traversable like /tmp).

- `pg` returns int8 as strings — `src/lib/db.ts` installs the Number
  parser; don't bypass it.
- jsonb parameters must be `JSON.stringify`'d — a raw JS array becomes a
  Postgres array literal, which jsonb rejects.
- Neon (TCP 5432) is unreachable from the agent sandbox — anything
  touching the real DB is verified by a person or via `/api/health`.
