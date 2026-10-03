import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUESTS, GUEST_PHOTO_CREDIT, guestBySlug } from "@/lib/guests";
import { EVENT } from "@/lib/event";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return GUESTS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guestBySlug(slug);
  if (!g) return {};
  const description = `${g.name}, ${g.title}, is an honorable guest at the ${EVENT.name}. ${g.bio[0]}`.slice(0, 300);
  return {
    title: `${g.name} — Honorable Guest | ${EVENT.name}`,
    description,
    alternates: { canonical: `${siteUrl()}/guests/${g.slug}` },
    openGraph: { title: `${g.name} — ${g.title}`, description, images: [{ url: g.image }] },
  };
}

const Medal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="15" r="6" /><path d="M8.5 9.5 6 2h4l2 5 2-5h4l-2.5 7.5" />
  </svg>
);

export default async function GuestProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guestBySlug(slug);
  if (!g) notFound();

  const i = GUESTS.indexOf(g);
  const prev = GUESTS[(i - 1 + GUESTS.length) % GUESTS.length];
  const next = GUESTS[(i + 1) % GUESTS.length];

  return (
    <main className="bg-charcoal min-h-screen text-white">
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-16 lg:px-20">
        <div className="absolute inset-0 scale-125 blur-3xl opacity-40" style={{ background: `url(${g.image}) center/cover` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/80 to-charcoal" />
        <div className="pointer-events-none absolute -right-6 top-20 font-black text-[clamp(10rem,30vw,22rem)] leading-none text-transparent [-webkit-text-stroke:2px_rgba(245,200,66,0.18)] select-none">
          {String(i + 1).padStart(2, "0")}
        </div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-[minmax(0,420px)_1fr] gap-10 md:gap-14 items-center">
          <div className="relative mx-auto w-full max-w-[380px] md:max-w-none aspect-[3/4] rounded-[28px] overflow-hidden shadow-[0_40px_90px_rgba(0,0,0,0.55)] ring-2 ring-yellow/70">
            <Image src={g.image} alt={g.name} fill priority className="object-cover object-[center_22%]" sizes="(max-width: 768px) 90vw, 420px" />
            <span className="absolute top-0 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-yellow text-charcoal text-[12px] font-black tracking-[2px] uppercase px-4 py-2 rounded-b-xl whitespace-nowrap">
              <Medal /> {g.badge}
            </span>
          </div>

          <div className="text-center md:text-left">
            <Link href="/guests" className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[4px] uppercase text-yellow no-underline hover:text-white transition-colors">
              <Medal /> Honorable Guest {String(i + 1).padStart(2, "0")} / 05
            </Link>
            <h1 className="font-[family-name:var(--font-heading)] font-black tracking-tight leading-[0.98] text-[clamp(2.6rem,7vw,5.2rem)] mt-5">
              {g.name}
            </h1>
            <div className="text-white/60 text-xl md:text-2xl mt-3">{g.amharic}</div>
            <div className="h-[3px] w-16 bg-yellow my-6 mx-auto md:mx-0" />
            <div className="text-yellow text-xl md:text-2xl font-bold">{g.title}</div>
            <div className="text-white/60 text-[15px] mt-2">Born {g.born}</div>
            <div className="mt-7 inline-flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <span className="text-[11px] font-bold tracking-[3px] uppercase text-yellow/80 self-center">Personal bests</span>
              <span className="text-[15px] text-white/90">{g.bests}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STORY + HIGHLIGHTS ══ */}
      <section className="px-6 md:px-16 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-14">
          <article>
            <h2 className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-6">The story</h2>
            <div className="space-y-6">
              {g.bio.map((para, n) => (
                <p key={n} className={`leading-[1.85] text-white/85 ${n === 0 ? "text-[19px] md:text-[21px] text-white first-letter:text-yellow first-letter:font-black first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9]" : "text-[17px]"}`}>
                  {para}
                </p>
              ))}
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 self-start bg-white/5 border border-white/10 rounded-3xl p-6 md:p-7">
            <h2 className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5">Career highlights</h2>
            <ol className="list-none space-y-4">
              {g.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-yellow text-charcoal grid place-items-center"><Medal /></span>
                  <span className="text-[15px] leading-snug text-white/90">{h}</span>
                </li>
              ))}
            </ol>
            <Link href="/register" className="mt-7 block text-center yellow-card rounded-xl px-5 py-3.5 font-bold text-[13px] tracking-wider uppercase no-underline hover:-translate-y-0.5 transition-all">
              Run with legends
            </Link>
          </aside>
        </div>
      </section>

      {/* ══ PREV / NEXT ══ */}
      <nav className="px-6 md:px-16 lg:px-20 pb-16" aria-label="Other honorable guests">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-4">
          {[{ g: prev, label: "Previous guest", align: "text-left" }, { g: next, label: "Next guest", align: "text-right" }].map(({ g: o, label, align }) => (
            <Link key={label} href={`/guests/${o.slug}`} className={`group relative overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-yellow/60 h-[120px] md:h-[150px] no-underline ${align}`}>
              <Image src={o.image} alt="" fill className="object-cover object-[center_25%] opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <div className="text-[11px] font-bold tracking-[3px] uppercase text-yellow">{label}</div>
                <div className="font-[family-name:var(--font-heading)] text-white text-lg md:text-2xl font-black mt-1">{o.name}</div>
              </div>
            </Link>
          ))}
        </div>
        <p className="max-w-6xl mx-auto text-[12px] text-white/40 mt-8">{GUEST_PHOTO_CREDIT}</p>
      </nav>
    </main>
  );
}
