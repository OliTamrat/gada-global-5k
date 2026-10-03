import Image from "next/image";
import Link from "next/link";
import { GUESTS } from "@/lib/guests";
import { ScrollReveal } from "@/components/ScrollReveal";

const Medal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="15" r="6" /><path d="M8.5 9.5 6 2h4l2 5 2-5h4l-2.5 7.5" />
  </svg>
);

/**
 * Five medalist guests as full-photo poster cards. Each card opens that
 * guest's full profile at /guests/[slug].
 */
export function HonorableGuests({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";

  return (
    <div className="max-w-6xl mx-auto relative">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] max-w-full h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(245,200,66,0.16),transparent)]" />

      <ScrollReveal className="text-center mb-12 relative">
        <span className={`inline-flex items-center gap-2 text-[12px] font-bold tracking-[4px] uppercase mb-5 ${dark ? "text-yellow" : "text-gold-dim"}`}>
          <Medal /> Honorable Guests
        </span>
        <h2 className={`font-[family-name:var(--font-heading)] text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.05] tracking-tight mb-5 ${dark ? "text-white" : ""}`}>
          Run with <span className="text-yellow">legends</span>.
        </h2>
        <p className={`text-base md:text-[17px] leading-[1.8] max-w-[600px] mx-auto ${dark ? "text-white/80" : "text-charcoal/85"}`}>
          Five Olympic and World Championship medalists who carried Ethiopia&apos;s flag onto the world&apos;s greatest stages, here at the Gada Global 5K Peace Run. Tap a legend to read their story.
        </p>
      </ScrollReveal>

      {/* Phones: a swipeable row of full-size posters. Desktop: all five in a line. */}
      <div className="relative -mx-6 px-6 md:mx-0 md:px-0 flex lg:grid lg:grid-cols-5 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-4 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GUESTS.map((g) => (
          <Link
            key={g.slug}
            href={`/guests/${g.slug}`}
            aria-label={`${g.name}, ${g.title}. Read full profile`}
            className="group relative shrink-0 w-[78vw] max-w-[320px] sm:w-[44vw] lg:w-auto lg:max-w-none aspect-[2/3] snap-center rounded-2xl overflow-hidden no-underline bg-charcoal shadow-[0_18px_50px_rgba(0,0,0,0.35)] ring-1 ring-white/10 hover:ring-yellow/60 hover:-translate-y-1.5 transition-all duration-300"
          >
            <Image
              src={g.image}
              alt={g.name}
              fill
              className="object-cover object-[center_25%] transition-transform duration-700 group-hover:scale-[1.07]"
              sizes="(max-width: 1024px) 78vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-yellow text-charcoal text-[10px] md:text-[11px] font-black tracking-[1.5px] uppercase px-2.5 py-1.5 rounded-full shadow-lg">
              <Medal /> {g.badge}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <div className="font-[family-name:var(--font-heading)] text-white font-black tracking-tight leading-[1.02] text-[26px] lg:text-[22px]">
                {g.name}
              </div>
              <div className="text-white/60 text-[13px] mt-1">{g.amharic}</div>
              <div className="h-[2px] w-10 bg-yellow my-2.5 transition-all duration-500 group-hover:w-20" />
              <div className="text-yellow text-[13px] font-bold leading-snug">{g.title}</div>
              <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500">
                <div className="overflow-hidden">
                  <p className="text-white/80 text-[12.5px] leading-snug pt-2">{g.highlights[0]}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-white text-[11px] font-bold tracking-[2px] uppercase mt-3 group-hover:text-yellow transition-colors">
                Read profile
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className={`lg:hidden text-center text-[12px] font-bold tracking-[3px] uppercase mt-3 ${dark ? "text-white/50" : "text-charcoal/50"}`}>
        Swipe to meet all five
      </p>
    </div>
  );
}
