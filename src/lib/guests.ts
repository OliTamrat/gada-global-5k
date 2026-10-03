/**
 * Honorable guests at the 2026 race, from the MC brief the organizers prepared.
 * The homepage, /about and the social carousel all read from here.
 *
 * Pronunciation guides from the brief are deliberately not published: they are
 * for the MC, not for the page.
 */
export interface Guest {
  slug: string;
  name: string;
  /** Name in Ge'ez script. */
  amharic: string;
  title: string;
  /** Short badge shown on the photo. */
  badge: string;
  image: string;
  highlights: string[];
  bests: string;
}

export const GUESTS: Guest[] = [
  {
    slug: "assefa-mezgebu",
    badge: "Olympic Medalist",
    name: "Assefa Mezgebu",
    amharic: "አሰፋ መዝገቡ",
    title: "Olympic Bronze Medalist — 10,000m",
    image: "/guests/assefa-mezgebu.jpg",
    highlights: [
      "Olympic bronze, 10,000m — Sydney 2000",
      "World Championships silver, 10,000m — Edmonton 2001",
      "World Championships bronze, 10,000m — Seville 1999",
      "World Junior double gold, 5,000m & 10,000m — 1996",
    ],
    bests: "10,000m 26:49.90 · 5,000m 12:53.84",
  },
  {
    slug: "hailu-mekonnen",
    badge: "Marathon Champion",
    name: "Hailu Mekonnen",
    amharic: "ኃይሉ መኮንን",
    title: "Tokyo Marathon Champion",
    image: "/guests/hailu-mekonnen.jpg",
    highlights: [
      "Tokyo Marathon champion — 2011 (2:07:35)",
      "All-Africa Games gold, 1,500m — 1999",
      "Afro-Asian Games gold, 5,000m — 2003",
      "Olympian — Sydney 2000",
    ],
    bests: "Marathon 2:07:35 · 5,000m 12:58.57",
  },
  {
    slug: "tariku-bekele",
    badge: "Olympic Medalist",
    name: "Tariku Bekele",
    amharic: "ታሪኩ በቀለ",
    title: "Olympic Bronze Medalist — 10,000m",
    image: "/guests/tariku-bekele.jpg",
    highlights: [
      "Olympic bronze, 10,000m — London 2012",
      "World Indoor champion, 3,000m — Valencia 2008",
      "World Junior champion, 5,000m — 2004, 2006",
      "Marathon best 2:09:30",
    ],
    bests: "10,000m 27:03.24 · 5,000m 12:52.45",
  },
  {
    slug: "ayelech-worku",
    badge: "World Medalist",
    name: "Ayelech Worku",
    amharic: "አየለች ወርቁ",
    title: "2x World Championships Medalist — 5,000m",
    image: "/guests/ayelech-worku.jpg",
    highlights: [
      "World Championships bronze, 5,000m — 1999, 2001",
      "All-Africa Games gold, 5,000m — 1999",
      "World Junior champion, 5,000m — 1996",
      "Hamburg Marathon champion — 2007",
    ],
    bests: "5,000m 14:41.23 · Marathon 2:29:14",
  },
  {
    slug: "aselefech-mergia",
    badge: "Marathon Champion",
    name: "Aselefech Mergia",
    amharic: "አሰለፈች መርጊያ",
    title: "London Marathon Champion",
    image: "/guests/aselefech-mergia.jpg",
    highlights: [
      "London Marathon champion — 2010",
      "Three-time Dubai Marathon champion",
      "World Championships marathon bronze — Berlin 2009",
      "World Half Marathon silver — 2008",
    ],
    bests: "Marathon 2:19:31",
  },
];
