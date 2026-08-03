import { SPONSOR_BENEFITS } from "@/lib/sponsors";

/**
 * One segment per benefit, filled for each one the level unlocks.
 *
 * This is what carries the hierarchy between sponsorship levels — not metal
 * colours. It also makes an unbalanced offer visible at a glance: two levels
 * showing the same fill are two levels a business has no reason to choose
 * between.
 *
 * No hooks, so both the client accordion and the server-rendered homepage
 * tiles use the same component rather than two drifting copies.
 */
export function CoverageMeter({
  filled,
  dim = false,
  className = "",
}: {
  filled: number;
  /** Muted treatment for a level that is not currently selected. */
  dim?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-1 ${className}`} aria-hidden="true">
      {SPONSOR_BENEFITS.map((_, i) => (
        <span
          key={i}
          className="h-[5px] w-5 md:w-6 rounded-full transition-colors"
          style={{
            background:
              i < filled
                ? dim
                  ? "rgba(245,200,66,0.42)"
                  : "#F5C842"
                : "rgba(255,255,255,0.11)",
          }}
        />
      ))}
    </span>
  );
}
