export type NailsServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export type NailsServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: NailsServiceItem[];
};

export const nailsServiceSections: NailsServiceSection[] = [
  {
    id: "manicure",
    emoji: "✨",
    title: "Manicure",
    services: [
      {
        name: "Basic Manicure",
        description: "Shape, tidy cuticles, buff, and polish of your choice.",
        price: "Rs. 1,000",
        duration: "30 min",
      },
      {
        name: "Classic Manicure",
        description: "Full hand soak, cuticle care, massage, and polish.",
        price: "Rs. 1,300",
        duration: "35 min",
      },
      {
        name: "Spa Manicure",
        description: "Deep cleaning + hand massage for soft, cared-for hands.",
        price: "Rs. 1,800",
        duration: "40 min",
      },
      {
        name: "Gel Manicure",
        description: "Long-wear gel colour with glossy, chip-resistant finish.",
        price: "Rs. 2,500",
        duration: "45 min",
      },
    ],
  },
  {
    id: "pedicure",
    emoji: "🦶",
    title: "Pedicure",
    services: [
      {
        name: "Basic Pedicure",
        description: "Soak, shape nails, light heel care, and polish.",
        price: "Rs. 1,500",
        duration: "40 min",
      },
      {
        name: "Classic Pedicure",
        description: "Full foot soak, scrub, cuticle work, massage, polish.",
        price: "Rs. 1,900",
        duration: "50 min",
      },
      {
        name: "Spa Pedicure",
        description: "Exfoliation, mask, and massage for tired feet.",
        price: "Rs. 2,500",
        duration: "55 min",
      },
    ],
  },
  {
    id: "nail-art",
    emoji: "🎨",
    title: "Nail Art",
    services: [
      {
        name: "Simple Nail Art",
        description: "Dots, lines, or minimal accents on natural or extensions.",
        price: "Rs. 500",
        duration: "+15–25 min",
      },
      {
        name: "Glitter Nails",
        description: "Full glitter fade, ombre glitter, or accent nails.",
        price: "Rs. 700",
        duration: "+15–30 min",
      },
      {
        name: "Ombre Nails",
        description: "Smooth colour melt across the nail bed.",
        price: "Rs. 1,200",
        duration: "35–50 min",
      },
      {
        name: "Custom Design Nails",
        description: "Bring inspiration — we quote after design complexity.",
        price: "Rs. 1,800",
        duration: "Varies",
      },
    ],
  },
  {
    id: "nail-polish",
    emoji: "🎀",
    title: "Polish",
    services: [
      {
        name: "Regular Nail Paint",
        description: "Standard lacquer in a wide shade range.",
        price: "Rs. 500",
        duration: "25 min",
      },
      {
        name: "Gel Polish",
        description: "Cured gel for two-week shine on hands or feet.",
        price: "Rs. 2,000",
        duration: "40 min",
      },
      {
        name: "Matte Finish",
        description: "Velvet matte top for gel or regular systems.",
        price: "Rs. 700",
        duration: "+10 min",
      },
    ],
  },
  {
    id: "manicure-premium",
    emoji: "✨",
    title: "Manicure Premium",
    services: [
      {
        name: "French Manicure",
        description: "Timeless pink base with clean white tips.",
        price: "Rs. 1,600",
        duration: "40 min",
      },
      {
        name: "Paraffin Manicure",
        description: "Warm paraffin dip for deep moisture and supple skin.",
        price: "Rs. 2,200",
        duration: "45 min",
      },
      {
        name: "Luxury Manicure",
        description: "Premium masks, extended massage, and flawless finish.",
        price: "Rs. 3,000",
        duration: "55 min",
      },
    ],
  },
  {
    id: "pedicure-premium",
    emoji: "🦶",
    title: "Pedicure Premium",
    services: [
      {
        name: "Deluxe Pedicure",
        description: "Extra attention to soles, callus care, and long massage.",
        price: "Rs. 3,200",
        duration: "65 min",
      },
      {
        name: "French Pedicure",
        description: "Elegant French finish on toes.",
        price: "Rs. 2,200",
        duration: "50 min",
      },
      {
        name: "Paraffin Pedicure",
        description: "Paraffin treatment for cracked, dry feet.",
        price: "Rs. 2,800",
        duration: "55 min",
      },
      {
        name: "Medical Pedicure",
        description: "Gentle clinical-style care for problem feet — consult first.",
        price: "Rs. 3,500",
        duration: "60 min",
      },
    ],
  },
  {
    id: "advanced-nail-art",
    emoji: "🎨",
    title: "Advanced Nail Art",
    services: [
      {
        name: "Bridal Nail Art",
        description: "Coordinated design for your ring shots and events.",
        price: "Rs. 3,000",
        duration: "45–60 min",
      },
      {
        name: "3D Nail Art",
        description: "Raised elements and sculpted details for statement nails.",
        price: "Rs. 1,500",
        duration: "30–50 min",
      },
      {
        name: "Stone / Rhinestone",
        description: "Crystals and studs placed for sparkle and dimension.",
        price: "Rs. 1,000",
        duration: "+20–40 min",
      },
    ],
  },
  {
    id: "nail-extensions",
    emoji: "💎",
    title: "Extensions",
    services: [
      {
        name: "Acrylic Extensions",
        description: "Strong length and shape with acrylic system.",
        price: "Rs. 3,200",
        duration: "75 min",
      },
      {
        name: "Gel Extensions",
        description: "Flexible gel builder for natural-looking length.",
        price: "Rs. 3,800",
        duration: "80 min",
      },
      {
        name: "Polygel Nails",
        description: "Hybrid strength with lighter feel than traditional acrylic.",
        price: "Rs. 4,200",
        duration: "85 min",
      },
      {
        name: "Nail Tips Extension",
        description: "Tips and overlay for quick length.",
        price: "Rs. 2,800",
        duration: "60 min",
      },
      {
        name: "French Extensions",
        description: "Extensions finished with classic or modern French.",
        price: "Rs. 4,000",
        duration: "90 min",
      },
    ],
  },
  {
    id: "nail-care-repair",
    emoji: "🛠",
    title: "Care & Repair",
    services: [
      {
        name: "Nail Repair",
        description: "Fix splits or breaks on natural or enhanced nails.",
        price: "Rs. 500",
        duration: "20 min",
      },
      {
        name: "Cuticle Treatment",
        description: "Soften, push, and nourish cuticles for neat growth.",
        price: "Rs. 700",
        duration: "25 min",
      },
      {
        name: "Nail Strengthening",
        description: "Fortifying treatment for weak, peeling nails.",
        price: "Rs. 1,000",
        duration: "30 min",
      },
      {
        name: "Gel / Acrylic Removal",
        description: "Safe soak-off or file-down — no damage rush.",
        price: "Rs. 1,200",
        duration: "40–55 min",
      },
      {
        name: "Hand & Foot Massage",
        description: "Relaxing massage add-on or stand-alone refresh.",
        price: "Rs. 1,200",
        duration: "25 min",
      },
    ],
  },
  {
    id: "bridal-nails",
    emoji: "👰",
    title: "Bridal Nails",
    services: [
      {
        name: "Bridal Mani + Pedi",
        description: "Matching hands and feet for your wedding week.",
        price: "Rs. 6,000",
        duration: "120 min",
      },
      {
        name: "Bridal Nail Art",
        description: "Custom art package — consult for lace, florals, or jewels.",
        price: "Rs. 3,200",
        duration: "60 min",
      },
      {
        name: "Full Extension Package",
        description: "Extensions, shape, colour, and art — one bundled price.",
        price: "Rs. 7,500",
        duration: "120+ min",
      },
    ],
  },
];

export function allNailsServiceNames(): string[] {
  const names: string[] = [];
  for (const sec of nailsServiceSections) {
    for (const s of sec.services) {
      names.push(s.name);
    }
  }
  return names;
}
