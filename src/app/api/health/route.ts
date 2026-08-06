import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { isOpsConfigured } from "@/lib/ops-auth";
import { isRaceDay, isOverridden, RACE_DAY_ISO } from "@/lib/race-window";

export const dynamic = "force-dynamic";

/**
 * Deployment readiness check.
 *
 * Every remaining launch step is environment configuration set by hand in a
 * dashboard, where a typo is invisible until a runner pays and nothing happens.
 * This reports what the running deployment can actually see.
 *
 * It never returns a secret — only whether one is present, and for the Stripe
 * key which mode it belongs to, since mixing test and live keys with a
 * mismatched webhook secret is the easiest way to lose a payment.
 */

const REQUIRED_TABLES = [
  "registrations",
  "race_entries",
  "scan_logs",
  "disputes",
  "merch_orders",
  "stripe_events",
];

type Status = "ok" | "warn" | "fail";

interface Check {
  status: Status;
  detail: string;
}

/**
 * Postgres errors can quote the connection string, which carries the password.
 * Strip anything URI-shaped before it reaches the response.
 */
function safeError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  return message
    .replace(/postgres(ql)?:\/\/\S+/gi, "[connection string redacted]")
    .slice(0, 200);
}

function stripeMode(key: string | undefined): "live" | "test" | null {
  if (!key) return null;
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("sk_test_")) return "test";
  return null;
}

/**
 * Says what is wrong with the value, so a mis-paste is one glance to diagnose
 * instead of a guessing game. Returns null when the key is well formed.
 *
 * Shape is checked BEFORE the sk_test_/sk_live_ prefix, because a masked copy
 * ("sk_test_...51Tzo") carries a valid prefix and would otherwise be reported
 * as healthy while failing every real call to Stripe.
 *
 * Key prefixes are not secret — Stripe documents them, and pk_ keys are public
 * by design — so naming the type leaks nothing. The raw value is never echoed.
 */
function stripeKeyProblem(key: string): string | null {
  if (key !== key.trim()) {
    return "the value has leading or trailing whitespace — re-paste it with no surrounding spaces or newline";
  }
  if (key.includes("...") || key.includes("…")) {
    return "the value contains an ellipsis, so a masked preview was copied rather than the revealed key — click Reveal, then the copy button";
  }
  if (key.startsWith("pk_")) {
    return "that is a publishable key (pk_), not a secret key — the secret key is the row below it on the API keys page";
  }
  if (key.startsWith("rk_")) {
    return "that is a restricted key (rk_) — use the standard secret key instead";
  }
  if (key.startsWith("whsec_")) {
    return "that is a webhook signing secret (whsec_) — it belongs in STRIPE_WEBHOOK_SECRET, not here";
  }
  if (!/^sk_(test|live)_[A-Za-z0-9]+$/.test(key)) {
    return `unrecognized format (${key.length} characters) — expected sk_test_ or sk_live_ followed by letters and digits only`;
  }
  return null;
}

async function checkDatabase(): Promise<Check> {
  if (!isDatabaseConfigured()) {
    return { status: "fail", detail: "DATABASE_URL is not set" };
  }

  try {
    // to_regclass resolves against the connection's search_path, so this stays
    // correct if the schema is ever moved out of public.
    const rows = await query<{ name: string; present: boolean }>(
      `select t.name, to_regclass(t.name) is not null as present
         from unnest($1::text[]) as t(name)`,
      [REQUIRED_TABLES]
    );
    const missing = rows.filter((r) => !r.present).map((r) => r.name);

    if (missing.length > 0) {
      return {
        status: "fail",
        detail: `connected, but missing table(s): ${missing.join(", ")} — run npm run db:setup`,
      };
    }

    // The webhook cannot assign a bib without this sequence.
    const [seq] = await query<{ exists: boolean }>(
      `select exists (
         select 1 from pg_class
         where relkind = 'S' and relname = 'bib_seq'
       ) as exists`
    );
    if (!seq?.exists) {
      return {
        status: "fail",
        detail: "connected, all tables present, but sequence bib_seq is missing",
      };
    }

    return { status: "ok", detail: "connected, all 6 tables and bib_seq present" };
  } catch (err) {
    return { status: "fail", detail: `connection failed: ${safeError(err)}` };
  }
}

function checkStripe(): Check {
  const key = process.env.STRIPE_SECRET_KEY;
  const hasWebhookSecret = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

  if (!key) {
    return { status: "fail", detail: "STRIPE_SECRET_KEY is not set" };
  }

  const problem = stripeKeyProblem(key);
  if (problem) {
    // Report the webhook secret too — otherwise this failure masks whether the
    // next variable along is also missing, costing an extra redeploy to find out.
    return {
      status: "fail",
      detail: `STRIPE_SECRET_KEY is set but unusable: ${problem}. (STRIPE_WEBHOOK_SECRET is ${
        hasWebhookSecret ? "set" : "NOT set"
      }.)`,
    };
  }

  const mode = stripeMode(key);
  if (!hasWebhookSecret) {
    return {
      status: "fail",
      detail: `${mode} mode key present, but STRIPE_WEBHOOK_SECRET is not set — payments will succeed and no bib or email will follow`,
    };
  }
  return {
    status: mode === "live" ? "ok" : "warn",
    detail:
      mode === "live"
        ? "live mode key and webhook secret present"
        : "test mode key and webhook secret present — safe for testing, swap to sk_live_ and a live-mode webhook secret to take real registrations",
  };
}

function checkEmail(): Check {
  // RESEND_API is accepted because it was set under that name first.
  const hasKey = Boolean(process.env.RESEND_API_KEY || process.env.RESEND_API);
  const from = process.env.REGISTRATION_FROM_EMAIL;

  if (!hasKey) {
    return {
      status: "fail",
      detail: "RESEND_API_KEY is not set — registrations will be recorded but no confirmation will send",
    };
  }
  if (!from) {
    return {
      status: "warn",
      detail: "API key present, but REGISTRATION_FROM_EMAIL is not set — falling back to the built-in default",
    };
  }
  return { status: "ok", detail: `API key present, sending as ${from}` };
}

function checkRaceOps(): Check {
  // Not required to sell a registration, so this warns rather than fails —
  // but the race-day screens refuse to work without it.
  if (!isOpsConfigured()) {
    return {
      status: "warn",
      detail:
        "RACE_OPS_PASSCODE is not set — the start line, finish scanner, and organizer dashboard will refuse to open",
    };
  }
  return { status: "ok", detail: "volunteer passcode set" };
}

function checkRaceClock(): Check {
  if (isOverridden()) {
    return {
      status: "warn",
      detail:
        `RACE_TIMING_UNLOCKED=true — waves and finish scans are live outside race day. ` +
        `Clear the timing data and unset this after rehearsing.`,
    };
  }
  if (isRaceDay()) {
    return { status: "ok", detail: `race day (${RACE_DAY_ISO}) — timing is open` };
  }
  return {
    status: "ok",
    detail: `locked until ${RACE_DAY_ISO} — waves and finish scans return 423`,
  };
}

function checkSiteUrl(): Check {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    return {
      status: "warn",
      detail: "NEXT_PUBLIC_SITE_URL is not set — email links fall back to https://www.gadaglobalrun.com",
    };
  }
  return { status: "ok", detail: url };
}

export async function GET() {
  const checks: Record<string, Check> = {
    database: await checkDatabase(),
    stripe: checkStripe(),
    email: checkEmail(),
    raceOps: checkRaceOps(),
    raceClock: checkRaceClock(),
    siteUrl: checkSiteUrl(),
  };

  const values = Object.values(checks);
  const ready = values.every((c) => c.status !== "fail");

  return NextResponse.json(
    {
      ready,
      summary: ready
        ? "All required configuration is present."
        : `Not ready: ${values.filter((c) => c.status === "fail").length} check(s) failing.`,
      checks,
      // Environment variable changes only take effect on a new build, so the
      // commonest false alarm is reading a stale deployment. This identifies
      // which build answered. The commit sha is public (the repo is), and
      // these are populated only when Vercel's system environment variables
      // are enabled for the project.
      deployment: {
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "unknown",
        environment: process.env.VERCEL_ENV ?? "unknown",
      },
    },
    {
      // 503 so an uptime monitor treats a half-configured deployment as down.
      status: ready ? 200 : 503,
      // Without this a browser can keep showing a pre-fix answer.
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}
