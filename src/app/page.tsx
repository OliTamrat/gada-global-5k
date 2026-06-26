import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Particles } from "@/components/Particles";
import { HeroVideo } from "@/components/HeroVideo";
import { WordRotator } from "@/components/WordRotator";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InteractiveSchedule } from "@/components/InteractiveSchedule";

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
};

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
            <div className="hero-cta-enter flex flex-wrap gap-3">
              <Link href="/register" className="group no-underline">
                <div className="yellow-card rounded-xl px-5 py-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div><div className="text-[13px] font-black tracking-tight leading-tight">Register Now</div><div className="text-[10px] opacity-50">From $25</div></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-40 group-hover:opacity-70 transition-opacity"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
              <Link href="/shop" className="group no-underline">
                <div className="dark-card rounded-xl px-5 py-3 flex items-center gap-3 hover:-translate-y-0.5 hover:border-yellow/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.63l-.38 3.42L5 11v10h14V11l3.1-2.49-.38-3.42a2 2 0 00-1.34-1.63z"/></svg>
                  </div>
                  <div><div className="text-[13px] font-black tracking-tight text-white leading-tight">Buy Merch</div><div className="text-[10px] text-white/50">Tees &amp; Hoodies</div></div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-white/30 group-hover:text-white/60 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom dashboard */}
        <div className="relative z-20 px-6 md:px-16 lg:px-20 pb-6 mt-auto">
          <div className="pb-4">
            <div className="flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-white/50">
              <span className="text-white relative">Running<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-yellow" /></span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">Culture</span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">Community</span>
              <span className="hover:text-white/70 transition-colors cursor-pointer">Festival</span>
              <div className="ml-auto flex gap-3">
                <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 cursor-pointer hover:border-white/50 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></span>
                <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/50 cursor-pointer hover:border-white/50 transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
              </div>
            </div>
          </div>
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
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-red-oromo/20 flex items-center justify-center text-yellow">{Icons.bolt}</div><div><div className="text-sm font-bold text-white">Event Stats</div><div className="text-[10px] text-white/50">October 2026</div></div></div>
              <div className="flex items-end gap-1 h-12 mt-3">{[30,45,25,60,40,55,70,50,65,80,45,90].map((h, i) => (<div key={i} className={`flex-1 rounded-sm ${i === 11 ? 'bg-yellow' : 'bg-white/15'}`} style={{ height: `${h}%` }} />))}</div>
              <div className="flex items-baseline gap-1 mt-2"><span className="text-2xl font-black text-white">500</span><span className="text-xs text-white/50 font-medium">runners</span></div>
            </div>
            <div className="dark-card rounded-2xl p-6 flex flex-col min-h-[160px]">
              <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-green-deep/20 flex items-center justify-center text-green-light">{Icons.medal}</div><div><div className="text-sm font-bold text-white">Event Highlights</div><div className="text-[10px] text-white/50">3 Key Features</div></div></div>
              <div className="space-y-3 flex-1">
                {[{ badge: "5K", label: "Rock Creek Parkway", sub: "Washington, DC" },{ badge: "IRR", label: "Irrecha Celebration", sub: "Oct 3, 2026" },{ badge: "COM", label: "Community Festival", sub: "Music, Food, Dance" }].map((item) => (
                  <div key={item.label} className="flex items-center gap-3"><span className="w-8 h-5 rounded bg-yellow/15 text-yellow text-[9px] font-black flex items-center justify-center tracking-wider">{item.badge}</span><div className="flex-1 min-w-0"><div className="text-xs font-semibold text-white truncate">{item.label}</div><div className="text-[10px] text-white/45">{item.sub}</div></div></div>
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
              <img src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80" alt="Runners at sunrise" className="w-[78%] h-[88%] object-cover rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]" />
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" alt="Community celebration" className="absolute -bottom-4 right-0 w-[52%] h-[52%] object-cover rounded-2xl border-4 border-cream shadow-[0_16px_48px_rgba(0,0,0,0.1)]" />
              <div className="absolute top-6 right-8 yellow-card w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center font-black text-xl leading-none shadow-[0_8px_24px_rgba(245,200,66,0.3)]">5K<small className="text-[0.5rem] font-bold tracking-wider uppercase mt-0.5">Run/Walk</small></div>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">About the Event</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-6">Celebrating Oromo Heritage Through Movement</h2>
            <p className="text-[15px] leading-[1.85] text-charcoal/75 max-w-[520px] mb-10">
              The Gada Global 5K is more than a race &mdash; it&apos;s a celebration of the Oromo people&apos;s rich cultural heritage, timed with the annual <strong className="text-charcoal">Irrecha</strong> thanksgiving festival. Experience the power of community as we run together through one of Washington DC&apos;s most beautiful parkways.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Icons.leaf, title: "Irrecha Festival", desc: "Celebrating the Oromo thanksgiving to Waaqa at the water's edge" },
                { icon: Icons.trophy, title: "5K Run & Walk", desc: "Scenic route along Rock Creek for all fitness levels" },
                { icon: Icons.music, title: "Cultural Program", desc: "Live music, traditional dance, and Oromo cuisine" },
                { icon: Icons.users, title: "Community Unity", desc: "Bringing together the global Oromo diaspora" },
              ].map((card) => (
                <div key={card.title} className="p-5 rounded-2xl bg-white border border-black/5 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-yellow/15 flex items-center justify-center text-gold-dim mb-3">{card.icon}</div>
                  <h4 className="text-[13px] font-bold mb-1 tracking-tight">{card.title}</h4>
                  <p className="text-[12px] text-charcoal/60 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ OROMO ATHLETES LEGACY ══ */}
      <section className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">A Legacy of Champions</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">
              The Oromo Running Tradition
            </h2>
            <p className="text-[15px] leading-[1.85] text-white/75 max-w-[600px] mb-16">
              For decades, Oromo athletes have dominated the world stage in distance running, carrying the Ethiopian flag to Olympic glory. The Gada Global 5K honors this extraordinary legacy and inspires the next generation.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { name: "Abebe Bikila", achievement: "1960 & 1964 Olympic Marathon Gold", story: "The barefoot champion from Jato, Oromia who stunned the world in Rome and became the first African Olympic gold medalist in history.", year: "1960" },
              { name: "Derartu Tulu", achievement: "1992 & 2000 Olympic 10,000m Gold", story: "First Black African woman to win Olympic gold. Her victory lap with Elana Meyer became one of sport's most iconic moments of unity.", year: "1992" },
              { name: "Kenenisa Bekele", achievement: "3x Olympic Gold, 5K & 10K WR", story: "Born in Bekoji, Oromia. Widely regarded as the greatest distance runner ever with 17 World Championship and Olympic medals.", year: "2004" },
              { name: "Tirunesh Dibaba", achievement: "3x Olympic Gold, 5K & 10K", story: "The 'Baby Faced Destroyer' from Bekoji who dominated distance running and became Ethiopia's most decorated female Olympian.", year: "2008" },
            ].map((athlete) => (
              <ScrollReveal key={athlete.name}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-white/8 hover:border-yellow/15 transition-all h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold tracking-[3px] uppercase text-yellow/70">{athlete.year}</span>
                    <div className="w-8 h-8 rounded-full bg-yellow/10 flex items-center justify-center text-yellow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                    </div>
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight mb-1">{athlete.name}</h3>
                  <p className="text-[11px] text-yellow font-semibold tracking-wide mb-3">{athlete.achievement}</p>
                  <p className="text-[13px] text-white/65 leading-relaxed flex-1">{athlete.story}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-gradient-to-r from-yellow/10 via-yellow/5 to-transparent border border-yellow/15 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight mb-2">Continue the Legacy</h3>
                <p className="text-[14px] text-white/70 leading-relaxed max-w-[480px]">
                  From Abebe Bikila&apos;s barefoot marathon to today, Oromo runners have won 23 Olympic medals in distance events. The Gada Global 5K brings this spirit to Rock Creek Parkway &mdash; whether you&apos;re chasing a personal record or running your very first 5K.
                </p>
              </div>
              <Link href="/register" className="shrink-0 yellow-card px-8 py-3.5 rounded-xl font-bold text-[13px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                Join the Race
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ DC LANDMARKS — THE COURSE ══ */}
      <section className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">The Course</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4">Run Through the Heart of DC</h2>
            <p className="text-[15px] leading-[1.85] text-charcoal/70 max-w-[520px] mx-auto">
              Rock Creek Parkway winds through Washington DC&apos;s most beautiful green corridor, connecting iconic landmarks along the way.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { img: "https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=600&q=80", title: "Rock Creek Park", desc: "1,754 acres of forested trails, meadows, and creek crossings. The race follows the paved parkway through the heart of this urban wilderness.", stat: "1,754 acres" },
              { img: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&q=80", title: "Washington Monument", desc: "The iconic 555-foot obelisk stands as a beacon visible from the course. Runners pass through parkland just miles from this national treasure.", stat: "555 ft tall" },
              { img: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600&q=80", title: "Lincoln Memorial", desc: "Abraham Lincoln\u2019s memorial sits at the western end of the National Mall, a short distance from where Rock Creek meets the Potomac River.", stat: "Est. 1922" },
            ].map((landmark) => (
              <ScrollReveal key={landmark.title}>
                <div className="rounded-2xl overflow-hidden bg-white border border-charcoal/5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
                  <div className="h-[200px] relative overflow-hidden">
                    <img src={landmark.img} alt={landmark.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-3 right-3 bg-charcoal/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">{landmark.stat}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-[15px] font-bold tracking-tight mb-2">{landmark.title}</h3>
                    <p className="text-[13px] text-charcoal/65 leading-relaxed">{landmark.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-charcoal rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="flex gap-8 shrink-0">
                {[{ val: "5K", label: "Distance" }, { val: "45m", label: "Elevation" }, { val: "Paved", label: "Surface" }].map((s) => (
                  <div key={s.label} className="text-center"><div className="text-2xl font-black text-yellow tracking-tight">{s.val}</div><div className="text-[10px] font-semibold text-white/50 tracking-wider uppercase">{s.label}</div></div>
                ))}
              </div>
              <div className="flex-1 md:border-l md:border-white/10 md:pl-8">
                <p className="text-[14px] text-white/70 leading-relaxed">The course follows Rock Creek Parkway from the Nature Center south through the park, finishing near the Kennedy Center. Flat to gently rolling terrain, fully paved, with water stations at miles 1 and 2.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ EVENT DETAILS — World Marathon style ══ */}
      <section id="event" className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Event Details</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">Race Day at a Glance</h2>
            <p className="text-[15px] leading-[1.85] text-white/70 max-w-[540px] mb-16">Everything you need to know about the Gada Global 5K experience.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden mb-16">
              <div className="min-h-[480px] md:min-h-[560px] flex" style={{ background: `linear-gradient(to right, rgba(20,18,16,0.75) 0%, rgba(20,18,16,0.3) 60%, transparent 100%), url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat` }}>
                <div className="flex-1 p-8 md:p-14 flex flex-col justify-end">
                  <div className="text-[10px] font-bold tracking-[4px] uppercase text-yellow/80 mb-3">01.</div>
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight mb-3">Rock Creek<br />Parkway</h3>
                  <p className="text-[14px] text-white/70 max-w-[320px] leading-relaxed mb-8">Washington DC&apos;s most scenic running route. A paved, gently rolling course through lush parkland along the historic creek.</p>
                  <div className="flex gap-10">
                    {[{ val: "60-72", unit: "\u00B0F", label: "Temperature" }, { val: "7:30", unit: "AM", label: "Start Time" }, { val: "45", unit: "M", label: "Elevation" }].map((s) => (
                      <div key={s.label}><div className="text-2xl md:text-3xl font-black tracking-tight">{s.val}<span className="text-base align-top ml-0.5">{s.unit}</span></div><div className="text-[10px] font-semibold tracking-[3px] uppercase text-yellow/80 mt-1">{s.label}</div></div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:flex flex-col justify-center items-end pr-14 gap-2">
                  {["WASHINGTON", "ROCK CREEK", "PARKWAY", "GEORGETOWN", "DUPONT"].map((city, i) => (
                    <span key={city} className={`font-[family-name:var(--font-heading)] font-bold tracking-tight transition-all ${i === 0 ? "text-5xl lg:text-6xl text-yellow" : "text-3xl lg:text-4xl text-white/20 hover:text-white/40"}`}>{city}</span>
                  ))}
                </div>
              </div>
              <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 560" fill="none"><path d="M600 50 C650 120, 750 180, 700 280 S620 380, 680 450 S780 500, 850 480" stroke="#F5C842" strokeWidth="2" strokeDasharray="8 6" fill="none"/></svg>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Icons.clock, label: "Start Time", value: "7:30 AM ET" },
                { icon: Icons.sprout, label: "Terrain", value: "Paved, Flat" },
                { icon: Icons.users, label: "Capacity", value: "500 Runners" },
                { icon: Icons.trophy, label: "Awards", value: "Top 3 M/F" },
                { icon: Icons.mapPin, label: "Location", value: "Rock Creek, DC" },
              ].map((item) => (
                <div key={item.label} className="dark-card rounded-2xl p-5 hover:-translate-y-1 transition-all">
                  <div className="text-yellow mb-3">{item.icon}</div>
                  <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ INTERACTIVE SCHEDULE ══ */}
      <section id="schedule" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <InteractiveSchedule />
      </section>

      {/* ══ CULTURE BANNER ══ */}
      <section className="text-white text-center py-24 md:py-32 px-6 md:px-16 lg:px-20" style={{ background: `linear-gradient(135deg, rgba(27,94,32,0.92), rgba(13,59,15,0.95)), url('https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=1600&q=80') center/cover` }}>
        <ScrollReveal>
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-light mb-5 block">Irrecha &amp; Oromo Heritage</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white max-w-[600px] mx-auto mb-5 tracking-tight">More Than a Race,<br />It&apos;s a Celebration</h2>
          <p className="text-[15px] leading-[1.85] text-white/75 max-w-[500px] mx-auto mb-14">Irrecha is the Oromo people&apos;s thanksgiving festival, honoring Waaqa (God) and the renewal of life.</p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[920px] mx-auto">
            {[
              { icon: Icons.tree, title: "The Odaa Tree", desc: "Sacred symbol of the Gada system \u2014 democratic governance, one of Africa\u2019s oldest traditions." },
              { icon: Icons.droplet, title: "Water Blessing", desc: "Thanksgiving at the water\u2019s edge, symbolizing renewal, peace, and harmony with nature." },
              { icon: Icons.globe, title: "Global Diaspora", desc: "Connecting Oromo communities worldwide through sport, culture, and shared identity." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-3xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/12 transition-colors">
                <div className="text-yellow mb-5">{item.icon}</div>
                <h4 className="text-[15px] font-bold mb-2 tracking-tight">{item.title}</h4>
                <p className="text-[13px] text-white/65 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══ COMMUNITY — ALL ARE WELCOME ══ */}
      <section className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Everyone is Welcome</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-5">
              One Race, Every Community
            </h2>
            <p className="text-[15px] leading-[1.85] text-charcoal/75 max-w-[560px] mx-auto">
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
                  <h4 className="font-[family-name:var(--font-heading)] text-[15px] font-bold mb-2 tracking-tight">{item.title}</h4>
                  <p className="text-[13px] text-charcoal/65 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="bg-charcoal rounded-2xl p-8 md:p-10 text-white text-center">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight mb-3">Bring Your Crew</h3>
              <p className="text-[14px] text-white/70 leading-relaxed max-w-[520px] mx-auto mb-6">
                Group registration discounts available for teams of 10+. Running clubs, church groups, corporate teams, and school organizations are all welcome. The post-race Irrecha festival is free and open to spectators &mdash; bring your family and friends.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register" className="yellow-card px-8 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                  Register Your Team
                </Link>
                <a href="mailto:info@gadaglobal5k.com" className="bg-white/8 text-white px-8 py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase border border-white/12 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
                  Partnership Inquiry
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-20 text-center">
        <ScrollReveal>
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Join the Movement</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-5 max-w-[500px] mx-auto tracking-tight">Secure Your Spot Today</h2>
          <p className="text-[15px] leading-[1.85] text-white/70 max-w-[440px] mx-auto mb-10">Registration includes bib, timing chip, finisher medal, and official race t-shirt. Limited to 500 runners.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="inline-flex items-center gap-3 bg-yellow text-charcoal px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(245,200,66,0.25)] hover:-translate-y-0.5 transition-all no-underline">Register for 5K</Link>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-white/8 text-white px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl border border-white/12 hover:border-yellow/40 hover:text-yellow hover:-translate-y-0.5 transition-all no-underline">Shop Merch</Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
