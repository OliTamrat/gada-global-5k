import Link from "next/link";
import { SPONSOR_TIERS, SPONSOR_BENEFITS, includedCount } from "@/lib/sponsors";
import { CoverageMeter } from "@/components/CoverageMeter";

/**
 * Compact sponsorship levels for the homepage.
 *
 * The full accordion belongs on /sponsors, where a business has arrived
 * deliberately and wants the detail. On the homepage it is one section among
 * a dozen, so this shows only what decides whether to click — the level, the
 * price, and how much of the offer it covers.
 *
 * Every tile is a link, and each one deep-links to its own level so the
 * sponsors page opens on the one that was tapped rather than making the
 * visitor find it again.
 */
export function SponsorLevelTiles() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {SPONSOR_TIERS.map((tier) => {
        const count = includedCount(tier.id);
        return (
          <Link
            key={tier.id}
            href={`/sponsors?level=${tier.id}`}
            className="group relative flex flex-col rounded-2xl bg-white/[0.045] border border-white/10 px-4 md:px-5 py-5 no-underline transition-all hover:bg-white/[0.085] hover:border-white/20 hover:-translate-y-1"
          >
            {/* Accent rail — weight, not a metal colour. Matches /sponsors. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-yellow transition-opacity group-hover:opacity-100"
              style={{ opacity: tier.weight * 0.75 }}
            />

            <span className="text-[11px] md:text-[12px] font-bold tracking-[2.5px] uppercase text-white/70 leading-none mb-2 group-hover:text-yellow transition-colors">
              {tier.name}
            </span>
            <span className="text-[20px] md:text-[24px] font-black tracking-tight tabular-nums leading-none text-white mb-3.5">
              {tier.amount}
            </span>

            <CoverageMeter filled={count} dim />
            <span className="text-[11.5px] font-semibold text-white/45 tabular-nums mt-2">
              {`${count} of ${SPONSOR_BENEFITS.length} benefits`}
            </span>

            <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-white/35 mt-4 group-hover:text-yellow transition-colors">
              See what&rsquo;s included
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
