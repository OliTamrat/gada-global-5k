import { NextResponse } from "next/server";
import { getRaceEntries, computeResults, seedDemoData } from "@/lib/race";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  if (searchParams.get("seed") === "true") {
    seedDemoData();
  }

  const entries = getRaceEntries();
  const results = computeResults(entries);
  return NextResponse.json({ results, total: entries.length });
}
