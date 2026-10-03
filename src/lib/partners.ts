/**
 * Businesses and organizations partnering on the 2026 race, as they appear on
 * the press wall. Logos are cut from the press-wall artwork; replace with the
 * partners' own files when they arrive. Add a `url` to make a logo a link.
 */
export interface Partner {
  name: string;
  logo: string;
  url?: string;
}

export const PARTNERS: Partner[] = [
  { name: "Aduu Solar", logo: "/partners/aduu-solar.png" },
  { name: "Oromo Community Organization DMV", logo: "/partners/oco-dmv.png" },
  { name: "Olink Technologies", logo: "/partners/olink.png" },
  { name: "Kelem Coffee", logo: "/partners/kelem-coffee.png" },
  { name: "3 Champions Market", logo: "/partners/three-champions-market.png" },
  { name: "Shalla Ethiopian Restaurant", logo: "/partners/shalla.png" },
  { name: "Gabisa Law Firm", logo: "/partners/gabisa-law-firm.png" },
];
