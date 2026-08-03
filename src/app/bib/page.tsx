import Link from "next/link";
import type { Metadata } from "next";
import { EVENT } from "@/lib/email";
import { siteUrl } from "@/lib/site";

const SITE = siteUrl();

export const metadata: Metadata = {
  title: "Your Race Bib | Gada Global 5K",
  description:
    "How to get your Gada Global 5K race bib — print it from the link in your confirmation email, or collect it at packet pickup from 7:00 AM.",
  alternates: { canonical: `${SITE}/bib` },
};

const STEPS = [
  {
    n: "1",
    title: "Open your confirmation email",
    body: "It has your bib number in large type, and a Print Your Bib button that opens your own bib ready to print. Only your email carries that link.",
  },
  {
    n: "2",
    title: "Print it at 100% scale",
    body: 'Plain paper is fine. Turn off "fit to page" — it shrinks the number, and the finish-line volunteers need to read it at speed.',
  },
  {
    n: "3",
    title: `Or collect it from ${EVENT.packetPickup}`,
    body: `No printer, no problem. Packet pickup runs from ${EVENT.packetPickup} at the ${EVENT.location}, ${EVENT.address}, right up to the ${EVENT.startTime} start. Bring a photo ID.`,
  },
  {
    n: "4",
    title: "Pin it to the front of your shirt",
    body: "Front, not back. The finish-line volunteers read your number as you cross, and that is what puts your time on the results board.",
  },
];

export default function BibPage() {
  return (
    <main>
      {/* ══ HERO ══ */}
      <section className="bg-charcoal pt-28 pb-16 md:pt-36 md:pb-20 px-6 md:px-16 lg:px-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat`,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">
            Race Day
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.1] text-white mb-6 tracking-tight">
            Getting Your Race Bib
          </h1>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/82 max-w-[540px] mx-auto">
            {`Print it at home from the link in your confirmation email, or collect it at packet pickup from ${EVENT.packetPickup} on race morning.`}
          </p>
        </div>
      </section>

      {/* ══ WHERE THE LINK LIVES ══ */}
      <section className="bg-charcoal-light py-12 md:py-14 px-6 md:px-16 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-white/[0.05] border border-white/12 p-6 md:p-8 overflow-hidden">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow"
            />
            <div className="flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-yellow/15 text-yellow flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
              <div>
                <h2 className="font-bold text-[18px] md:text-[19px] text-white tracking-tight mb-2.5">
                  Your print link is in your confirmation email
                </h2>
                <p className="text-[15px] leading-[1.8] text-white/72">
                  There is no bib-number box on this page on purpose. A form that
                  prints a bib for any number typed into it would let anyone
                  print anyone&rsquo;s &mdash; and with a $1,200 purse across six
                  places, that is not a risk worth carrying. The link that opens
                  your bib is the one sent to the address you registered with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STEPS ══ */}
      <section className="bg-cream py-14 md:py-18 px-6 md:px-16 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">
              On the Morning
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight">
              From Email to Start Line
            </h2>
          </div>

          <div className="space-y-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-white rounded-2xl p-6 md:p-7 border border-charcoal/5 flex gap-5"
              >
                <span className="w-10 h-10 rounded-full yellow-card flex items-center justify-center font-black text-[16px] shrink-0">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-bold text-[17px] text-charcoal tracking-tight mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[15px] leading-[1.8] text-charcoal/75">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LOST EMAIL ══ */}
      <section className="bg-charcoal py-14 md:py-18 px-6 md:px-16 lg:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-tight text-white tracking-tight mb-4">
            Lost Your Confirmation Email?
          </h2>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/78 max-w-[500px] mx-auto mb-8">
            You can still collect your bib at packet pickup &mdash; your name on
            the registration list is enough. If you want the print link resent,
            write to us and we will send it to your registered address.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <a
              href={`mailto:${EVENT.supportEmail}?subject=${encodeURIComponent("Resend my bib link — Gada Global 5K")}`}
              className="inline-flex items-center gap-2.5 yellow-card px-8 py-3.5 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline"
            >
              Resend My Bib Link
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <Link
              href="/#event"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-[14px] tracking-wider uppercase text-white border border-white/25 hover:bg-white/10 transition-all no-underline"
            >
              Race Day Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
