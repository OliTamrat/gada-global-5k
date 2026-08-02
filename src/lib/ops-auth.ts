import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Shared passcode for race-day operations and organizer data.
 *
 * These routes change results or expose registrant details, and race-day URLs
 * end up on volunteers' phones and in group chats. Sending a wave in particular
 * cannot be undone — the idempotency that stops a volunteer double-tap from
 * resetting the clock also means an early send is permanent.
 *
 * One shared passcode is the right weight here: a dozen volunteers on their own
 * phones for one morning, no accounts to provision, no password resets at 6am.
 */
export const OPS_HEADER = "x-race-ops";

/**
 * Compares as fixed-length digests. Hashing first means the comparison never
 * depends on the secret's length, and timingSafeEqual requires equal lengths
 * anyway.
 */
function matches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export function isOpsConfigured(): boolean {
  return Boolean(process.env.RACE_OPS_PASSCODE);
}

/**
 * Returns a 401 response when the request is not authorised, or null when it
 * may proceed.
 *
 * Fails closed when RACE_OPS_PASSCODE is unset. An unset secret is a
 * deployment mistake, and locking the ops screens out is recoverable in the
 * minute it takes to set the variable — a wave started by a stranger is not.
 * /api/health reports whether it is configured so this cannot go unnoticed.
 */
export function requireOps(req: Request): NextResponse | null {
  const expected = process.env.RACE_OPS_PASSCODE;

  if (!expected) {
    return NextResponse.json(
      {
        error:
          "Race operations are locked: RACE_OPS_PASSCODE is not set on this deployment.",
      },
      { status: 503 }
    );
  }

  const provided = req.headers.get(OPS_HEADER);
  if (!provided || !matches(provided, expected)) {
    return NextResponse.json(
      { error: "Wrong or missing race operations passcode." },
      { status: 401 }
    );
  }

  return null;
}
