import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireOps } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

interface RegistrationRow {
  bib: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  age: number;
  gender: string;
  wave: string;
  tier_name: string;
  amount_cents: number;
  tshirt_size: string | null;
  emergency_contact: string | null;
  payment_status: string;
  created_at: string;
}

function toCsv(rows: RegistrationRow[]): string {
  const headers = [
    "bib", "first_name", "last_name", "email", "phone", "age", "gender",
    "wave", "tier", "amount_usd", "tshirt_size", "emergency_contact",
    "payment_status", "registered_at",
  ];

  // A leading =, +, - or @ makes a spreadsheet treat the value as a formula.
  // Prefixing with an apostrophe keeps the text intact and inert.
  const cell = (v: unknown): string => {
    const s = v === null || v === undefined ? "" : String(v);
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push([
      r.bib ?? "", r.first_name, r.last_name, r.email, r.phone ?? "",
      r.age, r.gender, r.wave, r.tier_name, (r.amount_cents / 100).toFixed(2),
      r.tshirt_size ?? "", r.emergency_contact ?? "", r.payment_status,
      // ISO rather than the default Date.toString, which spreadsheets will not
      // parse as a date.
      new Date(r.created_at).toISOString(),
    ].map(cell).join(","));
  }
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const denied = requireOps(req);
  if (denied) return denied;

  try {
    const rows = await query<RegistrationRow>(
      `select bib, first_name, last_name, email, phone, age, gender, wave,
              tier_name, amount_cents, tshirt_size, emergency_contact,
              payment_status, created_at
         from registrations
        order by created_at desc`
    );

    const paid = rows.filter((r) => r.payment_status === "paid");

    if (req.nextUrl.searchParams.get("format") === "csv") {
      // Paid only — pending rows are abandoned checkouts, not registrations.
      return new NextResponse(toCsv(paid), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="gada-global-5k-registrations.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const tally = (key: (r: RegistrationRow) => string) => {
      const out: Record<string, number> = {};
      for (const r of paid) out[key(r)] = (out[key(r)] ?? 0) + 1;
      return out;
    };

    return NextResponse.json(
      {
        totals: {
          paid: paid.length,
          pending: rows.length - paid.length,
          revenueCents: paid.reduce((sum, r) => sum + r.amount_cents, 0),
        },
        byWave: tally((r) => r.wave),
        byTier: tally((r) => r.tier_name),
        byShirt: tally((r) => r.tshirt_size ?? "unspecified"),
        recent: paid.slice(0, 25).map((r) => ({
          bib: r.bib,
          name: `${r.first_name} ${r.last_name}`,
          email: r.email,
          wave: r.wave,
          tier: r.tier_name,
          amountCents: r.amount_cents,
          shirt: r.tshirt_size,
          registeredAt: r.created_at,
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Organizer dashboard error:", error);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }
}
