export interface RegistrationTier {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  icon: string;
  deadline: string;
}

export const tiers: RegistrationTier[] = [
  {
    id: "early",
    name: "Early Bird",
    description: "Until August 15, 2026",
    price: 4500,
    icon: "leaf",
    deadline: "2026-08-15",
  },
  {
    id: "standard",
    name: "Standard",
    description: "Aug 16 - Sep 25, 2026",
    price: 4800,
    icon: "star",
    deadline: "2026-09-25",
  },
  {
    id: "raceweek",
    name: "Race Week",
    description: "Sep 26 - Oct 2, 2026",
    price: 5000,
    icon: "flame",
    deadline: "2026-10-02",
  },
];

export function getCurrentTier(): RegistrationTier {
  const now = new Date();
  for (const tier of tiers) {
    if (now <= new Date(tier.deadline + "T23:59:59")) {
      return tier;
    }
  }
  return tiers[tiers.length - 1];
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  tshirtSize: string;
  tierId: string;
  emergencyContact: string;
}
