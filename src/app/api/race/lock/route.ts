import { NextRequest, NextResponse } from "next/server";
import { requireOps } from "@/lib/ops-auth";
import { isTimingUnlocked, RACE_DAY_ISO } from "@/lib/race-window";

export const dynamic = "force-dynamic";

/**
 * Whether the race clock is open, for the ops screens to say so up front.
 *
 * Deliberately touches no database: this rode on the wave-status endpoint
 * first, which meant a database hiccup silently hid the lock banner and the
 * screen looked wide open. The enforcement never depended on the banner, but a
 * volunteer reading the screen did.
 */
export async function GET(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  return NextResponse.json({
    locked: !isTimingUnlocked(),
    raceDay: RACE_DAY_ISO,
  });
}
