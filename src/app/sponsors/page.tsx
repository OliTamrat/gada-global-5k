import Link from "next/link";
import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SponsorTiers } from "@/components/SponsorTiers";
import { sponsorMailto, SPONSOR_EMAIL, isSponsorTier } from "@/lib/sponsors";
import { siteUrl } from "@/lib/site";
import { EVENT } from "@/lib/email";

const SITE = siteUrl();

export const metadata: Metadata = {
  title: "Sponsor the Gada Global 5K | Gada Global Run",
  description:
    "Sponsorship levels and benefits for the Gada Global 5K on October 3, 2026 in Washington DC. Platinum, Gold, Silver and Bronze levels from $250.",
  alternates: { canonical: `${SITE}/sponsors` },
  openGraph: {
    title: "Sponsor the Gada Global 5K",
    description:
      "Back the inaugural Gada Global 5K. Four sponsorship levels, starting at $250.",
    url: `${SITE}/sponsors`,
  },
};

const WHY = [
  {
    title: "A captive morning",
    body: "Runners, families and supporters are on site from 7:00 AM packet pickup through the cultural festival at noon. Your signage is in front of them for five hours, not five seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    ),
  },
  {
    title: "It leaves with them",
    body: "The race t-shirt is not a flyer that goes in the bin. Logos printed on it get worn around Washington DC long after October 3.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 3L12 6l3.5-3L21 6l-2 4h-2v11H7V10H5L3 6l5.5-3z" /></svg>
    ),
  },
  {
    title: "Neighbours, not passing traffic",
    body: "This is a neighbourhood morning: families, runners and local businesses in one place. Sponsoring it puts your name in front of the people who live here, not people driving past.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
    ),
  },
];

const STEPS = [
  {
    n: "1",
    title: "Pick a level",
    body: "Open a level above to see exactly what it includes, then send the enquiry. It arrives with the level already in the subject line.",
  },
  {
    n: "2",
    title: "Send your artwork",
    body: "We will confirm the amount and ask for your logo as a vector file or a high-resolution PNG. The t-shirt has a printing cut-off — ask us for the current deadline, it comes well before race day.",
  },
  {
    n: "3",
    title: "See your name on race morning",
    body: "Banner and signage go up before 7:00 AM. Sponsors are read out from the stage at the opening ceremony and again at the awards.",
  },
];

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Homepage tiles deep-link here with ?level=gold so the accordion opens on
  // the level that was tapped. An unrecognised value falls back to Platinum
  // rather than erroring — a bad link must never break the page.
  const level = (await searchParams).level;
  const initialOpen = isSponsorTier(level) ? level : "platinum";

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
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">
            Partner With Us
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.1] text-white mb-6 tracking-tight">
            Your Name on the Shirt,<br />the Banner and the Stage
          </h1>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/82 max-w-[580px] mx-auto">
            {`Back the inaugural Gada Global 5K on ${EVENT.date} at the ${EVENT.location} in Washington DC. Four levels, starting at $250.`}
          </p>
        </div>
      </section>

      {/* ══ LEVELS ══ */}
      <section className="bg-charcoal-light py-14 md:py-18 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-10 md:mb-12">
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">
              Four Ways to Back the Race
            </h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-white/75 max-w-[520px] mx-auto">
              Open a level to see exactly what it includes. Each figure is a
              minimum, not a fixed price.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <SponsorTiers initialOpen={initialOpen} />
          </ScrollReveal>
        </div>
      </section>

      {/* ══ WHY ══ */}
      <section className="bg-cream py-14 md:py-18 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">
              Why It Works
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight">
              What Your Money Actually Buys
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {WHY.map((w) => (
              <ScrollReveal key={w.title}>
                <div className="bg-white rounded-2xl p-7 h-full border border-charcoal/5">
                  <div className="w-12 h-12 rounded-xl yellow-card flex items-center justify-center mb-5">
                    {w.icon}
                  </div>
                  <h3 className="font-bold text-[17px] text-charcoal tracking-tight mb-2.5">
                    {w.title}
                  </h3>
                  <p className="text-[15px] leading-[1.8] text-charcoal/75">{w.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="bg-charcoal py-14 md:py-18 px-6 md:px-16 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">
              How It Works
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white tracking-tight">
              Three Steps, No Paperwork
            </h2>
          </ScrollReveal>

          <div className="space-y-4">
            {STEPS.map((s) => (
              <ScrollReveal key={s.n}>
                <div className="dark-card rounded-2xl p-6 md:p-7 flex gap-5">
                  <span className="w-10 h-10 rounded-full yellow-card flex items-center justify-center font-black text-[16px] shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-bold text-[17px] text-white tracking-tight mb-2">
                      {s.title}
                    </h3>
                    <p className="text-[15px] leading-[1.8] text-white/75">{s.body}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-green-deep py-14 md:py-18 px-6 md:px-16 lg:px-20 text-center">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">
            Back the Run
          </h2>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/85 max-w-[480px] mx-auto mb-9">
            Every level puts your name in front of the people who live here, on
            a morning they will remember.
          </p>
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <a
              href={sponsorMailto()}
              className="inline-flex items-center gap-3 yellow-card px-9 py-4 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline"
            >
              Sponsorship Enquiry
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-xl font-bold text-[14px] tracking-wider uppercase text-white border border-white/25 hover:bg-white/10 transition-all no-underline"
            >
              About the Race
            </Link>
          </div>
          <p className="text-[14px] text-white/70 mt-7">
            Or write to us directly at{" "}
            <a
              href={`mailto:${SPONSOR_EMAIL}`}
              className="text-yellow font-semibold no-underline hover:underline"
            >
              {SPONSOR_EMAIL}
            </a>
          </p>
        </ScrollReveal>
      </section>
    </main>
  );
}
