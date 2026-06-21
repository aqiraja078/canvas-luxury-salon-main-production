export type FacialServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type FacialServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: FacialServiceItem[];
};

export const facialServiceSections: FacialServiceSection[] = [
  {
    id: "basic-facial",
    emoji: "🧼",
    title: "Basic",
    services: [
      {
        name: "Clean Up Facial",
        description: "Quick cleanse, steam, and gentle extraction for clearer pores.",
        price: "Rs. 2,000",
        duration: "35 min",
      },
      {
        name: "Basic Facial",
        description: "Classic cleanse, exfoliation, mask, and moisture for everyday glow.",
        price: "Rs. 1,800",
        duration: "45 min",
      },
      {
        name: "Express Facial",
        description: "Fast refresh when you are short on time — bright, fresh skin.",
        price: "Rs. 2,200",
        duration: "30 min",
      },
    ],
  },
  {
    id: "whitening-brightening",
    emoji: "✨",
    title: "Whitening / brightening",
    services: [
      {
        name: "Whitening Facial",
        description: "Even tone and visible brightness with gentle active care.",
        price: "Rs. 3,800",
        duration: "55 min",
      },
      {
        name: "Glow Facial",
        description: "Lit-from-within finish — perfect before events.",
        price: "Rs. 4,200",
        duration: "55 min",
      },
      {
        name: "Gold Facial",
        description: "Luxury gold-infused treatment for firmness and luminosity.",
        price: "Rs. 3,200",
        duration: "60 min",
      },
    ],
  },
  {
    id: "advanced-facial",
    emoji: "💎",
    title: "Advanced",
    services: [
      {
        name: "Hydra Facial",
        description: "Deep hydration + glowing skin with cleanse, extract, and infuse.",
        price: "Rs. 5,500",
        duration: "60 min",
      },
      {
        name: "Vitamin C Facial",
        description: "Antioxidant-rich brightening for sun-stressed skin.",
        price: "Rs. 4,500",
        duration: "55 min",
      },
      {
        name: "Josn",
        description: "Advanced skin renewal treatment for smoother, refreshed complexion.",
        price: "Rs. 4,000",
        duration: "55 min",
      },
      {
        name: "Skin Polish Facial",
        description: "Smoothing polish for silky texture and even reflection.",
        price: "Rs. 3,000",
        duration: "50 min",
      },
    ],
  },
  {
    id: "herbal-organic",
    emoji: "🌿",
    title: "Herbal / organic",
    services: [
      {
        name: "Herbal Facial",
        description: "Plant-based extracts for calm, balanced skin.",
        price: "Rs. 3,800",
        duration: "50 min",
      },
      {
        name: "Fruit Facial",
        description: "Enzyme-rich fruit actives for natural exfoliation and glow.",
        price: "Rs. 3,200",
        duration: "45 min",
      },
    ],
  },
  {
    id: "bridal-facial",
    emoji: "👰",
    title: "Bridal",
    services: [
      {
        name: "Bridal Glow Facial",
        description: "Multi-step glow path designed before your big day.",
        price: "Rs. 7,200",
        duration: "75 min",
      },
      {
        name: "Luxury Facial",
        description: "Top-tier masks and massage for red-carpet skin.",
        price: "Rs. 8,500",
        duration: "80 min",
      },
      {
        name: "Instant Glow Facial",
        description: "Same-day luminosity boost before events or photos.",
        price: "Rs. 5,200",
        duration: "55 min",
      },
    ],
  },
];

export function allFacialServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of facialServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
