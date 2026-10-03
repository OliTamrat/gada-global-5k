/**
 * Businesses and organizations partnering on the 2026 race, as they appear on
 * the press wall. Logos are the partners' originals where supplied, otherwise cut
 * from the press-wall artwork. Add a `url` to make a logo a link.
 */
export interface Partner {
  name: string;
  logo: string;
  /**
   * "round" and "square" are full-bleed badge logos cropped to a square; the
   * tile clips them to a circle or rounded square. "wide" is a wordmark shown
   * whole on a dark tile.
   */
  shape: "round" | "square" | "wide";
  url?: string;
}

export const PARTNERS: Partner[] = [
  { name: "Aduu Solar", logo: "/partners/aduu-solar.png", shape: "wide" },
  { name: "Oromo Community Organization DMV", logo: "/partners/oco-dmv.png", shape: "round" },
  { name: "Olink Technologies", logo: "/partners/olink.png", shape: "round" },
  { name: "Kellem Coffee", logo: "/partners/kellem-coffee.png", shape: "square" },
  { name: "3 Champions Market", logo: "/partners/three-champions-market.png", shape: "wide" },
  { name: "Shalla Ethiopian Restaurant", logo: "/partners/shalla.png", shape: "round" },
  { name: "Gabisa Law Firm", logo: "/partners/gabisa-law-firm.png", shape: "wide" },
];
