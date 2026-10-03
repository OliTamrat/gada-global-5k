import Image from "next/image";
import { PARTNERS, type Partner } from "@/lib/partners";

function Tile({ p, dup }: { p: Partner; dup?: boolean }) {
  const badge = p.shape !== "wide";
  const logo = badge ? (
    <div className={`relative h-[60px] w-[60px] md:h-[84px] md:w-[84px] overflow-hidden ring-2 ring-white/15 ${p.shape === "round" ? "rounded-full" : "rounded-2xl"}`}>
      <Image src={p.logo} alt={dup ? "" : p.name} fill className="object-cover" sizes="84px" />
    </div>
  ) : (
    <div className="relative h-[60px] md:h-[84px] w-[130px] md:w-[170px]">
      <Image src={p.logo} alt={dup ? "" : p.name} fill className="object-contain" sizes="170px" />
    </div>
  );
  return (
    <li
      data-dup={dup ? "" : undefined}
      aria-hidden={dup || undefined}
      title={p.name}
      className="shrink-0 mr-3 md:mr-4 bg-[#1d1b19] border border-white/10 rounded-xl px-3 py-2 hover:border-yellow/50 transition-colors"
    >
      {p.url ? (
        <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name} tabIndex={dup ? -1 : undefined}>{logo}</a>
      ) : (
        logo
      )}
    </li>
  );
}

/**
 * "Thank you to our partners": the logos glide sideways on a loop (see
 * .partner-marquee in globals.css). The list is rendered twice so the loop is
 * seamless; the copy is hidden from screen readers.
 */
export function PartnerStrip({ title = "Thank you to our partners" }: { title?: string }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-6">{title}</div>
      <div className="partner-marquee overflow-hidden">
        <ul className="partner-track list-none flex w-max py-1">
          {PARTNERS.map((p) => <Tile key={p.name} p={p} />)}
          {PARTNERS.map((p) => <Tile key={`${p.name}-dup`} p={p} dup />)}
        </ul>
      </div>
    </div>
  );
}
