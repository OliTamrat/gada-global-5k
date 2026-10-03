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
  /** Hometown line for the profile header. */
  born: string;
  /** Full biography, one string per paragraph, from the MC brief. */
  bio: string[];
}

export const GUESTS: Guest[] = [
  {
    slug: "assefa-mezgebu",
    born: "June 19, 1978 · Sidamo, Ethiopia",
    bio: [
      "Born in Sidamo and the younger brother of fellow international runner Ayele Mezgebu, Assefa Mezgebu rose through the Commercial Bank of Ethiopia athletics club to become one of the world's great 10,000m specialists.",
      "He announced himself at just 18 with a stunning double gold, over 5,000m and 10,000m, at the 1996 World Junior Championships in Sydney. Three years later he took bronze in the 10,000m at the 1999 World Championships in Seville, then gold over the same distance at the 1999 All-Africa Games in Johannesburg.",
      "His defining moment came at the 2000 Sydney Olympics, where he won bronze in the 10,000m (27:19.75) behind Haile Gebrselassie and Kenya's Paul Tergat in one of the most celebrated finishes in Olympic distance running. A year later he went one better, taking silver at the 2001 World Championships in Edmonton (27:53.97), this time beating Gebrselassie himself into third place.",
      "A complete runner, he also medaled at the World Cross Country Championships (bronze 1998, silver 2000), and was honored by the Ethiopian Olympic Committee alongside the nation's Olympic heroes."
    ],
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
    bests: "10,000m 26:49.90 · 5,000m 12:53.84 · 3,000m 7:28.45",
  },
  {
    slug: "hailu-mekonnen",
    born: "April 4, 1980 · Arsi, Ethiopia",
    bio: [
      "Hailu Mekonnen came up training alongside Haile Gebrselassie himself, and it showed. He earned junior bronze, with team gold, at the 1998 World Cross Country Championships, then a medaling double at the 1999 edition in Belfast: winning the junior race and taking bronze in the senior short course.",
      "Later in 1999 he struck gold on the track, winning the 1,500m at the All-Africa Games in Johannesburg ahead of Kenya's David Lelei. He represented Ethiopia at the 1999 and 2001 World Championships and the 2000 Sydney Olympics, added short-course bronze at the 2002 World Cross Country Championships, silver in the 5,000m at the 2003 All-Africa Games, and gold at the 2003 Afro-Asian Games. At the 2003 International Chiba Ekiden he ran the fastest second stage as Ethiopia won in the fastest Ekiden ever run.",
      "He then conquered the roads: winner of the Montferland 15km, then a marathon breakthrough — 8th at the 2010 Paris Marathon despite falling mid-race, 5th at Amsterdam in 2:07:37, and then the crown: champion of the 2011 Tokyo Marathon (2:07:35), breaking away at 33km in what was then the third-fastest marathon in the world that year. He added the Hengshui Lake International Marathon title (2012) and the Tiberias Marathon title (2015)."
    ],
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
    bests: "Marathon 2:07:35 · 5,000m 12:58.57 · 1,500m 3:33.14",
  },
  {
    slug: "tariku-bekele",
    born: "February 28, 1987 · Bekoji, Ethiopia",
    bio: [
      "Born in Bekoji, the legendary highland town that produced his older brother, world-record holder and multiple Olympic champion Kenenisa Bekele, Tariku carved his own legacy rather than living in a shadow.",
      "His first major title was gold in the 3,000m at the 2008 World Indoor Championships in Valencia. He was already a two-time World Junior 5,000m champion (2004, 2006) with a junior cross-country bronze, an All-Africa Games silver medalist (2007), and he finished 6th in the 5,000m at the 2008 Beijing Olympics.",
      "His crowning achievement came at the 2012 London Olympics: bronze in the 10,000m (27:31.43) behind Mo Farah and Galen Rupp, finishing one second ahead of his own brother Kenenisa in one of the most memorable family duels in Olympic history.",
      "He moved to the roads with wins at the Saint Silvestre Road Race (2011), the Giro di Castelbuono and San Silvestre Vallecana 10K (2012), and later to the marathon — runner-up at Chuncheon (2017) and Xiamen (2018), with a best of 2:09:30 in Seoul."
    ],
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
    bests: "10,000m 27:03.24 · 5,000m 12:52.45 · Half marathon 1:02:11",
  },
  {
    slug: "ayelech-worku",
    born: "June 12, 1979 · Arsi Province, Ethiopia",
    bio: [
      "Ayelech Worku was one of the first Ethiopian women to stand on a global podium — a pioneer who paved the way for the generations that followed.",
      "She took silver in the 5,000m at the 1995 All-Africa Games at just 16, then won the 5,000m at the 1996 World Junior Championships in Sydney and competed at the Atlanta Olympics the same year. In cross country she earned junior bronze (1997), team silver (1998) and team gold (1999) at the World Championships.",
      "Her track peak was luminous: bronze in the 5,000m at the 1999 World Championships in Seville (14:44.22), gold at the 1999 All-Africa Games, 4th at the 2000 Sydney Olympics (14:42.67), and bronze again at the 2001 World Championships in Edmonton. Her victory at Crystal Palace, London, in 2000 (14:41.23) was the fastest women's 5,000m in the world that year, and she finished a close second to the great Derartu Tulu over 10,000m at the 2001 Goodwill Games.",
      "After 2002 she moved to the roads, winning the 2003 Montferland Run and the 2007 Hamburg Marathon (2:29:14)."
    ],
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
    bests: "5,000m 14:41.23 · 10,000m 31:38.08 · Marathon 2:29:14",
  },
  {
    slug: "aselefech-mergia",
    born: "January 23, 1985 · Ethiopia",
    bio: [
      "Aselefech Mergia began professional road racing in 2006 and rose with remarkable speed: Plymouth Half Marathon winner (2007), silver at the 2008 World Half Marathon Championships, and Delhi Half Marathon winner (2008, 2010).",
      "She debuted in the marathon with second place in Paris in 2009 (2:25:02), won the World 10K in Bangalore, then took bronze in the women's marathon at the 2009 World Championships in Berlin (2:25:32). She is a three-time Dubai Marathon champion — 2011, 2012 in a personal best of 2:19:31, a former Ethiopian national record that placed her among the ten fastest women in history, and 2015.",
      "She was retrospectively confirmed as the winner of the 2010 London Marathon (2:22:38) after the top two finishers were disqualified, making her a World Marathon Major champion.",
      "After a maternity break — her daughter Sena was born in July 2013 — she roared back to win Dubai in 2015 just 18 months later, one of the great comeback stories in the sport."
    ],
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
    bests: "Marathon 2:19:31 · Half marathon 1:07:21",
  },
];

/** Credit required by the photos' licences (Wikimedia Commons CC BY-SA / GFDL). */
export const GUEST_PHOTO_CREDIT =
  "Photos: Wikimedia Commons contributors (CC BY-SA / GFDL) and the Sporting Heroes archive.";

export function guestBySlug(slug: string): Guest | undefined {
  return GUESTS.find((g) => g.slug === slug);
}
