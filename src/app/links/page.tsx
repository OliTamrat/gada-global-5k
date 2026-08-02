import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SITE_LINKS, activeSocials } from "@/lib/links";
import { EVENT } from "@/lib/email";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gadaglobalrun.com";

export const metadata: Metadata = {
  title: "Gada Global Run — All Links",
  description:
    "Register for the Gada Global 5K, shop merch, check live results, and print your race bib.",
  alternates: { canonical: `${SITE}/links` },
  openGraph: {
    title: "Gada Global Run — All Links",
    description: "Everything for the Gada Global 5K in one place.",
    url: `${SITE}/links`,
  },
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  X: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

export default function LinksPage() {
  const socials = activeSocials();

  return (
    // No nav or footer chrome — this is the page a phone opens from a bio link,
    // so it is one screen of taps and nothing else.
    <main className="bg-charcoal min-h-screen px-5 pt-24 pb-14 flex flex-col items-center">
      <div className="w-full max-w-[460px]">
        <div className="text-center mb-9">
          <Image
            src="/images/brand/gada-global-logo.png"
            alt="Gada Global"
            width={425}
            height={360}
            priority
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="font-[family-name:var(--font-heading)] text-[26px] font-bold text-white tracking-tight leading-tight">
            {EVENT.brand}
          </h1>
          <p className="text-[14px] leading-[1.65] text-white/65 mt-2.5 max-w-[330px] mx-auto">
            Celebrating Oromo heritage through running.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 rounded-full bg-white/8 border border-white/12 px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span className="text-[12px] font-semibold tracking-wide text-white/85">
              {`${EVENT.date} · Washington, DC`}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group block rounded-2xl px-5 py-4 no-underline transition-all hover:-translate-y-0.5 ${
                link.primary
                  ? "yellow-card hover:shadow-[0_10px_32px_rgba(245,200,66,0.28)]"
                  : "bg-white/8 border border-white/12 hover:bg-white/12"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[16px] font-bold tracking-tight leading-snug ${
                      link.primary ? "text-charcoal" : "text-white"
                    }`}
                  >
                    {link.label}
                  </div>
                  <div
                    className={`text-[13px] leading-snug mt-0.5 ${
                      link.primary ? "text-charcoal/60" : "text-white/55"
                    }`}
                  >
                    {link.blurb}
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    link.primary ? "text-charcoal/45" : "text-white/40"
                  }`}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}

          <a
            href={`mailto:${EVENT.supportEmail}`}
            className="group block rounded-2xl px-5 py-4 no-underline bg-white/8 border border-white/12 hover:bg-white/12 transition-all hover:-translate-y-0.5"
          >
            <div className="text-[16px] font-bold tracking-tight text-white leading-snug">
              Contact us
            </div>
            <div className="text-[13px] text-white/55 mt-0.5">{EVENT.supportEmail}</div>
          </a>
        </div>

        {socials.length > 0 && (
          <div className="flex justify-center gap-3 mt-9">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-11 h-11 rounded-xl bg-white/8 border border-white/12 text-white/75 flex items-center justify-center hover:bg-yellow hover:text-charcoal hover:border-yellow transition-all no-underline"
              >
                {SOCIAL_ICONS[s.label]}
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-[12px] text-white/35 mt-10">
          {`© 2026 ${EVENT.organization}`}
        </p>
      </div>
    </main>
  );
}
