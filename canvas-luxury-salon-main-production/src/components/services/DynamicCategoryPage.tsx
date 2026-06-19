import {
  ServiceCategoryPage,
  type ServiceThemeId,
} from "@/components/services/ServiceCategoryPage";
import {
  getServicesByCategory,
  groupServicesForMenu,
} from "@/lib/services-store";
import type { ServiceCategorySlug } from "@/lib/cms-types";
import { site } from "@/lib/site";

type CategoryConfig = {
  slug: ServiceCategorySlug;
  theme: ServiceThemeId;
  heroIcon: string;
  heroHighlight: string;
  kicker: string;
  title: string;
  description: string;
  footerNote: string;
};

const CONFIGS: Record<ServiceCategorySlug, CategoryConfig> = {
  hair: {
    slug: "hair",
    theme: "hair",
    heroIcon: "✂️",
    heroHighlight: "Cuts · Colour · Bridal",
    kicker: "Hair at home",
    title: "Hair artistry",
    description:
      "From feather cuts to balayage and bridal updos — every style is shaped to your face, hair health, and occasion. Transparent pricing on every card.",
    footerNote:
      "Unsure which cut or colour suits you? Book a free-style consultation — we guide you before any chemical work.",
  },
  makeup: {
    slug: "makeup",
    theme: "makeup",
    heroIcon: "💄",
    heroHighlight: "Bridal · Party · HD",
    kicker: "Makeup studio",
    title: "Makeup mastery",
    description:
      "Barat boldness, walima softness, or party-night drama — our artists build looks that photograph beautifully and feel light on skin.",
    footerNote:
      "Bridal trials are strongly recommended — perfect your look weeks before the ceremony.",
  },
  facial: {
    slug: "facial",
    theme: "facial",
    heroIcon: "🌿",
    heroHighlight: "Glow · Brighten · Bridal",
    kicker: "Skin rituals",
    title: "Facial care",
    description:
      "Deep-cleansing, brightening, anti-acne, and pre-bridal facials — customised to Punjab climate and your skin goals.",
    footerNote:
      "We assess your skin on arrival and adjust products for sensitivity or bridal timelines.",
  },
  "body-spa": {
    slug: "body-spa",
    theme: "bodySpa",
    heroIcon: "💆‍♀️",
    heroHighlight: "Massage · Hammam · Wax",
    kicker: "Body wellness",
    title: "Body & spa",
    description:
      "Swedish calm, hammam glow, waxing, and detox rituals — unwind without leaving home. Hygienic linens and premium oils every visit.",
    footerNote:
      "Tell us about allergies or pregnancy — we adapt products and pressure accordingly.",
  },
  nails: {
    slug: "nails",
    theme: "nails",
    heroIcon: "💅",
    heroHighlight: "Mani · Pedi · Nail art",
    kicker: "Nail lounge",
    title: "Nails & hands",
    description:
      "Classic mani-pedi, gel longevity, paraffin moisture, and statement nail art — finished to last through wedding week.",
    footerNote:
      "Gel and acrylic sets need 24h water caution — we explain aftercare at every appointment.",
  },
  mehndi: {
    slug: "mehndi",
    theme: "mehndi",
    heroIcon: "🪷",
    heroHighlight: "Bridal · Arabic · Eid",
    kicker: "Mehndi art",
    title: "Mehndi designs",
    description:
      "Dense bridal trails, flowing Arabic vines, delicate feet patterns, and quick Eid motifs — drawn with rich, long-stain henna paste.",
    footerNote:
      "Wedding season books fast — reserve mehndi 2–3 weeks ahead for peak dates.",
  },
};

export async function DynamicCategoryPage({
  slug,
}: {
  slug: ServiceCategorySlug;
}) {
  const config = CONFIGS[slug];
  const services = await getServicesByCategory(slug);
  const sections = groupServicesForMenu(services);

  return (
    <ServiceCategoryPage
      theme={config.theme}
      heroIcon={config.heroIcon}
      heroHighlight={config.heroHighlight}
      kicker={config.kicker}
      title={config.title}
      description={config.description}
      sections={sections}
      footerNote={config.footerNote}
    />
  );
}

export function categoryMetadata(slug: ServiceCategorySlug, label: string) {
  return {
    title: `${label} services`,
    description: `${label} home services by ${site.name} in Jhelum, Dina, and Gujrat.`,
  };
}
