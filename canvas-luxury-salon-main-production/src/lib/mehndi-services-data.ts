export type MehndiServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type MehndiServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: MehndiServiceItem[];
};

export const mehndiServiceSections: MehndiServiceSection[] = [
  {
    id: "hand-mehndi",
    emoji: "✋",
    title: "Hand Mehndi",
    services: [
      {
        name: "Finger Mehndi",
        description: "Statement fingers and bracelet lines — minimal yet striking.",
        price: "Rs. 800",
        duration: "25–40 min",
      },
      {
        name: "Simple Mehndi (Front Hand)",
        description: "Light front-hand coverage for casual days or first-time clients.",
        price: "Rs. 1,200",
        duration: "30–45 min",
      },
      {
        name: "Simple Mehndi (Back Hand)",
        description: "Elegant back-hand patterns with clean, balanced coverage.",
        price: "Rs. 1,000",
        duration: "30–40 min",
      },
      {
        name: "Simple Mehndi (Full Hand)",
        description: "Complete front and back simple design for a cohesive look.",
        price: "Rs. 2,000",
        duration: "45–60 min",
      },
      {
        name: "Arabic Mehndi (Front Hand)",
        description: "Bold Arabic flows and vines on the front of the hand.",
        price: "Rs. 2,000",
        duration: "45–60 min",
      },
      {
        name: "Arabic Mehndi (Back Hand)",
        description: "Signature Arabic negative-space patterns on the back hand.",
        price: "Rs. 1,800",
        duration: "40–55 min",
      },
      {
        name: "Arabic Mehndi (Full Hand)",
        description: "Full Arabic mehndi front and back with flowing vine detail.",
        price: "Rs. 3,500",
        duration: "1–1.5 hrs",
      },
    ],
  },
  {
    id: "feet-mehndi",
    emoji: "🦶",
    title: "Feet Mehndi",
    services: [
      {
        name: "Simple Feet Mehndi",
        description: "Toes and tops of feet with light patterning.",
        price: "Rs. 1,500",
        duration: "30–45 min",
      },
      {
        name: "Anklet Style Mehndi",
        description: "Jewellery-inspired bands and charms around the ankle.",
        price: "Rs. 1,800",
        duration: "40–60 min",
      },
      {
        name: "Full Feet Mehndi",
        description: "Complete coverage from toes to ankle with detailed fill.",
        price: "Rs. 4,500",
        duration: "1.5–2.5 hrs",
      },
    ],
  },
  {
    id: "occasion-mehndi",
    emoji: "🎉",
    title: "Occasion Mehndi",
    services: [
      {
        name: "Eid Mehndi (Front)",
        description: "Festive front-hand set sized for Eid gatherings and photos.",
        price: "Rs. 1,500",
        duration: "30–45 min",
      },
      {
        name: "Party Mehndi",
        description: "Trend-forward patterns for birthdays and celebrations.",
        price: "Rs. 1,800",
        duration: "45–60 min",
      },
      {
        name: "Customized Bridal Design",
        description: "Your story, symbols, and references woven into a one-of-a-kind mehndi design.",
        price: "Quote on Consult",
        duration: "Varies",
      },
    ],
  },
  {
    id: "bridal-mehndi",
    emoji: "👰",
    title: "Bridal Mehndi",
    services: [
      {
        name: "Full Hand + Full Feet Bridal",
        description: "Full hands and feet bridal mehndi with rich, detailed coverage.",
        price: "Rs. 10,000",
        duration: "2–4 hrs",
      },
      {
        name: "Premium Bridal Mehndi (Designer / Customized)",
        description: "Bespoke designer bridal mehndi with customized motifs and premium detail.",
        price: "Rs. 15,000",
        duration: "3–5 hrs",
      },
    ],
  },
];

export function allMehndiServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of mehndiServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
