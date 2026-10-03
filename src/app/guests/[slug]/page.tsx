import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUESTS, GUEST_PHOTO_CREDIT, guestBySlug, type Milestone } from "@/lib/guests";
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

const MEDAL: Record<Milestone["kind"], { color: string; label: string }> = {
  gold: { color: "#F5C842", label: "Gold" },
  silver: { color: "#C9CED6", label: "Silver" },
  bronze: { color: "#CD8B4E", label: "Bronze" },
  win: { color: "#F5C842", label: "Race win" },
  made: { color: "rgba(255,255,255,0.35)", label: "Milestone" },
};

function Marker({ kind, size = 22 }: { kind: Milestone["kind"]; size?: number }) {
  const { color } = MEDAL[kind];
  if (kind === "win") {
    // Trophy for a race victory
    return (
      <span className="grid place-items-center rounded-full bg-charcoal" style={{ width: size, height: size, boxShadow: `0 0 0 2px ${color}` }}>
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9H4a2 2 0 01-2-2V4h4M18 9h2a2 2 0 002-2V4h-4M8 22h8M12 15v7M18 2H6v7a6 6 0 0012 0V2z" />
        </svg>
      </span>
    );
  }
  if (kind === "made") {
    return <span className="block rounded-full bg-charcoal" style={{ width: size * 0.7, height: size * 0.7, boxShadow: `0 0 0 2px ${color}` }} />;
  }
  return (
    <span className="block rounded-full" style={{ width: size, height: size, background: `radial-gradient(circle at 35% 30%, #fff8 0 18%, ${color} 45%)`, boxShadow: `0 0 0 3px #141210, 0 0 0 4px ${color}66` }} />
  );
}

export default async function GuestProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guestBySlug(slug);
  if (!g) notFound();

  const i = GUESTS.indexOf(g);
    const prev = GUESTS[(i - 1 + GUESTS.length) % GUESTS.length];
  const next = GUESTS[(i + 1) % GUESTS.length];

  const tally = (["gold", "silver", "bronze", "win"] as const)
    .map((k) => ({ k, n: g.timeline.filter((m) => m.kind === k).length }))
    .filter((t) => t.n > 0);

  // "Marathon 2:19:31 · Half marathon 1:07:21" -> [{event, time}]
  const bests = g.bests.split(" · ").map((b) => {
    const at = b.lastIndexOf(" ");
    return { event: b.slice(0, at), time: b.slice(at + 1) };
  });

  return (
    <main className="bg-charcoal min-h-screen text-white">
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-16 lg:px-20">
        {/* Track lanes along the bottom, finish-line checks on the right edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 opacity-[0.07] bg-[repeating-linear-gradient(180deg,#fff_0_2px,transparent_2px_44px)]" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 opacity-[0.12] bg-[conic-gradient(#fff_25%,transparent_0_50%,#fff_0_75%,transparent_0)] bg-[length:12px_12px]" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[360px_1fr] gap-14 lg:gap-20 items-center">
          {/* Photo at its native 360x480 */}
          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="relative aspect-[3/4] rounded-md overflow-hidden bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <Image src={g.image} alt={g.name} fill priority unoptimized className="object-cover" sizes="360px" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <Link href="/guests" className="text-[12px] font-bold tracking-[4px] uppercase text-yellow no-underline hover:text-white transition-colors">
              Honorable Guests
            </Link>
            <h1 className="font-[family-name:var(--font-heading)] font-black tracking-[-0.03em] leading-[0.92] text-[clamp(3rem,8vw,6rem)] mt-4">
              {g.name.split(" ").map((w, n) => (
                <span key={w} className={`block ${n === 1 ? "text-yellow" : ""}`}>{w}</span>
              ))}
            </h1>
            <div className="font-[family-name:var(--font-ethiopic)] text-white/55 text-2xl md:text-3xl font-medium mt-4">{g.amharic}</div>
            <div className="text-white text-xl md:text-2xl font-semibold mt-6">{g.title}</div>
            <div className="text-white/50 text-[15px] mt-1.5">Born {g.born}</div>

            <ul className="list-none flex flex-wrap gap-2.5 mt-7 justify-center lg:justify-start">
              {tally.map(({ k, n }) => (
                <li key={k} className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-full pl-1.5 pr-4 py-1.5">
                  <Marker kind={k} size={22} />
                  <span className="text-[14px] font-bold tabular-nums">{n}</span>
                  <span className="text-[12px] text-white/60 font-semibold uppercase tracking-[1.5px]">{k === "win" && n > 1 ? "Race wins" : MEDAL[k].label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ RACE CLOCK — personal bests ══ */}
      <section className="px-6 md:px-16 lg:px-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5">Personal bests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {bests.map((b) => (
              <div key={b.event} className="rounded-xl bg-black border border-white/10 px-6 py-5 shadow-[inset_0_0_40px_rgba(245,200,66,0.06)]">
                <div className="text-[11px] font-bold tracking-[3px] uppercase text-white/50">{b.event}</div>
                <div className="font-mono font-bold text-yellow text-[40px] md:text-[44px] leading-none mt-2 tabular-nums [text-shadow:0_0_18px_rgba(245,200,66,0.45)]">
                  {b.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CAREER TIMELINE ══ */}
      <section className="px-6 md:px-16 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-8">Career on the clock</h2>

          {/* Desktop: along a track line */}
          <ol className="hidden lg:grid list-none relative" style={{ gridTemplateColumns: `repeat(${g.timeline.length}, minmax(0, 1fr))` }}>
            <span className="absolute left-0 right-0 top-[47px] h-[3px] rounded-full bg-gradient-to-r from-yellow/10 via-yellow/50 to-yellow/10" />
            {g.timeline.map((m, n) => (
              <li key={n} className="relative flex flex-col items-center text-center px-2">
                <div className="font-[family-name:var(--font-heading)] font-black text-[22px] tabular-nums text-white/90 h-[30px]">{m.year}</div>
                <div className="h-9 grid place-items-center relative z-10"><Marker kind={m.kind} size={24} /></div>
                <div className="text-[13px] leading-snug text-white/75 mt-3 max-w-[160px]">{m.label}</div>
              </li>
            ))}
          </ol>

          {/* Phones and tablets: down a track line */}
          <ol className="lg:hidden list-none relative pl-10">
            <span className="absolute left-[14px] top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-yellow/50 to-yellow/10" />
            {g.timeline.map((m, n) => (
              <li key={n} className="relative pb-6 last:pb-0">
                <span className="absolute -left-10 top-0.5 w-[31px] grid place-items-center"><Marker kind={m.kind} size={22} /></span>
                <div className="font-[family-name:var(--font-heading)] font-black text-[18px] tabular-nums">{m.year}</div>
                <div className="text-[15px] leading-snug text-white/75 mt-0.5">{m.label}</div>
              </li>
            ))}
          </ol>

          <ul className="list-none flex flex-wrap gap-x-5 gap-y-2 mt-8 text-[12px] text-white/50">
            {(["gold", "silver", "bronze", "win", "made"] as const).map((k) => (
              <li key={k} className="inline-flex items-center gap-2"><Marker kind={k} size={14} /> {MEDAL[k].label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ STORY ══ */}
      <section className="px-6 md:px-16 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-12">
          <article className="max-w-[700px]">
            <h2 className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-6">The story</h2>
            <div className="space-y-5">
              {g.bio.map((para, n) => (
                <p key={n} className="text-[16px] md:text-[17px] leading-[1.85] text-white/80">{para}</p>
              ))}
            </div>
          </article>
          <aside className="self-start rounded-2xl border border-yellow/30 bg-yellow/[0.04] p-7">
            <div className="font-[family-name:var(--font-heading)] text-2xl font-bold leading-tight">
              Run the same morning as {g.name.split(" ")[0]}.
            </div>
            <p className="text-[15px] text-white/70 leading-relaxed mt-3">
              The Gada Global 5K Peace Run, {EVENT.date}, at the {EVENT.location}.
            </p>
            <Link href="/register" className="mt-6 block text-center yellow-card rounded-xl px-5 py-3.5 font-bold text-[13px] tracking-wider uppercase no-underline hover:-translate-y-0.5 transition-all">
              Register
            </Link>
          </aside>
        </div>
      </section>

      {/* ══ PREV / NEXT ══ */}
      <nav className="px-6 md:px-16 lg:px-20 pb-16 border-t border-white/10 pt-10" aria-label="Other honorable guests">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-4">
          {[{ o: prev, label: "Previous guest" }, { o: next, label: "Next guest" }].map(({ o, label }) => (
            <Link key={label} href={`/guests/${o.slug}`} className="group flex items-center gap-4 rounded-2xl border border-white/10 hover:border-yellow/50 bg-white/[0.03] p-3 pr-5 no-underline transition-colors">
              <div className="relative w-[60px] h-[80px] shrink-0 rounded-md overflow-hidden">
                <Image src={o.image} alt="" fill unoptimized className="object-cover" sizes="60px" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-[3px] uppercase text-yellow">{label}</div>
                <div className="font-[family-name:var(--font-heading)] text-white text-xl font-black mt-1 truncate">{o.name}</div>
                <div className="text-[13px] text-white/55 truncate">{o.title}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="ml-auto shrink-0 text-white/40 group-hover:text-yellow group-hover:translate-x-1 transition-all" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
        <p className="max-w-6xl mx-auto text-[12px] text-white/40 mt-8">{GUEST_PHOTO_CREDIT}</p>
      </nav>
    </main>
  );
}
