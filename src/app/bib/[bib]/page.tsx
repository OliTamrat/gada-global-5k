import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRaceEntry } from "@/lib/race";
import { EVENT } from "@/lib/email";
import { PrintButton } from "@/components/PrintButton";

// Reads the database per request; nothing here can be prerendered.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Race Bib | Gada Global 5K",
  robots: { index: false, follow: false },
};

export default async function BibPage({
  params,
}: {
  params: Promise<{ bib: string }>;
}) {
  const { bib } = await params;
  const bibNumber = Number(bib);

  if (!Number.isInteger(bibNumber) || bibNumber <= 0) notFound();

  const entry = await getRaceEntry(bibNumber);
  if (!entry) notFound();

  const name = `${entry.firstName} ${entry.lastName}`.trim();

  return (
    <main className="bg-cream min-h-screen pt-28 pb-16 px-6 print:p-0 print:bg-white">
      <div className="max-w-[820px] mx-auto">
        {/* Screen-only chrome */}
        <div className="print:hidden mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold tracking-tight mb-3">
            Race Bib — #{entry.bib}
          </h1>
          <p className="text-[15px] leading-[1.8] text-charcoal/70 max-w-[560px] mb-6">
            Print this on plain paper, trim the outer edge, and pin it through the
            four corners. Print at 100% scale — &ldquo;fit to page&rdquo; will
            shrink the number.
          </p>
          <div className="flex flex-wrap gap-3">
            <PrintButton />
            <Link
              href={`/race/${entry.bib}`}
              className="inline-flex items-center gap-2 border border-charcoal/15 px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase no-underline hover:bg-white transition-colors"
            >
              View Results
            </Link>
          </div>
        </div>

        {/* The bib itself */}
        <div className="bib-sheet bg-white border-2 border-charcoal/85 rounded-sm mx-auto overflow-hidden">
          {/* Pin holes, top */}
          <div className="flex justify-between px-6 pt-4">
            <span className="w-3 h-3 rounded-full border border-charcoal/30" />
            <span className="w-3 h-3 rounded-full border border-charcoal/30" />
          </div>

          <div className="px-8 pt-2 pb-1 text-center">
            <div className="text-[11px] font-black tracking-[5px] uppercase text-charcoal/60">
              {EVENT.brand}
            </div>
          </div>

          {/* Event band */}
          <div className="bg-charcoal text-white px-8 py-3 text-center">
            <div className="font-[family-name:var(--font-heading)] text-[22px] font-bold tracking-tight leading-none">
              {EVENT.name}
            </div>
            {/* Template string rather than JSX text: JSX drops the space
                between an expression and a following entity. */}
            <div className="text-[11px] tracking-[2px] uppercase text-white/70 mt-1.5">
              {`${EVENT.date} · Washington, DC`}
            </div>
          </div>

          {/* Number */}
          <div className="px-8 py-6 text-center">
            <div className="font-[family-name:var(--font-heading)] font-black leading-[0.85] tracking-tighter text-charcoal text-[clamp(5rem,18vw,9rem)]">
              {entry.bib}
            </div>
            <div className="mt-3 text-[15px] font-bold tracking-tight text-charcoal/85 uppercase">
              {name}
            </div>
          </div>

          {/* Tear strip */}
          <div className="border-t-2 border-dashed border-charcoal/25 px-8 py-4 flex items-center justify-between gap-6">
            <div className="text-left">
              <div className="text-[10px] font-bold tracking-[2px] uppercase text-charcoal/50 mb-1">
                Start
              </div>
              <div className="text-[15px] font-black text-charcoal">{EVENT.startTime}</div>
              <div className="text-[11px] text-charcoal/60 mt-1.5 max-w-[220px] leading-snug">
                {EVENT.location}
              </div>
            </div>

            <div className="text-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/api/qr/results?size=256"
                alt="QR code linking to live race results"
                width={72}
                height={72}
                className="w-[72px] h-[72px] block"
              />
              <div className="text-[9px] tracking-[1px] uppercase text-charcoal/50 mt-1">
                Results
              </div>
            </div>
          </div>

          {/* Pin holes, bottom */}
          <div className="flex justify-between px-6 pb-4">
            <span className="w-3 h-3 rounded-full border border-charcoal/30" />
            <span className="w-3 h-3 rounded-full border border-charcoal/30" />
          </div>
        </div>

        <p className="print:hidden text-[13px] text-charcoal/55 text-center mt-6">
          Wear this on the front of your shirt so the timing volunteers can read it.
        </p>
      </div>
    </main>
  );
}
