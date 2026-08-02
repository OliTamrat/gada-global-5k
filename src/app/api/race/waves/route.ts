import { NextRequest, NextResponse } from "next/server";
import { startWave, getWaveStatuses } from "@/lib/race";
import { isWave } from "@/lib/waves";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ waves: await getWaveStatuses() });
  } catch (error) {
    console.error("Wave status error:", error);
    return NextResponse.json({ error: "Failed to load waves" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
