import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";

const values = [
  { title: "Health", desc: "Encouraging lifelong physical and mental wellness.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { title: "Unity", desc: "Bringing people together through sport.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { title: "Respect", desc: "Valuing every participant and volunteer.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { title: "Excellence", desc: "Delivering professional, safe, and memorable events.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4a2 2 0 01-2-2V4h4M18 9h2a2 2 0 002-2V4h-4M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22h10c0-2-.85-3.25-2.03-3.79A1.06 1.06 0 0114 17v-2.34"/><path d="M18 2H6v7a6 6 0 1012 0V2z"/></svg> },
  { title: "Integrity", desc: "Acting with honesty and accountability.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> },
  { title: "Community", desc: "Serving and giving back.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { title: "Inspiration", desc: "Empowering future generations.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
];

const events = [
  { badge: "FLAGSHIP", title: "Gada Global Special Run (5K & 10K)", desc: "Our flagship annual race celebrating Oromo heritage and community unity. Inaugural event: October 3, 2026 at Rock Creek Parkway, Washington DC." },
  { badge: "FAMILY", title: "Family Fun Run & Kids Dash", desc: "A family-focused community event designed to get kids active and families moving together in a fun, non-competitive environment." },
  { badge: "CORPORATE", title: "Corporate Wellness Challenge", desc: "Teams from companies compete while promoting workplace wellness. A great team-building experience that supports employee health." },
  { badge: "UNITY", title: "Unity Run", desc: "Celebrating diversity and bringing communities together through running. Open to all backgrounds, abilities, and experience levels." },
  { badge: "WOMEN", title: "Women Empowerment Run", desc: "Supporting women's health, leadership, and empowerment through a dedicated running event that uplifts and inspires." },
  { badge: "CHARITY", title: "Charity Run for Education & Health", desc: "Raising funds for community causes. Every mile run contributes to education and health initiatives that make a difference." },
];

const athletes = [
  {
    name: "Abebe Bikila",
    achievement: "1960 & 1964 Olympic Marathon Gold",
    story: "The barefoot champion from Jato, Oromia who stunned the world in Rome and became the first African Olympic gold medalist in history.",
    year: "1960",
    image: "/athletes/abebe-bikila.jpg",
  },
  {
    name: "Derartu Tulu",
    achievement: "1992 & 2000 Olympic 10,000m Gold",
    story: "First Black African woman to win Olympic gold. Her victory lap with Elana Meyer became one of sport\u2019s most iconic moments of unity.",
    year: "1992",
    image: "/athletes/derartu-tulu.jpg",
  },
  {
    name: "Kenenisa Bekele",
    achievement: "3x Olympic Gold, 5K & 10K WR",
    story: "Born in Bekoji, Oromia. Widely regarded as the greatest distance runner ever with 17 World Championship and Olympic medals.",
    year: "2004",
    image: "/athletes/kenenisa-bekele.jpg",
  },
  {
    name: "Tirunesh Dibaba",
    achievement: "3x Olympic Gold, 5K & 10K",
    story: "The \u2018Baby Faced Destroyer\u2019 from Bekoji who dominated distance running and became Ethiopia\u2019s most decorated female Olympian.",
    year: "2008",
    image: "/athletes/tirunesh-dibaba.jpg",
  },
];

const sponsors = [
  { tier: "Title Sponsor", color: "yellow-card", textColor: "text-charcoal" },
  { tier: "Platinum Sponsor", color: "bg-white/10 border border-white/20", textColor: "text-white" },
  { tier: "Gold Sponsor", color: "bg-yellow/15 border border-yellow/25", textColor: "text-yellow" },
  { tier: "Silver Sponsor", color: "bg-white/5 border border-white/10", textColor: "text-white/70" },
  { tier: "Community Partner", color: "bg-green-deep/20 border border-green-light/20", textColor: "text-green-light" },
];

export default function AboutPage() {
  return (
    <main>
      {/* ══ HERO BANNER ══ */}
      <section className="bg-charcoal pt-28 pb-20 md:pt-36 md:pb-28 px-6 md:px-16 lg:px-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat` }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">About Gada Global Run</span>
          <h1 className="font-[family-name:var(--font-heading)] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.1] text-white mb-6 tracking-tight">
            Every Finish Line Represents<br />Determination, Resilience &amp; Hope
          </h1>
          <p className="text-base md:text-[15px] leading-[1.85] text-white/55 max-w-[580px] mx-auto">
            A community-driven running organization celebrating cultural heritage, promoting healthy lifestyles, and uniting diverse communities through the transformative power of running.
          </p>
        </div>
      </section>

      {/* ══ ABOUT / ORIGIN STORY ══ */}
      <section className="bg-cream py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="text-[11px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">Our Story</span>
                <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight mb-6">
                  Rooted in the Gadaa System
                </h2>
                <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/70 mb-5">
                  Gada Global Run is a community-driven running organization established under Gada Global Inc., dedicated to promoting healthy lifestyles, building stronger communities, and celebrating cultural diversity through professionally organized races, fitness events, and wellness initiatives.
                </p>
                <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/70 mb-5">
                  The name <strong className="text-charcoal">Gada</strong> comes from the <strong className="text-charcoal">Gadaa System</strong>, an indigenous democratic governance system developed by the Oromo people and recognized by <strong className="text-charcoal">UNESCO as Intangible Cultural Heritage of Humanity</strong>. Rooted in values of inclusive leadership, equality, accountability, justice, and respect for human dignity, Gadaa inspires our commitment to creating spaces where everyone is welcomed, valued, and empowered.
                </p>
                <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/70">
                  Founded by visionary entrepreneurs, community leaders, and passionate athletes, Gada Global Run believes that every finish line represents more than a race &mdash; it represents determination, resilience, unity, and hope.
                </p>
              </div>
              <div className="relative h-[360px] md:h-[440px]">
                <Image src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=600&q=80" alt="Runners at sunrise" width={480} height={400} className="w-full h-full object-cover rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]" />
                <div className="absolute -bottom-4 -left-4 yellow-card w-[100px] h-[100px] rounded-2xl flex flex-col items-center justify-center font-black text-2xl leading-none shadow-[0_8px_24px_rgba(245,200,66,0.3)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                  <small className="text-[8px] font-bold tracking-wider uppercase mt-1.5">UNESCO</small>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-16 bg-charcoal rounded-2xl p-8 md:p-10 text-white text-center">
              <p className="text-base md:text-[15px] leading-[1.85] text-white/70 max-w-[640px] mx-auto italic">
                &ldquo;Whether you are an elite runner, a first-time participant, or a family enjoying a walk together, you belong to Gada Global Run. We bring people together through the power of running to inspire healthier lives, meaningful connections, and positive impact &mdash; one step at a time.&rdquo;
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ VISION & MISSION ══ */}
      <section className="bg-charcoal py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ScrollReveal>
              <div className="dark-card rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl yellow-card flex items-center justify-center mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </div>
                <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-3 block">Our Vision</span>
                <p className="text-base md:text-[15px] leading-[1.85] text-white/65">
                  To become the leading community-driven running organization that inspires healthier lives, celebrates cultural heritage, empowers athletes, and unites diverse communities through the transformative power of running.
                </p>
                <p className="text-[15px] md:text-[14px] leading-[1.85] text-white/50 mt-4">
                  We envision a future where every race strengthens friendships, promotes wellness, supports youth development, and creates opportunities for athletes while building lasting social and economic impact.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="dark-card rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-green-deep flex items-center justify-center text-green-light mb-5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                </div>
                <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-3 block">Our Mission</span>
                <p className="text-base md:text-[15px] leading-[1.85] text-white/65 mb-4">
                  Gada Global Run is committed to organizing world-class running events that promote health, unity, and community engagement.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Promote healthy lifestyles through running and physical activity",
                    "Bring communities together regardless of age, background, or ability",
                    "Celebrate Oromo culture while welcoming participants from every community",
                    "Support current and former athletes with recognition and mentorship",
                    "Inspire youth to pursue healthy, disciplined, and active lives",
                    "Partner with businesses and nonprofits to strengthen community wellness",
                    "Build sustainable events that contribute to social and economic growth",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[15px] md:text-[13px] text-white/50">
                      <span className="w-4 h-4 rounded-full yellow-card flex items-center justify-center mt-1 shrink-0">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ CORE VALUES ══ */}
      <section className="bg-cream py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">What We Stand For</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight mb-4">Our Core Values</h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <ScrollReveal key={v.title}>
                <div className={`rounded-2xl p-5 h-full hover:-translate-y-1 transition-all ${i === 0 ? 'yellow-card col-span-2 md:col-span-1' : 'bg-white border border-charcoal/5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${i === 0 ? 'bg-charcoal text-yellow' : 'bg-yellow/12 text-gold-dim'}`}>
                    {v.icon}
                  </div>
                  <h4 className="text-[15px] md:text-[14px] font-bold mb-1 tracking-tight">{v.title}</h4>
                  <p className="text-[15px] md:text-[13px] text-charcoal/55 leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR EVENTS ══ */}
      <section className="bg-charcoal py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Event Portfolio</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">Our Events</h2>
            <p className="text-base md:text-[15px] leading-[1.85] text-white/55 max-w-[520px] mx-auto">
              From competitive races to community celebrations, Gada Global Run organizes events that bring people together and promote healthy living.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((ev) => (
              <ScrollReveal key={ev.title}>
                <div className="dark-card rounded-2xl p-6 h-full hover:-translate-y-1 hover:border-yellow/15 transition-all">
                  <span className="inline-block text-[9px] font-black tracking-[2px] uppercase text-yellow bg-yellow/10 px-2.5 py-1 rounded-md mb-4">{ev.badge}</span>
                  <h4 className="text-[15px] font-bold text-white mb-2 tracking-tight">{ev.title}</h4>
                  <p className="text-[15px] md:text-[13px] text-white/50 leading-relaxed">{ev.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OROMO ATHLETES LEGACY ══ */}
      <section className="bg-cream py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <span className="text-[11px] font-bold tracking-[4px] uppercase text-gold-dim mb-5 block">A Legacy of Champions</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] tracking-tight mb-4">
              The Oromo Running Tradition
            </h2>
            <p className="text-base md:text-[15px] leading-[1.85] text-charcoal/70 max-w-[600px] mb-14">
              For decades, Oromo athletes have dominated the world stage in distance running, carrying the Ethiopian flag to Olympic glory. Gada Global Run honors this extraordinary legacy and inspires the next generation.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {athletes.map((athlete) => (
              <ScrollReveal key={athlete.name}>
                <div className="bg-white border border-charcoal/8 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] transition-all h-full flex flex-col">
                  <div className="h-[180px] relative overflow-hidden bg-charcoal/5">
                    <Image src={athlete.image} alt={athlete.name} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-[10px] font-bold tracking-[3px] uppercase text-yellow bg-charcoal/70 backdrop-blur-sm px-2.5 py-1 rounded-md">{athlete.year}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight mb-1">{athlete.name}</h3>
                    <p className="text-[14px] md:text-[12px] text-gold-dim font-semibold tracking-wide mb-2">{athlete.achievement}</p>
                    <p className="text-[15px] md:text-[13px] text-charcoal/60 leading-relaxed flex-1">{athlete.story}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-10 bg-charcoal rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6 text-white">
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight mb-2">Continue the Legacy</h3>
                <p className="text-[15px] md:text-[14px] text-white/70 leading-relaxed max-w-[480px]">
                  From Abebe Bikila&apos;s barefoot marathon to today, Oromo runners have won 23 Olympic medals in distance events. Gada Global Run brings this spirit to Rock Creek Parkway.
                </p>
              </div>
              <Link href="/register" className="shrink-0 yellow-card px-8 py-3.5 rounded-xl font-bold text-[13px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                Join the Race
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ BECOME A SPONSOR ══ */}
      <section className="bg-charcoal py-20 md:py-28 px-6 md:px-16 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-14">
            <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Partner With Us</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white tracking-tight mb-4">Become a Sponsor</h2>
            <p className="text-base md:text-[15px] leading-[1.85] text-white/55 max-w-[520px] mx-auto">
              Partner with Gada Global Run to connect with thousands of participants while demonstrating your commitment to health, diversity, and community development.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sponsors.map((s) => (
                <div key={s.tier} className={`${s.color} rounded-2xl p-5 text-center hover:-translate-y-1 transition-all`}>
                  <div className={`text-[14px] font-bold tracking-tight ${s.textColor}`}>{s.tier}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="text-center mt-10">
              <a href="mailto:info@gadaglobal.com" className="inline-flex items-center gap-3 yellow-card px-10 py-4 rounded-xl font-bold text-[13px] tracking-wider uppercase hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(245,200,66,0.3)] transition-all no-underline">
                Sponsorship Inquiry
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-20 md:py-28 px-6 md:px-16 lg:px-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-charcoal" />
        <div className="absolute inset-0 opacity-10" style={{ background: `url('https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1400&q=80') center/cover no-repeat` }} />
        <div className="relative z-10">
          <ScrollReveal>
            <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-5 block">Join the Movement</span>
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.15] text-white mb-5 max-w-[500px] mx-auto tracking-tight">Ready to Run With Us?</h2>
            <p className="text-base md:text-[15px] leading-[1.85] text-white/60 max-w-[440px] mx-auto mb-10">
              Registration is open for the inaugural Gada Global 5K. Be part of something bigger than a race.
            </p>
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
