import Image from "next/image";
import { PARTNERS } from "@/lib/partners";

/**
 * "Thank you to our partners" logo row. The logos are cut from dark press-wall
 * artwork, so they sit on a charcoal tile wherever the strip is placed.
 */
export function PartnerStrip({ title = "Thank you to our partners" }: { title?: string }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center text-[12px] font-bold tracking-[4px] uppercase text-yellow mb-6">{title}</div>
      <ul className="list-none flex flex-wrap justify-center gap-2.5 md:gap-4">
        {PARTNERS.map((p) => {
          const tile = (
            <div className="relative h-[56px] md:h-[84px] w-[118px] md:w-[170px]">
              <Image src={p.logo} alt={p.name} fill className="object-contain" sizes="170px" />
            </div>
          );
          return (
            <li key={p.name} className="bg-[#1d1b19] border border-white/10 rounded-xl px-3 py-2" title={p.name}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>{tile}</a>
              ) : (
                tile
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
