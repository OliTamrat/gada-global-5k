import type { Metadata } from "next";
import { BibLookup } from "@/components/BibLookup";

export const metadata: Metadata = {
  title: "Print Your Race Bib | Gada Global 5K",
  description:
    "Enter your bib number to print your Gada Global 5K race bib at home.",
  robots: { index: false, follow: false },
};

export default function BibIndexPage() {
  return (
    <main className="bg-cream min-h-screen pt-28 pb-20 px-6 flex items-start justify-center">
      <div className="max-w-[480px] w-full">
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.9rem,4vw,2.8rem)] font-bold tracking-tight mb-4">
          Print Your Race Bib
        </h1>
        <p className="text-[16px] leading-[1.8] text-charcoal/70 mb-8">
          Your bib number is in your registration confirmation email. Enter it
          below to open a printable bib.
        </p>
        <BibLookup />
      </div>
    </main>
  );
}
