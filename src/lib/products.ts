export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  imagePosition?: string; // object-position value
  color: string; // tailwind gradient class
  tag?: string;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "heritage-tee",
    name: "Heritage Edition Tee",
    description:
      "Full-print performance tee with Oromo patterns, Odaa tree, and 'Celebrating Heritage & Irrecha' design. Front print.",
    price: 3500,
    image: "/products/heritage-tee.jpg",
    imagePosition: "25% center",
    color: "from-[#8B1A1A] to-[#D4A574]",
    tag: "Popular",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "black-gold-tee",
    name: "Black & Gold Edition",
    description:
      "Premium black tee with gold brush-stroke runner emblem. 'Gada Democratic System — An Oromo Heritage' back print.",
    price: 3500,
    image: "/products/heritage-tee.jpg",
    imagePosition: "75% center",
    color: "from-[#1a1a1a] to-[#C8A84E]",
    tag: "New",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "combo-pack",
    name: "Race Day Combo (Both Tees)",
    description:
      "Get both the Heritage and Black & Gold editions at a special bundle price. Perfect for race day and post-race.",
    price: 5500,
    image: "/products/heritage-tee-flat.jpg",
    color: "from-[#8B1A1A] to-[#1a1a1a]",
    tag: "Best Value",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
];

export function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(0);
}
