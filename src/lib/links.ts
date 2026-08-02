/**
 * Single source of truth for outbound links, shared by the footer and the
 * /links page. One place to update when a social account goes live.
 */

export type LinkIcon =
  | "run"
  | "calendar"
  | "trophy"
  | "bib"
  | "shirt"
  | "info"
  | "mail"
  | "instagram"
  | "facebook"
  | "x";

export interface SiteLink {
  href: string;
  label: string;
  blurb: string;
  icon: LinkIcon;
  /** Tailwind classes for the icon tile: background tint and glyph colour. */
  tint: string;
  /** Primary links get the filled yellow treatment. */
  primary?: boolean;
  external?: boolean;
}

export interface LinkSection {
  /** Rendered as a centred divider label. Omit for the lead group. */
  title?: string;
  links: SiteLink[];
}

export const LINK_SECTIONS: LinkSection[] = [
  {
    links: [
      {
        href: "/register",
        label: "Register for the 5K",
        blurb: "October 3, 2026 · Rock Creek Park",
        icon: "run",
        tint: "bg-charcoal text-yellow",
        primary: true,
      },
    ],
  },
  {
    title: "Race Day",
    links: [
      {
        href: "/",
        label: "Event Details",
        blurb: "Course, schedule, prizes, and FAQ",
        icon: "calendar",
        tint: "bg-yellow/12 text-yellow",
      },
      {
        href: "/race",
        label: "Live Results",
        blurb: "Finish times as runners cross",
        icon: "trophy",
        tint: "bg-green-deep/25 text-green-light",
      },
      {
        href: "/bib",
        label: "Print Your Race Bib",
        blurb: "Already registered? Print it at home",
        icon: "bib",
        tint: "bg-red-oromo/20 text-red-oromo",
      },
    ],
  },
  {
    title: "More",
    links: [
      {
        href: "/shop",
        label: "Shop Merch",
        blurb: "Race Day tee, hoodie, and bundle",
        icon: "shirt",
        tint: "bg-yellow/12 text-yellow",
      },
      {
        href: "/about",
        label: "About Gada Global Run",
        blurb: "Who we are and why we run",
        icon: "info",
        tint: "bg-white/8 text-white/75",
      },
      {
        href: "mailto:info@gadaglobalrun.com",
        label: "Contact Us",
        blurb: "info@gadaglobalrun.com",
        icon: "mail",
        tint: "bg-white/8 text-white/75",
        external: true,
      },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  blurb: string;
  icon: LinkIcon;
  tint: string;
}

/**
 * Placeholder `#` entries are filtered out before render rather than shown as
 * dead icons. Replace the href to make one appear in both the footer and the
 * links page.
 */
export const SOCIALS: SocialLink[] = [
  {
    label: "Instagram",
    href: "#",
    blurb: "Behind the scenes and race photos",
    icon: "instagram",
    tint: "bg-[#E1306C]/18 text-[#E1306C]",
  },
  {
    label: "Facebook",
    href: "#",
    blurb: "Community and event updates",
    icon: "facebook",
    tint: "bg-[#1877F2]/18 text-[#4293ff]",
  },
  {
    label: "X / Twitter",
    href: "#",
    blurb: "Announcements and race-day news",
    icon: "x",
    tint: "bg-white/10 text-white",
  },
];

export function activeSocials(): SocialLink[] {
  return SOCIALS.filter((s) => s.href && s.href !== "#");
}

