/**
 * Single source of truth for outbound links, shared by the footer and the
 * /links page. One place to update when a social account goes live.
 */

export interface SiteLink {
  href: string;
  label: string;
  blurb: string;
  /** Primary links get the yellow treatment on /links. */
  primary?: boolean;
}

export const SITE_LINKS: SiteLink[] = [
  {
    href: "/register",
    label: "Register for the 5K",
    blurb: "October 3, 2026 · Rock Creek Park",
    primary: true,
  },
  {
    href: "/",
    label: "Event details",
    blurb: "Course, schedule, prizes, and FAQ",
  },
  {
    href: "/shop",
    label: "Shop merch",
    blurb: "Race Day tee, hoodie, and bundle",
  },
  {
    href: "/race",
    label: "Live results",
    blurb: "Finish times on race day",
  },
  {
    href: "/bib",
    label: "Print your race bib",
    blurb: "Already registered? Print it at home",
  },
  {
    href: "/about",
    label: "About Gada Global Run",
    blurb: "Who we are and why we run",
  },
];

export interface SocialLink {
  label: string;
  href: string;
  handle?: string;
}

/**
 * Placeholder `#` entries are filtered out before render rather than shown as
 * dead icons. Replace the href to make one appear in both the footer and the
 * links page.
 */
export const SOCIALS: SocialLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "X", href: "#" },
];

export function activeSocials(): SocialLink[] {
  return SOCIALS.filter((s) => s.href && s.href !== "#");
}
