import Link from "next/link";
import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import { Particles } from "@/components/Particles";
import { HeroVideo } from "@/components/HeroVideo";
import { WordRotator } from "@/components/WordRotator";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InteractiveSchedule } from "@/components/InteractiveSchedule";
import { FAQ } from "@/components/FAQ";

const Icons = {
  barChart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M6 20V4M18 20v-6"/></svg>,
  activity: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  bolt: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  medal: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  leaf: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 2 20 2s-1.2 5-4.5 9.5"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  trophy: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V4h4M18 9h2a2 2 0 002-2V4h-4M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-0.85-3.25-2.03-3.79A1.06 1.06 0 0114 17v-2.34"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg>,
  music: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  sprout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M10 20c5.5-2.5 8-7 8-14H6c0 7 2.5 11.5 8 14z"/></svg>,
  mapPin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  tree: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-7M17 8l-5-6-5 6h3v4h4V8z"/><path d="M19 14l-7-8-7 8h5v3h4v-3z"/></svg>,
  droplet: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  globe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  shirt: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.63l-.38 3.42L5 11v10h14V11l3.1-2.49-.38-3.42a2 2 0 00-1.34-1.63z"/></svg>,
  timer: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/></svg>,
  tag: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
};

const eventPortfolio = [
  { badge: "FLAGSHIP", title: "Gada Global Special Run (5K & 10K)", desc: "Our flagship annual race celebrating Oromo heritage and community unity. October 3, 2026 at the Rock Creek Park Tennis Center, DC.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8L12 14l5.5-6M12 14v8"/></svg> },
  { badge: "FAMILY", title: "Family Fun Run & Kids Dash", desc: "A family-focused community event designed to get kids active and families moving together in a fun, non-competitive environment.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { badge: "CORPORATE", title: "Corporate Wellness Challenge", desc: "Teams from companies compete while promoting workplace wellness. A great team-building experience that supports employee health.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { badge: "UNITY", title: "Unity Run", desc: "Celebrating diversity and bringing communities together through running. Open to all backgrounds, abilities, and experience levels.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { badge: "WOMEN", title: "Women Empowerment Run", desc: "Supporting women's health, leadership, and empowerment through a dedicated running event that uplifts and inspires.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { badge: "CHARITY", title: "Charity Run for Education & Health", desc: "Raising funds for community causes. Every mile run contributes to education and health initiatives that make a real difference.", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
];

// Podium tiers. Metallic gradients rather than flat brand yellow, so first,
// second, and third read as gold, silver, and bronze at a glance.
const podium = [
  {
    n: "1",
    place: "1st",
    label: "First Place",
    metalName: "Gold",
    amount: "$300",
    metal: "linear-gradient(145deg,#F7DE7A 0%,#E8B930 45%,#C49B20 100%)",
    accent: "#F5D245",
    rowBg: "linear-gradient(90deg,rgba(232,185,48,0.20) 0%,rgba(232,185,48,0.05) 100%)",
    rowBorder: "rgba(232,185,48,0.45)",
  },
  {
    n: "2",
    place: "2nd",
    label: "Second Place",
    metalName: "Silver",
    amount: "$200",
    metal: "linear-gradient(145deg,#F2F4F7 0%,#C9CDD4 45%,#9AA1AA 100%)",
    accent: "#DDE2E8",
    rowBg: "linear-gradient(90deg,rgba(221,226,232,0.14) 0%,rgba(221,226,232,0.03) 100%)",
    rowBorder: "rgba(221,226,232,0.30)",
  },
  {
    n: "3",
    place: "3rd",
    label: "Third Place",
    metalName: "Bronze",
    amount: "$100",
    metal: "linear-gradient(145deg,#E8B183 0%,#C4763A 45%,#96552A 100%)",
    accent: "#E0A070",
    rowBg: "linear-gradient(90deg,rgba(196,118,58,0.18) 0%,rgba(196,118,58,0.04) 100%)",
    rowBorder: "rgba(196,118,58,0.38)",
  },
];

export default function Home() {
  return (
    <main>
      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <HeroVideo />
        <Particles />
        <div className="relative z-10 flex-1 flex items-center px-6 md:px-16 lg:px-20 pt-24">
          <div className="max-w-[780px]">
            <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2.8rem,5.5vw,4.8rem)] font-bold leading-[1.08] text-white mb-10 tracking-tight">
              <span className="block hero-line">Let&apos;s celebrate</span>
              <span className="block hero-line"><span className="text-yellow">Oromo</span> heritage</span>
              <span className="block hero-line">
                through{" "}
                <WordRotator words={["running.", "unity.", "movement."]} holdDuration={2800} className="text-yellow hero-accent min-w-[200px]" />
              </span>
            </h1>
            <div className="hero-cta-enter grid grid-cols-2 sm:flex sm:flex-wrap gap-3 max-w-[400px] sm:max-w-none">
              <Link href="/register" className="group no-underline">
                <div className="yellow-card rounded-xl px-5 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all h-full">
                  <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div className="flex-1 min-w-0"><div className="text-[14px] font-black tracking-tight leading-tight">Register Now</div><div className="text-[11px] opacity-50">From $25</div></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-70 transition-opacity shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
              <Link href="/shop" className="group no-underline">
                <div className="dark-card rounded-xl px-5 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:border-yellow/20 transition-all h-full">
                  <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.63l-.38 3.42L5 11v10h14V11l3.1-2.49-.38-3.42a2 2 0 00-1.34-1.63z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0"><div className="text-[14px] font-black tracking-tight text-white leading-tight">Buy Merch</div><div className="text-[11px] text-white/78">Tees &amp; Hoodies</div></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/65 group-hover:text-white/85 transition-colors shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom stats — clean grid, no fake nav */}
        <div className="relative z-20 px-6 md:px-16 lg:px-20 pb-6 mt-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="yellow-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-charcoal">{Icons.barChart}</div>
              <div><div className="text-xs font-semibold opacity-70 mb-1">Race Distance</div><div className="text-4xl font-black tracking-tight">5K</div><div className="text-xs font-semibold opacity-60 mt-0.5">3.1 Miles</div></div>
            </div>
            <div className="yellow-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-yellow">{Icons.activity}</div>
              <div><div className="text-xs font-semibold opacity-70 mb-1">Elevation Gain</div><div className="text-4xl font-black tracking-tight">45<span className="text-lg font-bold ml-0.5">m</span></div><div className="text-xs font-semibold opacity-60 mt-0.5">Gentle Route</div></div>
            </div>
            <div className="dark-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-red-oromo/20 flex items-center justify-center text-yellow">{Icons.bolt}</div><div><div className="text-sm font-bold text-white">Event Stats</div><div className="text-[12px] text-white/78">October 2026</div></div></div>
              <div className="flex items-end gap-1 h-12 mt-3">{[30,45,25,60,40,55,70,50,65,80,45,90].map((h, i) => (<div key={i} className={`flex-1 rounded-sm ${i === 11 ? 'bg-yellow' : 'bg-white/15'}`} style={{ height: `${h}%` }} />))}</div>
              <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-black text-white">500</span><span className="text-xs text-white/78 font-medium">runners</span></div>
            </div>
            <div className="dark-card rounded-2xl p-6 flex flex-col min-h-[160px]">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-green-deep/20 flex items-center justify-center text-green-light">{Icons.medal}</div><div><div className="text-sm font-bold text-white">Event Highlights</div><div className="text-[12px] text-white/78">3 Key Features</div></div></div>
              <div className="space-y-3 flex-1">
                {[{ badge: "5K", label: "Rock Creek Tennis Center", sub: "Washington, DC" },{ badge: "IRR", label: "Irrecha Celebration", sub: "Oct 3, 2026" },{ badge: "COM", label: "Community Festival", sub: "Music, Food, Dance" }].map((item) => (
                  <div key={item.label} className="flex items-center gap-3"><span className="w-8 h-5 rounded bg-yellow/15 text-yellow text-[11px] font-black flex items-center justify-center tracking-wider">{item.badge}</span><div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white truncate">{item.label}</div><div className="text-[12px] text-white/75">{item.sub}</div></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COUNTDOWN ══ */}
      <section className="relative z-10 -mt-1"><Countdown /></section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative h-[380px] md:h-[520px]">
              <Image src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80" alt="Runners at sunrise" width={480} height={460} className="w-[78%] h-[88%] object-cover rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]" />
              <Image src="/images/finisher-medal.jpg" alt="Gada 5K Run finisher medal" width={240} height={320} className="absolute -bottom-4 right-0 w-[48%] h-[70%] object-contain bg-black rounded-2xl border-4 border-cream shadow-[0_16px_48px_rgba(0,0,0,0.15)] p-2" />
              <div className="absolute top-6 right-8 yellow-card w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center font-black text-xl leading-none shadow-[0_8px_24px_rgba(245,200,66,0.3)]">5K<small className="text-[0.5rem] font-bold tracking-wider uppercase mt-0.5">Run/Walk</small></div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">About the Event</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-6">Celebrating Oromo Heritage Through Movement</h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-charcoal/88 max-w-[520px] mb-10">
              The Gada Global 5K is more than a race &mdash; it&apos;s a celebration of the Oromo people&apos;s rich cultural heritage, timed with the annual <strong className="text-charcoal">Irrecha</strong> thanksgiving festival. Experience the power of community as we run together through one of Washington DC&apos;s most beautiful parkways.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Icons.leaf, title: "Irrecha Festival", desc: "Celebrating the Oromo thanksgiving to Waaqa at the water\u2019s edge" },
                { icon: Icons.trophy, title: "5K Run & Walk", desc: "Scenic route through Rock Creek Park for all fitness levels" },
                { icon: Icons.music, title: "Cultural Program", desc: "Live music, traditional dance, and Oromo cuisine" },
                { icon: Icons.users, title: "Community Unity", desc: "Bringing together the global Oromo diaspora" },
              ].map((card) => (
                <div key={card.title} className="p-5 rounded-2xl bg-white border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-yellow/15 flex items-center justify-center text-gold-dim mb-3">{card.icon}</div>
                  <h4 className="text-[16px] md:text-[15px] font-bold mb-1 tracking-tight">{card.title}</h4>
                  <p className="text-[16px] md:text-[14px] text-charcoal/78 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ WHAT'S INCLUDED ══ */}
      <section className="bg-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Registration Package</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">
              What&apos;s Included
            </h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-white/85 max-w-[480px] mx-auto">
              Every registered runner receives a complete race day package.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Icons.tag,
                title: "Race Bib & Number",
                desc: "Personalized bib with your name and unique race number",
                visual: (
                  <div className="h-[140px] rounded-xl bg-gradient-to-br from-yellow/15 to-yellow/5 border border-yellow/20 flex items-center justify-center mb-5 px-3">
                    {/* Race bib: pin holes at the corners, event band, dominant
                        number, and a perforated tear-off strip for the chip. */}
                    <div className="relative w-full max-w-[172px] bg-white rounded-[5px] shadow-[0_6px_18px_rgba(0,0,0,0.28)] rotate-[-1.5deg] overflow-hidden">
                      {/* pin holes */}
                      <span className="absolute top-[5px] left-[6px] w-[5px] h-[5px] rounded-full bg-charcoal/15 ring-1 ring-charcoal/10" />
                      <span className="absolute top-[5px] right-[6px] w-[5px] h-[5px] rounded-full bg-charcoal/15 ring-1 ring-charcoal/10" />
                      <span className="absolute bottom-[24px] left-[6px] w-[5px] h-[5px] rounded-full bg-charcoal/15 ring-1 ring-charcoal/10" />
                      <span className="absolute bottom-[24px] right-[6px] w-[5px] h-[5px] rounded-full bg-charcoal/15 ring-1 ring-charcoal/10" />

                      {/* event band */}
                      <div className="bg-charcoal px-2 pt-[7px] pb-[5px] text-center">
                        <div className="text-[7px] font-black tracking-[2.5px] uppercase text-yellow leading-none">
                          Gada Global 5K
                        </div>
                        <div className="text-[6px] font-semibold tracking-[1.2px] uppercase text-white/55 leading-none mt-[3px]">
                          Oct 3, 2026 &bull; Washington DC
                        </div>
                      </div>

                      {/* number */}
                      <div className="px-2 pt-[6px] pb-[5px] text-center">
                        <div className="text-[38px] leading-[0.88] font-black text-charcoal tracking-[-0.02em] tabular-nums">
                          0217
                        </div>
                      </div>

                      {/* perforated tear strip */}
                      <div className="border-t border-dashed border-charcoal/25 bg-charcoal/[0.04] px-2 py-[4px] flex items-center justify-between">
                        <span className="text-[6px] font-bold tracking-[1px] uppercase text-charcoal/50">
                          Timing Chip
                        </span>
                        <span className="flex gap-[2px]" aria-hidden="true">
                          {[3, 2, 4, 2, 3, 5, 2].map((w, i) => (
                            <span
                              key={i}
                              className="block h-[7px] bg-charcoal/45"
                              style={{ width: `${w * 0.6}px` }}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                icon: Icons.medal,
                title: "Finisher Medal",
                desc: "Custom Gada 5K medal celebrating heritage and Irrecha",
                visual: (
                  <div className="h-[140px] rounded-xl overflow-hidden mb-5 relative bg-gradient-to-br from-yellow/10 to-charcoal-light">
                    <Image src="/images/finisher-medal.jpg" alt="Finisher medal" fill className="object-contain p-4 drop-shadow-[0_4px_12px_rgba(245,200,66,0.3)]" />
                  </div>
                ),
              },
              {
                icon: Icons.shirt,
                title: "Official Race Tee",
                desc: "Limited-edition heritage design with Oromo artwork",
                visual: (
                  <div className="h-[140px] rounded-xl overflow-hidden mb-5 relative bg-gradient-to-br from-white/5 to-transparent">
                    <Image src="/products/heritage-tee.jpg" alt="Race tee" fill className="object-contain object-center p-2" />
                  </div>
                ),
              },
              {
                icon: Icons.timer,
                title: "Live Race Timing",
                desc: "Track your pace and splits in real-time via our race day app",
                visual: (
                  <div className="h-[140px] rounded-xl bg-yellow/10 border border-yellow/20 flex items-center justify-center mb-5">
                    <div className="text-center">
                      <div className="text-2xl font-black text-yellow tracking-tight font-[family-name:var(--font-heading)]">27:42</div>
                      <div className="text-[11px] font-bold text-white/72 tracking-wider uppercase mt-1">Live Split</div>
                      <div className="flex gap-3 mt-2 justify-center">
                        <div className="text-[11px] text-white/65"><span className="text-white/85 font-bold">Mile 1</span> 8:52</div>
                        <div className="text-[11px] text-white/65"><span className="text-white/85 font-bold">Mile 2</span> 9:15</div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="dark-card rounded-2xl p-5 h-full">
                  {item.visual}
                  <div className="text-yellow mb-3">{item.icon}</div>
                  <h4 className="text-[16px] md:text-[15px] font-bold text-white mb-1.5 tracking-tight">{item.title}</h4>
                  <p className="text-[16px] md:text-[14px] text-white/78 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link href="/register" className="inline-flex items-center gap-3 yellow-card px-10 py-4 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                Register Now &mdash; From $25
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ OUR EVENTS — BEYOND THE 5K ══ */}
      <section className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Beyond the 5K</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-5">
              Our Event Portfolio
            </h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-charcoal/85 max-w-[560px] mx-auto">
              The Gada Global 5K is just the beginning. Gada Global Run organizes events that bring people together and promote healthy living across all communities.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {eventPortfolio.map((ev, i) => (
              <ScrollReveal key={ev.title}>
                <div className={`rounded-2xl p-6 h-full hover:-translate-y-1 transition-all ${i === 0 ? 'yellow-card' : 'bg-white border border-charcoal/5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${i === 0 ? 'bg-charcoal text-yellow' : 'bg-yellow/12 text-gold-dim'}`}>
                    {ev.icon}
                  </div>
                  <span className={`inline-block text-[11px] font-black tracking-[2px] uppercase px-2.5 py-1 rounded-md mb-3 ${i === 0 ? 'bg-charcoal/15 text-charcoal' : 'bg-yellow/10 text-gold-dim'}`}>{ev.badge}</span>
                  <h4 className="font-[family-name:var(--font-heading)] text-[16px] font-bold mb-2 tracking-tight">{ev.title}</h4>
                  <p className="text-[16px] md:text-[14px] text-charcoal/78 leading-relaxed">{ev.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-charcoal rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 text-white">
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight mb-2">Start With the 5K</h3>
                <p className="text-[16px] md:text-[15px] text-white/90 leading-relaxed max-w-[480px]">
                  The inaugural Gada Global 5K on October 3, 2026 launches our mission. Whether you&apos;re chasing a personal record or running your very first race, this is where it begins.
                </p>
              </div>
              <Link href="/register" className="shrink-0 yellow-card px-8 py-3.5 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                Register Now
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ PRIZE MONEY ══ */}
      <section className="bg-green-deep py-24 md:py-32 px-6 md:px-16 lg:px-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.09]"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, #E8B930 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-12">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Cash Awards</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white tracking-tight mb-5">
              <span className="text-yellow">$1,200</span> in Prize Money
            </h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-white/90 max-w-[560px] mx-auto mb-7">
              Cash awards for the top three finishers in both the men&apos;s and women&apos;s divisions, presented at the 10:00 AM awards ceremony.
            </p>
            <div className="inline-flex items-center gap-5 rounded-full border border-yellow/30 bg-yellow/8 px-7 py-3">
              {[
                { v: "6", l: "Winners paid" },
                { v: "2", l: "Divisions" },
                { v: "$300", l: "Top prize" },
              ].map((s, i) => (
                <div key={s.l} className="flex items-center gap-5">
                  {i > 0 && <span className="w-px h-7 bg-white/15" />}
                  <div className="text-center">
                    <div className="text-[17px] font-black text-yellow leading-none tabular-nums">{s.v}</div>
                    <div className="text-[11px] font-semibold tracking-[1px] uppercase text-white/65 mt-1">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 max-w-[940px] mx-auto">
            {[
              { division: "Men", label: "Dhiira" },
              { division: "Women", label: "Dubartii" },
            ].map((div) => (
              <ScrollReveal key={div.division}>
                <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.12] to-white/[0.03] border border-white/15 p-7 md:p-8 h-full overflow-hidden">
                  {/* Division header */}
                  <div className="flex items-center gap-3 mb-7">
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white tracking-tight">{div.division}</h3>
                    <span className="text-[13px] font-semibold text-yellow/90 tracking-wide">{div.label}</span>
                    <span className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent ml-1" />
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {podium.map((p) => (
                      <div
                        key={p.place}
                        className="relative flex items-center gap-4 rounded-2xl px-5 py-4 border transition-transform hover:-translate-y-0.5"
                        style={{ background: p.rowBg, borderColor: p.rowBorder }}
                      >
                        {/* Medal disc */}
                        <span
                          className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                          style={{ background: p.metal }}
                        >
                          <span
                            className="absolute inset-[3px] rounded-full border"
                            style={{ borderColor: "rgba(255,255,255,0.35)" }}
                          />
                          <span className="relative text-[15px] font-black text-charcoal leading-none">{p.n}</span>
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-bold text-white leading-tight whitespace-nowrap">{p.label}</div>
                          <div className="text-[12px] font-semibold tracking-[1.5px] uppercase mt-0.5" style={{ color: p.accent }}>
                            {p.metalName}
                          </div>
                        </div>

                        <span
                          className="text-[23px] md:text-[28px] font-black tracking-tight tabular-nums leading-none shrink-0"
                          style={{ color: p.accent }}
                        >
                          {p.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-baseline justify-between">
                    <span className="text-[12px] font-bold tracking-[2px] uppercase text-white/60">Division total</span>
                    <span className="text-[17px] font-black text-white tabular-nums">$600</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <p className="text-center text-[14px] text-white/78 mt-9 max-w-[560px] mx-auto leading-relaxed">
              Age group awards and finisher medals are presented alongside the cash prizes. Every participant receives a medal.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ DC LANDMARKS — THE COURSE ══ */}
      <section className="bg-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">The Course</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">Run Through the Heart of DC</h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-white/85 max-w-[520px] mx-auto">
              The race starts and finishes at the Rock Creek Park Tennis Center, set inside Washington DC&apos;s largest stretch of urban wilderness.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[
              { img: "/images/course/rock-creek.jpg", title: "Rock Creek Park", desc: "1,754 acres of forested trails, meadows, and creek crossings. The start and finish sit at the Tennis Center on 16th Street NW, in the heart of the park.", stat: "1,754 acres" },
              { img: "/images/course/washington-monument.jpg", title: "The Nation\u2019s Capital", desc: "Rock Creek Park runs north to south through Washington DC, linking the neighborhoods above the start line to the monuments a few miles downstream.", stat: "Washington, DC" },
            ].map((landmark) => (
              <ScrollReveal key={landmark.title}>
                <div className="rounded-2xl overflow-hidden dark-card hover:-translate-y-1 hover:border-yellow/15 transition-all">
                  <div className="h-[220px] relative overflow-hidden">
                    <Image src={landmark.img} alt={landmark.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-3 right-3 bg-charcoal/80 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1.5 rounded-lg">{landmark.stat}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-[16px] font-bold tracking-tight mb-2 text-white">{landmark.title}</h3>
                    <p className="text-[16px] md:text-[14px] text-white/82 leading-relaxed">{landmark.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="dark-card rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex gap-8 shrink-0">
                {[{ val: "5K", label: "Distance" }, { val: "45m", label: "Elevation" }, { val: "Paved", label: "Surface" }].map((s) => (
                  <div key={s.label} className="text-center"><div className="text-2xl font-black text-yellow tracking-tight">{s.val}</div><div className="text-[12px] font-semibold text-white/78 tracking-wider uppercase">{s.label}</div></div>
                ))}
              </div>
              <div className="flex-1 md:border-l md:border-white/10 md:pl-8">
                <p className="text-[16px] md:text-[15px] text-white/88 leading-relaxed">The course starts and finishes at the Rock Creek Park Tennis Center, 5220 16th St NW, looping through the surrounding park roads and trails. Flat to gently rolling terrain, fully paved, with water stations at miles 1 and 2.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <FAQ />

      {/* ══ INTERACTIVE SCHEDULE ══ */}
      <section id="event" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <InteractiveSchedule />
      </section>

      {/* ══ CULTURE BANNER ══ */}
      <section className="text-white text-center py-24 md:py-32 px-6 md:px-16 lg:px-20" style={{ background: `linear-gradient(135deg, rgba(27,94,32,0.92), rgba(13,59,15,0.95)), url('https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=1600&q=80') center/cover` }}>
        <ScrollReveal>
          <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-light mb-5 block">Irrecha &amp; Oromo Heritage</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white max-w-[600px] mx-auto mb-5 tracking-tight">More Than a Race,<br />It&apos;s a Celebration</h2>
          <p className="text-base md:text-[16px] leading-[1.85] text-white/92 max-w-[500px] mx-auto mb-14">Irrecha is the Oromo people&apos;s thanksgiving festival, honoring Waaqa (God) and the renewal of life.</p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[920px] mx-auto">
            {[
              { icon: Icons.tree, title: "The Odaa Tree", desc: "Sacred symbol of the Gada system \u2014 democratic governance, one of Africa\u2019s oldest traditions." },
              { icon: Icons.droplet, title: "Water Blessing", desc: "Thanksgiving at the water\u2019s edge, symbolizing renewal, peace, and harmony with nature." },
              { icon: Icons.globe, title: "Global Diaspora", desc: "Connecting Oromo communities worldwide through sport, culture, and shared identity." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/12 transition-colors">
                <div className="text-yellow mb-5">{item.icon}</div>
                <h4 className="text-base md:text-[16px] font-bold mb-2 tracking-tight">{item.title}</h4>
                <p className="text-[16px] md:text-[14px] text-white/88 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══ COMMUNITY — ALL ARE WELCOME ══ */}
      <section className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Everyone is Welcome</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-5">
              One Race, Every Community
            </h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-charcoal/85 max-w-[560px] mx-auto">
              The Gada Global 5K is open to all runners, walkers, and supporters regardless of background. While we celebrate Oromo heritage, this event is designed to bring together the full diversity of Washington DC &mdash; because running has no borders.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
                title: "DC Running Community",
                desc: "Partner with local running clubs like DC Road Runners, Pacers, and Georgetown Running Company to bring experienced runners of all backgrounds to the course."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
                title: "Local Neighborhoods",
                desc: "Engage Adams Morgan, Columbia Heights, Dupont Circle, and Georgetown communities through flyers, local business partnerships, and neighborhood outreach."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                title: "Schools & Universities",
                desc: "Invite cross-country teams and student organizations from Howard University, Georgetown, GW, and local high schools. Student discount registration available."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
                title: "African Diaspora Communities",
                desc: "Connect with Ethiopian, Eritrean, Somali, Kenyan, and broader African community organizations across the DMV area for cross-cultural participation."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8M12 17v4"/></svg>,
                title: "Social Media & Influencers",
                desc: "Partner with DC fitness influencers, running bloggers, and community pages across Instagram, TikTok, and Facebook to reach 50,000+ local followers."
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
                title: "Corporate & Charity Partners",
                desc: "Offer corporate team registration packages and partner with local nonprofits. Companies can sponsor bibs, water stations, or the cultural festival stage."
              },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="bg-white rounded-2xl p-6 border border-charcoal/5 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all h-full">
                  <div className="w-12 h-12 rounded-xl bg-yellow/12 flex items-center justify-center text-gold-dim mb-4">{item.icon}</div>
                  <h4 className="font-[family-name:var(--font-heading)] text-base md:text-[16px] font-bold mb-2 tracking-tight">{item.title}</h4>
                  <p className="text-[16px] md:text-[14px] text-charcoal/78 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-charcoal rounded-2xl p-8 md:p-10 text-white">
              <div className="text-center mb-8">
                <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-3 block">Partner With Us</span>
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight mb-3">Become a Sponsor</h3>
                <p className="text-[16px] md:text-[15px] text-white/82 leading-relaxed max-w-[520px] mx-auto">
                  Connect with thousands of participants while demonstrating your commitment to health, diversity, and community development.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                {[
                  { tier: "Title Sponsor", style: "yellow-card text-charcoal" },
                  { tier: "Platinum", style: "bg-white/10 border border-white/20 text-white" },
                  { tier: "Gold", style: "bg-yellow/15 border border-yellow/25 text-yellow" },
                  { tier: "Silver", style: "bg-white/5 border border-white/10 text-white/90" },
                  { tier: "Community Partner", style: "bg-green-deep/30 border border-green-light/20 text-green-light" },
                ].map((s) => (
                  <div key={s.tier} className={`${s.style} rounded-xl py-4 px-3 text-center font-bold text-[14px] tracking-tight`}>
                    {s.tier}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register" className="yellow-card px-8 py-3 rounded-xl font-bold text-[14px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                  Register Your Team
                </Link>
                <a href="mailto:info@gadaglobalrun.com" className="bg-white/8 text-white px-8 py-3 rounded-xl font-bold text-[14px] tracking-wider uppercase border border-white/12 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
                  Sponsorship Inquiry
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-24 md:py-32 px-6 md:px-16 lg:px-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal" />
        <div className="absolute inset-0 opacity-10" style={{ background: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat` }} />
        <div className="relative z-10">
          <ScrollReveal>
            <span className="text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Join the Movement</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-5 max-w-[500px] mx-auto tracking-tight">Secure Your Spot Today</h2>
            <p className="text-base md:text-[16px] leading-[1.85] text-white/88 max-w-[440px] mx-auto mb-10">Registration includes bib, timing chip, finisher medal, and official race t-shirt. Limited to 500 runners.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/register" className="inline-flex items-center gap-3 bg-yellow text-charcoal px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(245,200,66,0.25)] hover:-translate-y-0.5 transition-all no-underline">Register for 5K</Link>
              <Link href="/shop" className="inline-flex items-center gap-3 bg-white/8 text-white px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl border border-white/12 hover:border-yellow/40 hover:text-yellow hover:-translate-y-0.5 transition-all no-underline">Shop Merch</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
