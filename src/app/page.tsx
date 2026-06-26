import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { Particles } from "@/components/Particles";
import { HeroVideo } from "@/components/HeroVideo";
import { WordRotator } from "@/components/WordRotator";
import { ScrollReveal } from "@/components/ScrollReveal";

/* ── Reusable SVG icon components (no emojis) ── */
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
  sun: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  tree: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-7M17 8l-5-6-5 6h3v4h4V8z"/><path d="M19 14l-7-8-7 8h5v3h4v-3z"/></svg>,
  droplet: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  globe: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
};

export default function Home() {
  return (
    <main>
      {/* ══ HERO — Video background + animated title + CTA cards ══ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Video / image background */}
        <HeroVideo />
        <Particles />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-6 md:px-16 lg:px-20 pt-24">
          <div className="max-w-[780px]">
            {/* Animated heading — "Oromo" and "running" rotate in a loop */}
            <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2.8rem,5.5vw,4.8rem)] font-bold leading-[1.08] text-white mb-10 tracking-tight">
              <span className="block hero-line">Let&apos;s celebrate</span>
              <span className="block hero-line">
                <WordRotator
                  words={["Oromo", "Irrecha", "Gada"]}
                  holdDuration={2500}
                  className="text-yellow min-w-[180px]"
                />
                {" "}heritage
              </span>
              <span className="block hero-line">
                through{" "}
                <WordRotator
                  words={["running.", "unity.", "movement."]}
                  holdDuration={2800}
                  className="text-yellow hero-accent min-w-[200px]"
                />
              </span>
            </h1>

            {/* Two compact CTA cards — Register + Buy Merch */}
            <div className="hero-cta-enter flex flex-wrap gap-3">
              <Link href="/register" className="group no-underline">
                <div className="yellow-card rounded-xl px-5 py-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all">
                  <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-black tracking-tight leading-tight">Register Now</div>
                    <div className="text-[10px] opacity-50">From $25</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-40 group-hover:opacity-70 transition-opacity"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>

              <Link href="/shop" className="group no-underline">
                <div className="dark-card rounded-xl px-5 py-3 flex items-center gap-3 hover:-translate-y-0.5 hover:border-yellow/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-yellow/10 flex items-center justify-center text-yellow shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 00-1.34 1.63l-.38 3.42L5 11v10h14V11l3.1-2.49-.38-3.42a2 2 0 00-1.34-1.63z"/></svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-black tracking-tight text-white leading-tight">Buy Merch</div>
                    <div className="text-[10px] text-white/35">Tees &amp; Hoodies</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-white/20 group-hover:text-white/50 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom dashboard area ── */}
        <div className="relative z-20 px-6 md:px-16 lg:px-20 pb-6 mt-auto">
          {/* Activity tabs */}
          <div className="pb-4">
            <div className="flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-white/40">
              <span className="text-white relative">
                Running
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-yellow" />
              </span>
              <span className="hover:text-white/60 transition-colors cursor-pointer">Culture</span>
              <span className="hover:text-white/60 transition-colors cursor-pointer">Community</span>
              <span className="hover:text-white/60 transition-colors cursor-pointer">Festival</span>
              <div className="ml-auto flex gap-3">
                <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 cursor-pointer hover:border-white/40 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                </span>
                <span className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 cursor-pointer hover:border-white/40 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="yellow-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-charcoal">{Icons.barChart}</div>
              <div>
                <div className="text-xs font-semibold opacity-60 mb-1">Race Distance</div>
                <div className="text-4xl font-black tracking-tight">5K</div>
                <div className="text-xs font-semibold opacity-50 mt-0.5">3.1 Miles</div>
              </div>
            </div>

            <div className="yellow-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-yellow">{Icons.activity}</div>
              <div>
                <div className="text-xs font-semibold opacity-60 mb-1">Elevation Gain</div>
                <div className="text-4xl font-black tracking-tight">45<span className="text-lg font-bold ml-0.5">m</span></div>
                <div className="text-xs font-semibold opacity-50 mt-0.5">Gentle Route</div>
              </div>
            </div>

            <div className="dark-card rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-oromo/20 flex items-center justify-center text-yellow">{Icons.bolt}</div>
                <div>
                  <div className="text-sm font-bold text-white">Event Stats</div>
                  <div className="text-[10px] text-white/40">October 2026</div>
                </div>
              </div>
              <div className="flex items-end gap-1 h-12 mt-3">
                {[30,45,25,60,40,55,70,50,65,80,45,90].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i === 11 ? 'bg-yellow' : 'bg-white/12'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-black text-white">500</span>
                <span className="text-xs text-white/40 font-medium">runners</span>
              </div>
            </div>

            <div className="dark-card rounded-2xl p-6 flex flex-col min-h-[160px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-deep/20 flex items-center justify-center text-green-light">{Icons.medal}</div>
                <div>
                  <div className="text-sm font-bold text-white">Event Highlights</div>
                  <div className="text-[10px] text-white/40">3 Key Features</div>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {[
                  { badge: "5K", label: "Rock Creek Parkway", sub: "Washington, DC" },
                  { badge: "IRR", label: "Irrecha Celebration", sub: "Oct 3, 2026" },
                  { badge: "COM", label: "Community Festival", sub: "Music, Food, Dance" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="w-8 h-5 rounded bg-yellow/15 text-yellow text-[9px] font-black flex items-center justify-center tracking-wider">{item.badge}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.label}</div>
                      <div className="text-[10px] text-white/35">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COUNTDOWN ══ */}
      <section className="relative z-10 -mt-1">
        <Countdown />
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative h-[380px] md:h-[520px]">
              <img src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80" alt="Runners at sunrise" className="w-[78%] h-[88%] object-cover rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]" />
              <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" alt="Community celebration" className="absolute -bottom-4 right-0 w-[52%] h-[52%] object-cover rounded-2xl border-4 border-cream shadow-[0_16px_48px_rgba(0,0,0,0.1)]" />
              <div className="absolute top-6 right-8 yellow-card w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center font-black text-xl leading-none shadow-[0_8px_24px_rgba(245,200,66,0.3)]">
                5K
                <small className="text-[0.5rem] font-bold tracking-wider uppercase mt-0.5">Run/Walk</small>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">About the Event</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-6">
              Celebrating Oromo Heritage Through Movement
            </h2>
            <p className="text-[15px] leading-[1.85] text-charcoal/55 max-w-[520px] mb-10">
              The Gada Global 5K is more than a race &mdash; it&apos;s a celebration of the Oromo
              people&apos;s rich cultural heritage, timed with the annual <strong className="text-charcoal/80">Irrecha</strong> thanksgiving
              festival. Experience the power of community as we run together through one of Washington
              DC&apos;s most beautiful parkways.
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
                  <p className="text-[12px] text-charcoal/40 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ EVENT DETAILS ══ */}
      <section id="event" className="bg-charcoal text-white py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Event Details</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-4 tracking-tight">
              Race Day at a Glance
            </h2>
            <p className="text-[15px] leading-[1.85] text-white/40 max-w-[540px] mb-16">
              Everything you need to know about the Gada Global 5K experience.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden mb-16">
              <div
                className="min-h-[480px] md:min-h-[560px] flex"
                style={{
                  background: `
                    linear-gradient(to right, rgba(20,18,16,0.75) 0%, rgba(20,18,16,0.3) 60%, transparent 100%),
                    url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat`,
                }}
              >
                <div className="flex-1 p-8 md:p-14 flex flex-col justify-end">
                  <div className="text-[10px] font-bold tracking-[4px] uppercase text-yellow/80 mb-3">01.</div>
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    Rock Creek<br />Parkway
                  </h3>
                  <p className="text-sm text-white/50 max-w-[320px] leading-relaxed mb-8">
                    Washington DC&apos;s most scenic running route. A paved, gently rolling course
                    through lush parkland along the historic creek.
                  </p>
                  <div className="flex gap-10">
                    <div>
                      <div className="text-2xl md:text-3xl font-black tracking-tight">60-72<span className="text-base align-top">&#176;F</span></div>
                      <div className="text-[10px] font-semibold tracking-[3px] uppercase text-yellow/70 mt-1">Temperature</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black tracking-tight">7:30<span className="text-base ml-1">AM</span></div>
                      <div className="text-[10px] font-semibold tracking-[3px] uppercase text-yellow/70 mt-1">Start Time</div>
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-black tracking-tight">45<span className="text-base ml-0.5">M</span></div>
                      <div className="text-[10px] font-semibold tracking-[3px] uppercase text-yellow/70 mt-1">Elevation</div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-col justify-center items-end pr-14 gap-2">
                  {["WASHINGTON", "ROCK CREEK", "PARKWAY", "GEORGETOWN", "DUPONT"].map((city, i) => (
                    <span key={city} className={`font-[family-name:var(--font-heading)] font-bold tracking-tight transition-all ${i === 0 ? "text-5xl lg:text-6xl text-yellow" : "text-3xl lg:text-4xl text-white/15 hover:text-white/30"}`}>{city}</span>
                  ))}
                </div>
              </div>
              <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 560" fill="none">
                <path d="M600 50 C650 120, 750 180, 700 280 S620 380, 680 450 S780 500, 850 480" stroke="#F5C842" strokeWidth="2" strokeDasharray="8 6" fill="none"/>
              </svg>
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
                  <div className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ SCHEDULE ══ */}
      <section id="schedule" className="bg-cream py-24 md:py-32 px-6 md:px-16 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Race Day Schedule</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] tracking-tight mb-4">October 3, 2026</h2>
            <p className="text-[15px] leading-[1.85] text-charcoal/45 max-w-[480px] mx-auto">A full day of running, culture, and community celebration.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="max-w-[660px] mx-auto relative">
              <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-yellow to-green-deep rounded-full" />
              {[
                { time: "6:00 AM", title: "Packet Pickup Opens", desc: "Collect your bib, timing chip, and official race t-shirt.", gold: true },
                { time: "7:00 AM", title: "Opening Ceremony", desc: "Traditional Oromo blessing, national anthems, and warm-up.", gold: false },
                { time: "7:30 AM", title: "5K Race Start", desc: "Runners set off along Rock Creek Parkway. Walkers welcome.", gold: true },
                { time: "9:00 AM", title: "Awards Ceremony", desc: "Trophies for overall and age group winners. Finisher medals.", gold: false },
                { time: "10 AM - 2 PM", title: "Irrecha Cultural Festival", desc: "Live music, dance, food vendors, kids zone, community gathering.", gold: true },
              ].map((item) => (
                <div key={item.title} className="flex gap-6 mb-7">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-black shrink-0 z-10 tracking-tight ${item.gold ? "yellow-card" : "bg-green-deep text-white"}`}>
                    {item.time.split(" ")[0]}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-black/4 hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-shadow">
                    <div className="text-[10px] font-bold text-gold-dim tracking-[3px] uppercase mb-1">{item.time}</div>
                    <h4 className="text-[15px] font-bold mb-1 tracking-tight">{item.title}</h4>
                    <p className="text-[13px] text-charcoal/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ CULTURE BANNER ══ */}
      <section
        className="text-white text-center py-24 md:py-32 px-6 md:px-16 lg:px-20"
        style={{
          background: `linear-gradient(135deg, rgba(27,94,32,0.92), rgba(13,59,15,0.95)),
            url('https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=1600&q=80') center/cover`,
        }}
      >
        <ScrollReveal>
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-gold-light mb-5 block">Irrecha &amp; Oromo Heritage</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white max-w-[600px] mx-auto mb-5 tracking-tight">
            More Than a Race,<br />It&apos;s a Celebration
          </h2>
          <p className="text-[15px] leading-[1.85] text-white/55 max-w-[500px] mx-auto mb-14">
            Irrecha is the Oromo people&apos;s thanksgiving festival, honoring Waaqa (God)
            and the renewal of life.
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[920px] mx-auto">
            {[
              { icon: Icons.tree, title: "The Odaa Tree", desc: "Sacred symbol of the Gada system \u2014 democratic governance, one of Africa\u2019s oldest traditions." },
              { icon: Icons.droplet, title: "Water Blessing", desc: "Thanksgiving at the water\u2019s edge, symbolizing renewal, peace, and harmony with nature." },
              { icon: Icons.globe, title: "Global Diaspora", desc: "Connecting Oromo communities worldwide through sport, culture, and shared identity." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-3xl bg-white/6 border border-white/8 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-yellow mb-5">{item.icon}</div>
                <h4 className="text-[15px] font-bold mb-2 tracking-tight">{item.title}</h4>
                <p className="text-[13px] text-white/45 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ══ CTA ══ */}
      <section className="bg-charcoal py-24 md:py-32 px-6 md:px-16 lg:px-20 text-center">
        <ScrollReveal>
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Join the Movement</span>
          <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.15] text-white mb-5 max-w-[500px] mx-auto tracking-tight">
            Secure Your Spot Today
          </h2>
          <p className="text-[15px] leading-[1.85] text-white/40 max-w-[440px] mx-auto mb-10">
            Registration includes bib, timing chip, finisher medal, and official race t-shirt. Limited to 500 runners.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="inline-flex items-center gap-3 bg-yellow text-charcoal px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(245,200,66,0.25)] hover:-translate-y-0.5 transition-all no-underline">
              Register for 5K
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-white/6 text-white px-10 py-4 font-bold text-sm tracking-wider uppercase rounded-xl border border-white/10 hover:border-yellow/40 hover:text-yellow hover:-translate-y-0.5 transition-all no-underline">
              Shop Merch
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
