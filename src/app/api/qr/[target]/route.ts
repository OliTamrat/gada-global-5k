import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

/**
 * QR codes for print and social use.
 *
 * Targets are allowlisted rather than taking a URL parameter. An endpoint on
 * this domain that encodes any arbitrary URL is a phishing tool — a poster QR
 * that appears to come from the race but resolves elsewhere. Only paths on our
 * own site can be encoded.
 */
const TARGETS: Record<string, { path: string; label: string }> = {
  home: { path: "/", label: "Gada Global 5K" },
  register: { path: "/register", label: "Register" },
  results: { path: "/race", label: "Live Results" },
  shop: { path: "/shop", label: "Shop" },
  links: { path: "/links", label: "All Links" },
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.gadaglobalrun.com"
  ).replace(/\/$/, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const { target } = await params;
  const entry = TARGETS[target];

  if (!entry) {
    return NextResponse.json(
      { error: `Unknown QR target. Valid: ${Object.keys(TARGETS).join(", ")}` },
      { status: 404 }
    );
  }

  // Clamped so a huge value cannot be used to burn CPU.
  const requested = Number(req.nextUrl.searchParams.get("size") ?? 1024);
  const size = Math.min(Math.max(Number.isFinite(requested) ? requested : 1024, 128), 2048);

  const png = await QRCode.toBuffer(`${siteUrl()}${entry.path}`, {
    type: "png",
    width: size,
    margin: 2,
    // Level H tolerates roughly 30% damage, which matters for a code that will
    // be printed on a flyer, folded, and scanned in daylight.
    errorCorrectionLevel: "H",
    color: { dark: "#141210", light: "#FFFFFF" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="gada-global-5k-${target}-qr.png"`,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
