/**
 * Businesses and organizations partnering on the 2026 race, as they appear on
 * the press wall. Logos are the partners' originals, or the full-resolution images
 * embedded in the press-wall PDF. Add a `url` to make a logo a link.
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
  /** Wide logos only: "light" for artwork drawn on white, "dark" for transparent marks. */
  tile?: "light" | "dark";
  url?: string;
}

export const PARTNERS: Partner[] = [
  { name: "Gada Global", logo: "/partners/gada-global-2026.png", shape: "wide", tile: "dark" },
  { name: "Aduu Solar", logo: "/partners/aduu-solar-2026.png", shape: "wide", tile: "light" },
  { name: "Oromo Community Organization DMV", logo: "/partners/oco-dmv-2026.png", shape: "round" },
  { name: "Olink Technologies", logo: "/partners/olink-2026.png", shape: "round" },
  { name: "Kellem Coffee", logo: "/partners/kellem-coffee-2026.png", shape: "square" },
  { name: "3 Champions Market", logo: "/partners/three-champions-market-2026.png", shape: "wide", tile: "light" },
  { name: "Shalla Ethiopian Restaurant", logo: "/partners/shalla-2026.png", shape: "round" },
  { name: "Gabisa Law Firm", logo: "/partners/gabisa-law-firm-2026.png", shape: "wide", tile: "light" },
];
