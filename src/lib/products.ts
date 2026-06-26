export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  image: string;
  color: string; // tailwind gradient class
  tag?: string;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "race-tee",
    name: "Official Race Tee",
    description:
      "Moisture-wicking performance fabric with Gada Global 5K logo and Irrecha artwork on back.",
    price: 2800,
    image: "/products/race-tee.png",
    color: "from-green-deep to-green-light",
    tag: "Popular",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "gold-edition",
    name: "Irrecha Gold Edition",
    description:
      "Premium cotton tee with golden Irrecha sunrise design and Oromo proverb on sleeve.",
    price: 3500,
    image: "/products/gold-edition.png",
    color: "from-gold to-amber",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "heritage-hoodie",
    name: "Gada Heritage Hoodie",
    description:
      "Heavyweight fleece hoodie featuring the Odaa tree emblem. Perfect for post-race warmth.",
    price: 5500,
    image: "/products/heritage-hoodie.png",
    color: "from-charcoal to-warm-gray",
    tag: "Limited",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];

export function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(0);
}
