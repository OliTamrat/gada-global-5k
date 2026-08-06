import { NextRequest, NextResponse } from "next/server";
import { requireOps } from "@/lib/ops-auth";
<<<<<<< HEAD
import { requireRaceDay } from "@/lib/race-window";
=======
import { requireRaceDay, isTimingUnlocked, RACE_DAY_ISO } from "@/lib/race-window";
>>>>>>> origin/claude/gada-global-5k-status-35dp69
import { startWave, getWaveStatuses } from "@/lib/race";
import { isWave } from "@/lib/waves";

export const dynamic = "force-dynamic";

// Guarded as well as POST. Wave status is operational data, and this is also
// the endpoint OpsGate checks a passcode against — leaving it open meant any
// passcode appeared to be accepted, and the volunteer only found out when the
// first real action failed.
export async function GET(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  try {
    // The lock state rides along so the start screen can say so up front,
    // rather than a volunteer discovering it on the tap that matters.
    return NextResponse.json({
      waves: await getWaveStatuses(),
      locked: !isTimingUnlocked(),
      raceDay: RACE_DAY_ISO,
    });
  } catch (error) {
    console.error("Wave status error:", error);
    return NextResponse.json({ error: "Failed to load waves" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  // Sending a wave is the one irreversible action here, and a stray wave row
  // silently starts the clock on everyone who registers into it afterwards.
  const locked = requireRaceDay();
  if (locked) return locked;

  try {
    const { wave, volunteerId } = await req.json();

    if (!isWave(wave)) {
      return NextResponse.json(
        { error: "Unknown wave. Expected elite, open, or kids." },
        { status: 400 }
      );
    }

    const result = await startWave(wave, volunteerId || "starter");

    return NextResponse.json({
      success: true,
      wave,
      startedAt: result.startedAt,
      alreadyStarted: result.alreadyStarted,
      message: result.alreadyStarted
        ? `That wave was already sent — its clock is unchanged.`
        : `Wave sent. Every runner in it is now on the clock.`,
    });
  } catch (error) {
    console.error("Wave start error:", error);
    return NextResponse.json({ error: "Failed to start wave" }, { status: 500 });
  }
}
