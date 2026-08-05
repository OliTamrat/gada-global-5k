/**
 * The size vocabulary lives here and nowhere else — the shop, the checkout
 * validation, the registration form and the organizer tally all read it, so a
 * size that exists in one place exists in all of them.
 */
export const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const YOUTH_SIZES = ["YXS", "YS", "YM", "YL"];

const SIZE_LABELS: Record<string, string> = {
  XS: "Adult XS",
  S: "Adult Small",
  M: "Adult Medium",
  L: "Adult Large",
  XL: "Adult XL",
  XXL: "Adult XXL",
  YXS: "Youth XS",
  YS: "Youth Small",
  YM: "Youth Medium",
  YL: "Youth Large",
};

/** Spelled-out size, for anywhere a bare "YM" would be a guessing game. */
export function sizeLabel(size: string): string {
  return SIZE_LABELS[size] ?? size;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  imagePosition?: string; // object-position value
  color: string; // tailwind gradient class
  tag?: string;
  /** Adult sizes. */
  sizes: string[];
  /** Youth sizes, kept separate so the shop can group and label them. */
  youthSizes?: string[];
}

/** Every size a product can actually be ordered in. */
export function availableSizes(product: Product): string[] {
  return [...product.sizes, ...(product.youthSizes ?? [])];
}

export const products: Product[] = [
  {
    id: "race-day-tee",
    name: "Race Day Tee",
    description:
      "The official Gada Global 5K tee, carrying the globe-and-runners emblem with 'Run Together, Achieve Together, Inspire Together' and 'One World, One Goal'. Soft cotton, front print.",
    price: 3500,
    image: "/products/race-day-tee.jpg",
    color: "from-[#1B4A8B] to-[#4CAF50]",
    tag: "Official",
    sizes: ADULT_SIZES,
    youthSizes: YOUTH_SIZES,
  },
  {
    id: "race-day-hoodie",
    name: "Race Day Hoodie",
    description:
      "Heavyweight pullover hoodie with the same emblem, front pouch pocket and drawstring hood. The warm layer for an early start and the wait at the finish.",
    price: 5500,
    image: "/products/race-day-hoodie.jpg",
    color: "from-[#0D3B0F] to-[#1B4A8B]",
    tag: "New",
    sizes: ADULT_SIZES,
    youthSizes: YOUTH_SIZES,
  },
  {
    id: "race-day-bundle",
    name: "Race Day Bundle — Tee + Hoodie",
    description:
      "Both official pieces together at a bundle price. Race in the tee, pull the hoodie on at the finish line.",
    price: 8000,
    image: "/products/race-day-combo.jpg",
    color: "from-[#1B4A8B] to-[#4CAF50]",
    tag: "Best Value",
    sizes: ADULT_SIZES,
    youthSizes: YOUTH_SIZES,
  },
];

export function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(0);
}
