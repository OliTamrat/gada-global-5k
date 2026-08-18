import Link from "next/link";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Promo Kit | Gada Global 5K",
  description:
    "QR codes and shareable links for Gada Global 5K posters, flyers, and social media.",
  robots: { index: false, follow: false },
};

const SITE = siteUrl();

const CODES = [
  {
    target: "register",
    title: "Register",
    blurb: "Send people straight to the registration form. Use this one on flyers.",
    url: `${SITE}/register`,
  },
  {
    target: "home",
    title: "Website",
    blurb: "The full event page — course, schedule, prizes, and merch.",
    url: SITE,
  },
  {
    target: "links",
    title: "All Links",
    blurb: "The link-in-bio page — register, shop, results, and contact in one place.",
    url: `${SITE}/links`,
  },
  {
    target: "sponsors",
    title: "Become a Sponsor",
    blurb: "For the sponsor flyer and for handing to restaurants and businesses.",
    url: `${SITE}/sponsors`,
  },
  {
    target: "results",
    title: "Live Results",
    blurb: "For race-day signage at the finish line and the results table.",
    url: `${SITE}/race`,
  },
] as const;

export default function PromoPage() {
  return (
    <main className="bg-cream min-h-screen pt-28 pb-20 px-6 md:px-16">
      <div className="max-w-[1000px] mx-auto">
        <span className="text-[12px] font-bold tracking-[4px] uppercase text-charcoal/50 mb-4 block">
          Internal
        </span>
        <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight mb-4">
          Promo Kit
        </h1>
        <p className="text-[16px] leading-[1.8] text-charcoal/70 max-w-[620px] mb-12">
          QR codes for posters, flyers, and social posts. Each downloads as a
          high-resolution PNG on a white background — drop it straight into
          Canva, Illustrator, or a slide.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CODES.map((code) => (
            <div
              key={code.target}
              className="bg-white rounded-2xl p-6 border border-charcoal/8 flex flex-col"
            >
              <div className="bg-white rounded-xl border border-charcoal/8 p-3 mb-5">
                {/* Plain img, not next/image: this is a dynamically generated
                    PNG that should not go through the image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/qr/${code.target}?size=512`}
                  alt={`QR code linking to ${code.url}`}
                  width={512}
                  height={512}
                  className="w-full h-auto block"
                />
              </div>

              <h2 className="font-bold text-[18px] tracking-tight mb-2">{code.title}</h2>
              <p className="text-[14px] leading-[1.7] text-charcoal/65 mb-4 flex-1">
                {code.blurb}
              </p>
              <code className="block text-[12px] text-charcoal/55 bg-cream rounded-lg px-3 py-2 mb-4 break-all">
                {code.url}
              </code>

              <div className="flex gap-2">
                <a
                  href={`/api/qr/${code.target}?size=2048`}
                  download={`gada-global-5k-${code.target}-qr.png`}
                  className="flex-1 text-center yellow-card rounded-lg px-4 py-2.5 font-bold text-[13px] tracking-wider uppercase no-underline hover:-translate-y-0.5 transition-transform"
                >
                  Download PNG
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* The other printable thing in the kit. It is not a QR code, so it
            sits outside the grid rather than being forced into a card that
            has nowhere to put an image. */}
        <div className="bg-white rounded-2xl p-7 border border-charcoal/8 mb-6">
          <h2 className="font-bold text-[18px] tracking-tight mb-2">Sponsor Letter</h2>
          <p className="text-[15px] leading-[1.75] text-charcoal/70 mb-5 max-w-[620px]">
            A letterheaded approach letter for businesses you are asking to
            sponsor the race. Fill in the business and the level, then print
            it to sign or copy it as an email. Read the notes on that page
            before you send one — the sponsorship prices have not been
            confirmed yet.
          </p>
          <Link
            href="/sponsors/letter"
            className="inline-flex items-center gap-2 yellow-card rounded-lg px-6 py-2.5 font-bold text-[13px] tracking-wider uppercase no-underline hover:-translate-y-0.5 transition-transform"
          >
            Open the Letter
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-charcoal/8 mb-10">
          <h2 className="font-bold text-[18px] tracking-tight mb-4">Using these</h2>
          <ul className="space-y-3 text-[15px] leading-[1.75] text-charcoal/70 list-none">
            {[
              "Print the QR at 1 inch (2.5 cm) square or larger. Smaller than that and phone cameras struggle in poor light.",
              "Keep a clear white margin around the code — the built-in quiet zone is part of what makes it scannable.",
              "Do not stretch it. Scale both dimensions together or the code will not read.",
              "Always print the web address in text next to the code, so anyone without a working camera can still reach the page.",
              "Test a printed copy with two different phones before sending a design to a printer.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow mt-2.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-charcoal/15 px-6 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase no-underline hover:bg-white transition-colors"
          >
            Back to Site
          </Link>
        </div>
      </div>
    </main>
  );
}
