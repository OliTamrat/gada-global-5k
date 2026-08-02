import { NextResponse } from "next/server";
import { getRaceEntries, computeResults, seedDemoData } from "@/lib/race";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    if (searchParams.get("seed") === "true") {
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
