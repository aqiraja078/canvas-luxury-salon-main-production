export type WaxingServiceItem = {
  name: string;
  description: string;
  price: string;
  duration?: string;
};

export type WaxingServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: WaxingServiceItem[];
};

export const waxingServiceSections: WaxingServiceSection[] = [
  {
    id: "face-waxing",
    emoji: "✨",
    title: "Face Waxing",
    services: [
      {
        name: "Eyebrow Shaping",
        description: "Clean arch shaping with precise, gentle face wax.",
        price: "Rs. 200",
        duration: "10 min",
      },
      {
        name: "Upper Lip",
        description: "Quick upper lip wax for a smooth, hair-free finish.",
        price: "Rs. 300",
        duration: "5 min",
      },
      {
        name: "Chin Wax",
        description: "Targeted chin wax with hygienic prep and aftercare.",
        price: "Rs. 500",
        duration: "5 min",
      },
      {
        name: "Full Face Wax",
        description: "Complete face wax — brows, lip, chin, and side areas.",
        price: "Rs. 1,000",
        duration: "20 min",
      },
    ],
  },
  {
    id: "arm-waxing",
    emoji: "💪",
    title: "Arm Waxing",
    services: [
      {
        name: "Half Arms",
        description: "Forearm wax from elbow to wrist for silky smooth skin.",
        price: "Rs. 1,000",
        duration: "15 min",
      },
      {
        name: "Full Arms",
        description: "Full arm wax from shoulder to wrist.",
        price: "Rs. 1,500",
        duration: "25 min",
      },
    ],
  },
  {
    id: "leg-waxing",
    emoji: "🦵",
    title: "Leg Waxing",
    services: [
      {
        name: "Half Legs",
        description: "Lower leg wax from knee to ankle.",
        price: "Rs. 1,500",
        duration: "20 min",
      },
      {
        name: "Full Legs",
        description: "Complete leg wax from thigh to ankle.",
        price: "Rs. 2,000",
        duration: "35 min",
      },
    ],
  },
  {
    id: "body-waxing",
    emoji: "🌸",
    title: "Body Waxing",
    services: [
      {
        name: "Underarms",
        description: "Clean underarm wax with gentle post-care.",
        price: "Rs. 1,000",
        duration: "10 min",
      },
      {
        name: "Full Stomach",
        description: "Stomach area wax with careful, hygienic technique.",
        price: "Rs. 1,000",
        duration: "20 min",
      },
    ],
  },
  {
    id: "bikini-waxing",
    emoji: "💎",
    title: "Bikini Waxing",
    services: [
      {
        name: "Basic Bikini Line",
        description: "Neat bikini line tidy-up — discreet and hygienic.",
        price: "Rs. 2,000",
        duration: "20 min",
      },
      {
        name: "Full body Bikini Wax",
        description: "Full body bikini wax with comfort-first technique.",
        price: "Rs. 7,000",
        duration: "60 min",
      },
    ],
  },
];

export function allWaxingServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of waxingServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}

/** Valid wax section ids — used to filter legacy spa/massage rows in CMS. */
export const WAX_SECTION_IDS = new Set(
  waxingServiceSections.map((s) => s.id)
);

/** Legacy body-spa CMS sections that are not waxing — hide on the Wax page. */
export const NON_WAX_BODY_SPA_SECTION_IDS = new Set([
  "body-massage",
  "body-treatments",
  "premium-spa",
  "relaxation-therapy",
  "bridal-spa",
  "full-body-wax",
  "area-wax",
  "wax-care",
  "bridal-wax",
  "skin-care-body",
  "waxing",
  "premium-waxing",
  "full-body-packages",
]);
