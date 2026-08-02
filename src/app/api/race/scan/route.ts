import { NextRequest, NextResponse } from "next/server";
import { recordScan } from "@/lib/race";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { bib, type, volunteerId } = await req.json();

    if (!bib || !type || !["start", "finish"].includes(type)) {
      return NextResponse.json(
        { error: "Missing bib or type (start/finish)" },
        { status: 400 }
      );
    }

    const result = await recordScan(
      Number(bib),
      type,
      volunteerId || "vol-" + Math.random().toString(36).slice(2, 6)
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Bib #${bib} ${type} recorded`,
      consensus: result.consensus,
      entry: result.entry,
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
