import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LINK_SECTIONS, activeSocials, type SiteLink, type SocialLink } from "@/lib/links";
import { LINK_ICONS } from "@/components/LinkIcons";
import { ShareButton } from "@/components/ShareButton";
import { EVENT } from "@/lib/email";
import { siteUrl } from "@/lib/site";

const SITE = siteUrl();

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

function Row({ link }: { link: SiteLink | SocialLink }) {
  const isSite = "primary" in link;
  const primary = isSite && link.primary;
  const label = "label" in link ? link.label : "";
  const external = ("external" in link && link.external) || !isSite;

  const inner = (
    <>
      <span
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${link.tint}`}
      >
        {LINK_ICONS[link.icon]}
      </span>
      <span className="flex-1 min-w-0">
        <span
          className={`block text-[16px] font-bold tracking-tight leading-snug ${
            primary ? "text-charcoal" : "text-white"
          }`}
        >
          {label}
        </span>
        <span
          className={`block text-[13px] leading-snug mt-0.5 ${
            primary ? "text-charcoal/60" : "text-white/50"
          }`}
        >
          {link.blurb}
        </span>
      </span>
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
          primary ? "text-charcoal/45" : "text-white/35"
        }`}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </>
  );

  const className = `group flex items-center gap-4 rounded-2xl px-4 py-3.5 no-underline transition-all hover:-translate-y-0.5 ${
    primary
      ? "yellow-card hover:shadow-[0_10px_32px_rgba(245,200,66,0.28)]"
      : "bg-white/[0.055] border border-white/10 hover:bg-white/[0.09] hover:border-white/18"
  }`;

  if (external) {
    return (
      <a
        href={link.href}
        className={className}
        {...(link.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {inner}
    </Link>
  );
}

function Divider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-yellow/35" />
      <span className="text-[11px] font-bold tracking-[3px] uppercase text-yellow/80">
        {title}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-yellow/35" />
    </div>
  );
}

export default function LinksPage() {
  const socials = activeSocials();

  return (
    <main className="relative bg-charcoal min-h-screen px-5 pt-24 pb-14 overflow-hidden">
      {/* Warm vignette so the page is not a flat black rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgba(232,185,48,0.10), transparent 70%), radial-gradient(60% 40% at 100% 100%, rgba(198,40,40,0.10), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-[460px] mx-auto">
        <header className="text-center mb-9">
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
          <p className="text-[14px] leading-[1.65] text-white/60 mt-2.5 max-w-[330px] mx-auto">
            Celebrating Oromo heritage through running.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 rounded-full bg-white/8 border border-white/12 px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            <span className="text-[12px] font-semibold tracking-wide text-white/85">
              {`${EVENT.date} · Washington, DC`}
            </span>
          </div>
        </header>

        <div className="space-y-3">
          {LINK_SECTIONS.map((section, i) => (
            <div key={section.title ?? `lead-${i}`} className="space-y-3">
              {section.title && <Divider title={section.title} />}
              {section.links.map((link) => (
                <Row key={link.href + link.label} link={link} />
              ))}
            </div>
          ))}

          {socials.length > 0 && (
            <div className="space-y-3">
              <Divider title="Follow" />
              {socials.map((s) => (
                <Row key={s.label} link={s} />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-9">
          <ShareButton url={`${SITE}/links`} title={`${EVENT.brand} — ${EVENT.name}`} />
        </div>

        <footer className="text-center mt-11">
          <div className="text-[11px] font-bold tracking-[5px] uppercase text-white/30 mb-3">
            {EVENT.brand}
          </div>
          <p className="text-[12px] text-white/28 leading-relaxed">
            {`© 2026 ${EVENT.organization} All rights reserved.`}
          </p>
          {/* SVG heart, not an emoji — the project forbids emoji in UI. */}
          <p className="text-[12px] text-white/28 leading-relaxed inline-flex items-center gap-1.5 mt-1">
            Built with
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-red-oromo shrink-0"
              role="img"
              aria-label="love"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            by Olink Technologies
          </p>
        </footer>
      </div>
    </main>
  );
}
