import type { Metadata } from "next";
import { HonorableGuests } from "@/components/HonorableGuests";
import { GUEST_PHOTO_CREDIT } from "@/lib/guests";
import { EVENT } from "@/lib/event";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Honorable Guests | ${EVENT.name}`,
  description: `Five Olympic and World Championship medalists from Ethiopia are honorable guests at the ${EVENT.name}.`,
  alternates: { canonical: `${siteUrl()}/guests` },
};

export default function GuestsPage() {
  return (
    <main className="bg-charcoal min-h-screen pt-28 md:pt-36 pb-16 px-6 md:px-16 lg:px-20">
      <HonorableGuests />
      <p className="max-w-6xl mx-auto text-[12px] text-white/40 mt-12">{GUEST_PHOTO_CREDIT}</p>
    </main>
  );
}
