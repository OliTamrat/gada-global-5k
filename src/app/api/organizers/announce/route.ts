import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireOps } from "@/lib/ops-auth";
import { EVENT } from "@/lib/event";
import {
  RACE_UPDATE_ID,
  buildRaceUpdateEmail,
  type RaceUpdateRecipient,
} from "@/lib/race-update-email";

export const dynamic = "force-dynamic";
// Resend allows a few requests a second, so a few hundred runners takes a
// couple of minutes. If the function is cut off anyway, pressing Send again
// resumes: anyone already emailed is skipped.
export const maxDuration = 300;

const RESEND_ENDPOINT = "https://api.resend.com/emails";
/** Stay under Resend's default rate limit. */
const SEND_GAP_MS = 600;
/** Leave headroom before maxDuration so the response still gets back. */
const TIME_BUDGET_MS = 270_000;

interface RecipientRow {
  id: string;
  first_name: string;
  email: string;
  bib: number;
  wave: string;
}

// Created on first use so sending needs no manual migration on race eve.
// Mirrored in schema.sql.
async function ensureLedger() {
  await query(
    `create table if not exists announcements_sent (
       announcement    text not null,
       registration_id uuid not null references registrations (id) on delete cascade,
       sent_at         timestamptz not null default now(),
       primary key (announcement, registration_id)
     )`
  );
}

async function recipients(): Promise<RecipientRow[]> {
  return query<RecipientRow>(
    `select id, first_name, email, bib, wave
       from registrations
      where payment_status = 'paid' and bib is not null
      order by bib`
  );
}

async function sendOne(d: RaceUpdateRecipient, idempotencyKey: string): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_API;
  if (!apiKey) return "RESEND_API_KEY is not set";
  const from = process.env.REGISTRATION_FROM_EMAIL || `${EVENT.name} <${EVENT.supportEmail}>`;
  const replyTo = process.env.REGISTRATION_REPLY_TO || EVENT.supportEmail;
  const { subject, html, text } = buildRaceUpdateEmail(d);

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Second guard behind the ledger: Resend drops a repeat of this key.
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({ from, to: [d.email], reply_to: replyTo, subject, html, text }),
    });
    if (!res.ok) return `Resend responded ${res.status}: ${(await res.text()).slice(0, 200)}`;
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Status: how many paid runners there are and how many have been emailed. */
export async function GET(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  try {
    await ensureLedger();
    const all = await recipients();
    const sent = await query<{ n: number }>(
      `select count(*)::int as n from announcements_sent where announcement = $1`,
      [RACE_UPDATE_ID]
    );
    const sample = all[0]
      ? buildRaceUpdateEmail({ firstName: all[0].first_name, email: all[0].email, bib: all[0].bib, wave: all[0].wave })
      : buildRaceUpdateEmail({ firstName: "Runner", email: "", bib: 101, wave: "open" });
    return NextResponse.json({
      announcement: RACE_UPDATE_ID,
      recipients: all.length,
      sent: sent[0]?.n ?? 0,
      preview: { subject: sample.subject, text: sample.text },
    });
  } catch (error) {
    console.error("Announcement status error:", error);
    return NextResponse.json({ error: "Could not load recipients." }, { status: 500 });
  }
}

/**
 * Body: { mode: "test", to: "you@example.com" }  — one email, using the first
 *       runner's details, to the given address. Not recorded.
 *       { mode: "send" } — every paid runner not yet emailed.
 */
export async function POST(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as { mode?: string; to?: string };

  try {
    await ensureLedger();
    const all = await recipients();

    if (body.mode === "test") {
      const to = (body.to ?? "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
        return NextResponse.json({ error: "Enter a valid email address for the test." }, { status: 400 });
      }
      const r = all[0];
      const error = await sendOne(
        { firstName: r?.first_name ?? "Runner", email: to, bib: r?.bib ?? 101, wave: r?.wave ?? "open" },
        `${RACE_UPDATE_ID}/test/${to}/${Date.now()}`
      );
      return error
        ? NextResponse.json({ error }, { status: 502 })
        : NextResponse.json({ test: true, to });
    }

    if (body.mode !== "send") {
      return NextResponse.json({ error: "Unknown mode." }, { status: 400 });
    }

    const started = Date.now();
    let sent = 0;
    let skipped = 0;
    const failed: Array<{ bib: number; error: string }> = [];

    for (const r of all) {
      if (Date.now() - started > TIME_BUDGET_MS) break;

      // Claim before sending, so two presses at once cannot both send.
      const claim = await query<{ registration_id: string }>(
        `insert into announcements_sent (announcement, registration_id)
         values ($1, $2) on conflict do nothing returning registration_id`,
        [RACE_UPDATE_ID, r.id]
      );
      if (claim.length === 0) {
        skipped++;
        continue;
      }

      const error = await sendOne(
        { firstName: r.first_name, email: r.email, bib: r.bib, wave: r.wave },
        `${RACE_UPDATE_ID}/${r.id}`
      );
      if (error) {
        // Release the claim so pressing Send again retries this runner.
        await query(
          `delete from announcements_sent where announcement = $1 and registration_id = $2`,
          [RACE_UPDATE_ID, r.id]
        );
        failed.push({ bib: r.bib, error });
      } else {
        sent++;
      }
      await sleep(SEND_GAP_MS);
    }

    const done = await query<{ n: number }>(
      `select count(*)::int as n from announcements_sent where announcement = $1`,
      [RACE_UPDATE_ID]
    );
    const total = done[0]?.n ?? 0;
    return NextResponse.json({
      sent,
      skipped,
      failed,
      totalSent: total,
      recipients: all.length,
      remaining: Math.max(all.length - total, 0),
    });
  } catch (error) {
    console.error("Announcement send error:", error);
    return NextResponse.json({ error: "Sending stopped on a server error. Press Send again to resume." }, { status: 500 });
  }
}
