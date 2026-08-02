import { NextRequest, NextResponse } from "next/server";
import { requireOps } from "@/lib/ops-auth";
import { getDisputes, createDispute, resolveDispute } from "@/lib/race";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  try {
    return NextResponse.json({ disputes: await getDisputes() });
  } catch (error) {
    console.error("Dispute load error:", error);
    return NextResponse.json({ error: "Failed to load disputes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const { bib, reason, evidence } = body;
      if (!bib || !reason) {
        return NextResponse.json({ error: "Missing bib or reason" }, { status: 400 });
      }
      const result = await createDispute({ bib: Number(bib), reason, evidence });
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, dispute: result.dispute });
    }

    if (action === "resolve") {
      const { disputeId, status, resolution, adjustedMs } = body;
      if (!disputeId || !status || !resolution) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      const result = await resolveDispute(disputeId, status, resolution, adjustedMs);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Dispute error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
