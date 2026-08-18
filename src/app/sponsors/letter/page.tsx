import Link from "next/link";
import type { Metadata } from "next";
import { SponsorLetter } from "@/components/SponsorLetter";

export const metadata: Metadata = {
  title: "Sponsor Letter | Gada Global 5K",
  description:
    "A letterheaded sponsorship approach letter for the Gada Global 5K — fill in the business, print it, or copy it as an email.",
  // Organizer tooling, like /promo. It is not gated — there is nothing here a
  // stranger could learn that /sponsors does not already say in public — but
  // it has no business in search results either.
  robots: { index: false, follow: false },
};

// The letter is dated, and a date baked in at build time is wrong from the
// next morning onwards. Rendering per request is what keeps it right, and it
// is also what lets the server and the client agree on the string rather than
// computing it twice and hydrating a mismatch.
export const dynamic = "force-dynamic";

function todayInDc(): string {
  return new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SponsorLetterPage() {
  return (
    <main className="bg-cream min-h-screen pt-28 pb-20 px-6 md:px-12 print:pt-0 print:pb-0 print:px-0 print:bg-white">
      <div className="max-w-[7in] mx-auto mb-8 print:hidden">
        <span className="text-[12px] font-bold tracking-[4px] uppercase text-charcoal/50 mb-4 block">
          Internal
        </span>
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight mb-4">
          Sponsor Letter
        </h1>
        <p className="text-[15.5px] leading-[1.8] text-charcoal/70 mb-6">
          A letterheaded approach letter to print and sign, or to copy into an
          email. Everything factual in it — the date, the venue, the levels —
          is read from the same files the website and the confirmation emails
          use, so it cannot drift from what the rest of the site says.
        </p>

        {/* ══ The one thing whoever prints this needs to know, and the one
            thing that must never appear on the letter itself. ══ */}
        <div className="rounded-xl border-l-4 border-red-oromo bg-white p-5 mb-4">
          <p className="text-[13px] font-bold tracking-[1.5px] uppercase text-red-oromo mb-2">
            Before you send this
          </p>
          <ul className="text-[14px] leading-[1.75] text-charcoal/80 space-y-2 list-disc pl-5">
            <li>
              <strong>The sponsorship prices are still placeholders.</strong>{" "}
              The four levels and their amounts came from a sample flyer used
              as a design reference, not from an offer the organizers have
              agreed. Confirm them before this letter goes to a business —
              a price in writing is a price you will be held to.
            </li>
            <li>
              <strong>Add how many runners you expect.</strong> It is the first
              question a business asks and the most persuasive line in the
              letter. It is left out because nobody has a real number for a
              first running, and an invented one is a promise made in October.
            </li>
            <li>
              <strong>The artwork deadline is not stated.</strong> The letter
              promises to send it rather than guessing. Get it from whoever
              prints the shirts.
            </li>
            <li>
              <strong>There is no postal address on the letterhead.</strong>{" "}
              It reads &ldquo;Washington, DC&rdquo; because no mailing address
              for Gada Global Inc. is recorded anywhere in this project, and
              the venue address is the park&rsquo;s, not the
              organization&rsquo;s. Add the real one in{" "}
              <code className="text-[12.5px] bg-charcoal/[0.06] px-1.5 py-0.5 rounded">
                src/components/Letterhead.tsx
              </code>{" "}
              when there is one.
            </li>
          </ul>
        </div>

        <p className="text-[13.5px] text-charcoal/60">
          Levels and benefits are edited in one place —{" "}
          <code className="text-[12.5px] bg-charcoal/[0.06] px-1.5 py-0.5 rounded">
            src/lib/sponsors.ts
          </code>{" "}
          — and this letter, the{" "}
          <Link href="/sponsors" className="font-semibold text-charcoal underline">
            sponsors page
          </Link>{" "}
          and the enquiry emails all read from it.
        </p>
      </div>

      <SponsorLetter today={todayInDc()} />
    </main>
  );
}
