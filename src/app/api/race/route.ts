import { NextResponse } from "next/server";
import { requireOps } from "@/lib/ops-auth";
import { getRaceEntries, computeResults, seedDemoData } from "@/lib/race";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    // Reading results is public. Seeding wipes and replaces the timing data,
    // so it is an operations action and needs the passcode.
    if (searchParams.get("seed") === "true") {
      const denied = requireOps(req);
      if (denied) return denied;
      await seedDemoData();
    }

    const entries = await getRaceEntries();
    const results = computeResults(entries);
    return NextResponse.json({ results, total: entries.length });
  } catch (error) {
    console.error("Race results error:", error);
    return NextResponse.json(
      { error: "Failed to load race results" },
      { status: 500 }
    );
  }
}
