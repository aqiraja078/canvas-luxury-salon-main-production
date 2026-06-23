export type HairLength = "short" | "medium" | "long";

export type HairLengthPricing = Partial<Record<HairLength, number>>;

export type HairServiceItem = {
  name: string;
  hint: string;
  price: string;
  lengthPricing: HairLengthPricing;
};

export type HairServiceSection = {
  id: string;
  emoji: string;
  title: string;
  services: HairServiceItem[];
};

export const HAIR_LENGTH_LABELS: Record<HairLength, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

const HAIR_LENGTH_ORDER: HairLength[] = ["short", "medium", "long"];

function svc(
  name: string,
  hint: string,
  lengthPricing: HairLengthPricing
): HairServiceItem {
  return {
    name,
    hint,
    lengthPricing,
    price: buildHairDisplayPrice(lengthPricing),
  };
}

/** Same price for short, medium, and long. */
function allLengths(amount: number): HairLengthPricing {
  return { short: amount, medium: amount, long: amount };
}

export function formatHairRs(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function getAvailableHairLengths(
  pricing: HairLengthPricing
): HairLength[] {
  return HAIR_LENGTH_ORDER.filter((l) => pricing[l] != null);
}

export function getHairMinPrice(pricing: HairLengthPricing): number {
  const values = getAvailableHairLengths(pricing).map((l) => pricing[l]!);
  return Math.min(...values);
}

export function buildHairDisplayPrice(pricing: HairLengthPricing): string {
  return `From ${formatHairRs(getHairMinPrice(pricing))}`;
}

export type HairLengthFormPrices = {
  short: string;
  medium: string;
  long: string;
};

export const emptyHairLengthForm: HairLengthFormPrices = {
  short: "",
  medium: "",
  long: "",
};

export function hairLengthFormFromPricing(
  pricing?: HairLengthPricing
): HairLengthFormPrices {
  return {
    short: pricing?.short != null ? String(pricing.short) : "",
    medium: pricing?.medium != null ? String(pricing.medium) : "",
    long: pricing?.long != null ? String(pricing.long) : "",
  };
}

export function parseHairLengthPricing(
  form: HairLengthFormPrices
): HairLengthPricing | undefined {
  const pricing: HairLengthPricing = {};
  for (const key of ["short", "medium", "long"] as const) {
    const raw = form[key].trim();
    if (!raw) continue;
    const amount = Number.parseInt(raw.replace(/\D/g, ""), 10);
    if (amount > 0) pricing[key] = amount;
  }
  return Object.keys(pricing).length > 0 ? pricing : undefined;
}

export function formatHairLengthPricingSummary(
  pricing?: HairLengthPricing
): string | null {
  if (!pricing || Object.keys(pricing).length === 0) return null;
  const parts: string[] = [];
  if (pricing.short != null) parts.push(`Short ${pricing.short.toLocaleString("en-PK")}`);
  if (pricing.medium != null) parts.push(`Medium ${pricing.medium.toLocaleString("en-PK")}`);
  if (pricing.long != null) parts.push(`Long ${pricing.long.toLocaleString("en-PK")}`);
  return parts.join(" · ");
}

export function resolveHairServicePrice(
  price: string,
  lengthPricing?: HairLengthPricing
): string {
  if (lengthPricing && Object.keys(lengthPricing).length > 0) {
    return buildHairDisplayPrice(lengthPricing);
  }
  return price.trim();
}

export function buildHairBookingServiceName(
  name: string,
  length: HairLength,
  amount: number
): string {
  return `${name} · ${HAIR_LENGTH_LABELS[length]} length · ${formatHairRs(amount)}`;
}

export function buildHairBookingUrl(
  name: string,
  length: HairLength,
  amount: number
): string {
  const params = new URLSearchParams({
    service: name,
    hairLength: length,
    price: String(amount),
  });
  return `/book?${params.toString()}`;
}

export function findHairServiceByName(name: string): HairServiceItem | undefined {
  for (const section of hairServiceSections) {
    const match = section.services.find((s) => s.name === name);
    if (match) return match;
  }
  return undefined;
}

export function resolveHairLengthPricing(
  name: string,
  cmsPricing?: HairLengthPricing
): HairLengthPricing | undefined {
  if (cmsPricing && Object.keys(cmsPricing).length > 0) return cmsPricing;
  return findHairServiceByName(name)?.lengthPricing;
}

export function lookupHairBookingPriceLabel(
  service: string,
  pricingByName?: Map<string, HairLengthPricing>
): string | null {
  const trimmed = service.trim();
  const bookingMatch = trimmed.match(/^(.+?) · (Short|Medium|Long) length · Rs\. [\d,]+$/);
  if (bookingMatch) {
    const [, serviceName, lengthLabel] = bookingMatch;
    const name = serviceName.trim();
    const pricing =
      pricingByName?.get(name) ?? resolveHairLengthPricing(name);
    if (!pricing) return null;
    const length = HAIR_LENGTH_ORDER.find(
      (l) => HAIR_LENGTH_LABELS[l] === lengthLabel
    );
    if (!length) return null;
    const amount = pricing[length];
    return amount != null ? formatHairRs(amount) : null;
  }

  const hair = findHairServiceByName(trimmed);
  if (hair) return hair.price;
  const cmsPricing = pricingByName?.get(trimmed);
  if (cmsPricing && Object.keys(cmsPricing).length > 0) {
    return buildHairDisplayPrice(cmsPricing);
  }
  return null;
}

export const hairServiceSections: HairServiceSection[] = [
  {
    id: "hair-cut",
    emoji: "💇",
    title: "Hair Cut",
    services: [
      svc("Hair Trim", "Neaten length and ends while keeping your shape.", {
        short: 800,
        medium: 900,
        long: 1000,
      }),
      svc("Straight Cut", "Clean, one-length line for a polished silhouette.", {
        short: 1000,
        medium: 1200,
        long: 1400,
      }),
      svc("Layer Cut", "Movement and volume with soft or defined layers.", {
        short: 1500,
        medium: 1800,
        long: 1950,
      }),
      svc("Step Cut", "Graduated steps for texture and bounce.", {
        short: 1400,
        medium: 1600,
        long: 1800,
      }),
      svc("Feather Cut", "Light, feathered ends for a soft, airy finish.", {
        short: 1200,
        medium: 1300,
        long: 1400,
      }),
      svc("Bob Cut", "Classic or modern bob tailored to your jawline.", {
        short: 2000,
      }),
      svc("Pixie Cut", "Short, sculpted crop with bespoke detailing.", {
        short: 1800,
      }),
      svc("Bangs (Fringe)", "Curtain, blunt, or side-swept fringe design.", {
        short: 500,
      }),
      svc("U Cut / V Cut", "Shaped perimeter for length at back with flow.", {
        short: 1100,
        medium: 1200,
        long: 1300,
      }),
    ],
  },
  {
    id: "hair-color",
    emoji: "🎨",
    title: "Hair Color",
    services: [
      svc("Root Touch-Up", "Seamless regrowth refresh to match your tone.", allLengths(2500)),
      svc("Full Hair Color", "Rich, even color from roots to ends.", {
        short: 3500,
        medium: 4000,
        long: 4500,
      }),
      svc("Global Color", "One unified shade from scalp to tips.", {
        short: 3500,
        medium: 3800,
        long: 4200,
      }),
      svc("Highlights", "Dimensional ribbons of light where you want glow.", {
        short: 4500,
        medium: 5000,
        long: 5500,
      }),
      svc("Lowlights", "Depth and contrast for fuller-looking hair.", {
        short: 4200,
        medium: 4800,
        long: 5200,
      }),
      svc("Balayage", "Hand-painted sun-kissed gradient, low maintenance.", {
        short: 6000,
        medium: 7000,
        long: 8000,
      }),
      svc("Ombre", "Bold or soft melt from depth to lighter ends.", {
        short: 5500,
        medium: 6000,
        long: 7000,
      }),
      svc("Fashion Colors", "Creative vivids and pastels with healthy prep.", {
        short: 4500,
        medium: 5000,
        long: 5800,
      }),
    ],
  },
  {
    id: "hair-treatment",
    emoji: "💆",
    title: "Hair Treatment",
    services: [
      svc("Hair Spa", "Deep nourishment, massage, and shine ritual.", {
        short: 2000,
        medium: 2500,
        long: 3000,
      }),
      svc("Protein Treatment", "Strength and elasticity for stressed strands.", {
        short: 3000,
        medium: 3500,
        long: 4000,
      }),
      svc("Keratin Treatment", "Smoothing care to reduce frizz and styling time.", {
        short: 6000,
        medium: 7000,
        long: 8000,
      }),
      svc("Smoothening Treatment", "Sleek, manageable finish with expert application.", {
        short: 5500,
        medium: 6000,
        long: 7000,
      }),
      svc("Rebonding", "Straight, structured results for resistant textures.", {
        short: 8000,
        medium: 9000,
        long: 10000,
      }),
      svc("Botox Hair Treatment", "Fillers and care for silky, plumped hair feel.", {
        short: 4500,
        medium: 5000,
        long: 6000,
      }),
      svc("Scalp Treatment", "Balance, comfort, and a healthy base for growth.", allLengths(2000)),
      svc("Dandruff Treatment", "Targeted calming and clarifying for flaky scalp.", {
        short: 2200,
        medium: 2500,
        long: 3000,
      }),
      svc("Hair Fall Treatment", "Fortifying ritual to support density and strength.", {
        short: 3000,
        medium: 3500,
        long: 4000,
      }),
    ],
  },
  {
    id: "hair-styling",
    emoji: "💃",
    title: "Hair Styling",
    services: [
      svc("Blow Dry", "Volume, smoothness, or waves with a pro finish.", {
        short: 800,
        medium: 1000,
        long: 1200,
      }),
      svc("Straightening (Temporary)", "Sleek pass with heat protection.", {
        short: 1200,
        medium: 1500,
        long: 1800,
      }),
      svc("Curling", "Waves or curls sized to your occasion.", {
        short: 1500,
        medium: 2000,
        long: 2500,
      }),
      svc("Ironing", "Pin-straight polish with lasting hold.", {
        short: 1500,
        medium: 1800,
        long: 2200,
      }),
      svc("Party Hairstyle", "Statement look for evenings and celebrations.", {
        short: 2500,
        medium: 3000,
        long: 3500,
      }),
      svc("Bridal Hairstyle", "Secure, photogenic styling for your big day.", {
        short: 4500,
        medium: 5000,
        long: 6000,
      }),
      svc("Braids / Plaits", "Classic and trend braids tailored to your hair.", {
        short: 1500,
        medium: 2000,
        long: 2500,
      }),
      svc("Bun Styles", "Low, high, or textured buns with elegant detail.", {
        short: 1800,
        medium: 2000,
        long: 2500,
      }),
    ],
  },
  {
    id: "bridal-hair",
    emoji: "👰",
    title: "Bridal Hair",
    services: [
      svc("Bridal Hairstyling", "Trial and day-of styling aligned with your veil and look.", {
        short: 6000,
        medium: 7000,
        long: 8000,
      }),
      svc("Hair Extensions Setup", "Volume or length blended for bridal styling.", {
        short: 3500,
        medium: 4000,
        long: 5000,
      }),
      svc("Hair Accessories Setting", "Pins, vines, and jewels placed to stay all day.", allLengths(1200)),
      svc("Dupatta Setting", "Secure, comfortable draping that complements hair.", allLengths(1500)),
    ],
  },
  {
    id: "hair-care",
    emoji: "🧴",
    title: "Hair Care",
    services: [
      svc("Hair Wash", "Gentle cleanse and finish with salon care.", {
        short: 300,
        medium: 400,
        long: 500,
      }),
      svc("Conditioning", "Instant slip, softness, and detangling.", {
        short: 500,
        medium: 600,
        long: 700,
      }),
      svc("Deep Conditioning", "Intensive moisture for dry or damaged hair.", {
        short: 1000,
        medium: 1200,
        long: 1500,
      }),
      svc("Oil Massage (Head)", "Relaxing scalp massage to boost circulation.", allLengths(800)),
    ],
  },
  {
    id: "advanced-premium",
    emoji: "💎",
    title: "Advanced / Premium",
    services: [
      svc("Hair Extensions", "Tape, weave, or keratin — matched to your color.", {
        short: 7000,
        medium: 8000,
        long: 10000,
      }),
      svc("Hair Volume Treatment", "Body and lift without heavy product feel.", {
        short: 5500,
        medium: 6500,
        long: 7500,
      }),
      svc("Scalp Detox", "Deep cleanse to remove buildup and refresh roots.", allLengths(2500)),
      svc("Laser Hair Therapy", "Light-based scalp support — consult for suitability.", allLengths(4000)),
    ],
  },
];

export function allHairServiceNames(): string[] {
  const names: string[] = [];
  for (const section of hairServiceSections) {
    for (const service of section.services) {
      names.push(service.name);
    }
  }
  return names;
}
