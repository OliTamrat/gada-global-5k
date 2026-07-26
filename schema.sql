-- Gada Global 5K — Postgres schema
-- Provider-agnostic: works on Neon, Vercel Postgres, Supabase, or any Postgres 13+.
-- Apply with: npm run db:setup

create extension if not exists pgcrypto;

-- Bib numbers for paid registrations start at 101 so they never collide
-- with the 1-12 range used by seeded demo runners.
create sequence if not exists bib_seq start 101;

-- ── Registrations ────────────────────────────────────────────────────────────
create table if not exists registrations (
  id                   uuid primary key default gen_random_uuid(),
  bib                  integer unique,
  first_name           text not null,
  last_name            text not null,
  email                text not null,
  phone                text,
  age                  integer not null,
  gender               text not null,
  tshirt_size          text,
  tier_id              text not null,
  tier_name            text not null,
  amount_cents         integer not null,
  emergency_contact    text,
  payment_status       text not null default 'pending'
                         check (payment_status in ('pending', 'paid', 'refunded')),
  stripe_session_id    text unique,
  confirmation_sent_at timestamptz,
  paid_at              timestamptz,
  created_at           timestamptz not null default now()
);

create index if not exists registrations_email_idx on registrations (email);
create index if not exists registrations_status_idx on registrations (payment_status);

-- ── Race entries (timing) ────────────────────────────────────────────────────
-- start_time / finish_time are epoch milliseconds, matching the client types.
create table if not exists race_entries (
  bib               integer primary key,
  first_name        text not null,
  last_name         text not null,
  age               integer not null,
  gender            text not null,
  start_time        bigint,
  finish_time       bigint,
  timing_confidence text check (timing_confidence in ('high', 'medium', 'low')),
  created_at        timestamptz not null default now()
);

-- ── Scan logs (multi-volunteer consensus timing) ─────────────────────────────
create table if not exists scan_logs (
  id           bigserial primary key,
  bib          integer not null references race_entries (bib) on delete cascade,
  type         text not null check (type in ('start', 'finish')),
  volunteer_id text not null,
  timestamp_ms bigint not null,
  created_at   timestamptz not null default now(),
  -- One scan per volunteer per bib per type. This is what makes the
  -- "volunteer already scanned this bib" rule race-safe under concurrency.
  unique (bib, type, volunteer_id)
);

create index if not exists scan_logs_bib_idx on scan_logs (bib);

-- ── Disputes ─────────────────────────────────────────────────────────────────
create table if not exists disputes (
  id            text primary key,
  bib           integer not null references race_entries (bib) on delete cascade,
  runner_name   text not null,
  reason        text not null,
  submitted_at  bigint not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'accepted', 'rejected')),
  resolution    text,
  resolved_at   bigint,
  original_time bigint,
  adjusted_time bigint,
  evidence      jsonb not null default '[]'::jsonb
);

-- At most one open dispute per bib, enforced by the database rather than
-- a read-then-write check that two concurrent requests could both pass.
create unique index if not exists disputes_one_pending_per_bib
  on disputes (bib) where status = 'pending';

-- ── Merchandise orders ───────────────────────────────────────────────────────
create table if not exists merch_orders (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  email             text,
  items             text not null,
  amount_cents      integer,
  created_at        timestamptz not null default now()
);

-- ── Stripe webhook idempotency ───────────────────────────────────────────────
-- Event ids are claimed before side effects so a redelivery cannot assign a
-- second bib or send a duplicate confirmation email.
create table if not exists stripe_events (
  id          text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);
