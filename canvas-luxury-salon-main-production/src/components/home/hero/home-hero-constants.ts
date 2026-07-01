import type { CmsHomeHeroTrust } from "@/lib/cms-types";

export const HERO_SECONDARY_IMAGE =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85";

export type HeroBottomStat = {
  id: string;
  value: string;
  label: string;
  hint: string;
  icon: "users" | "sparkles" | "badge" | "shield";
};

export const HERO_BOTTOM_STATS: HeroBottomStat[] = [
  {
    id: "clients",
    value: "500+",
    label: "Happy Clients",
    hint: "Trusted across Jhelum",
    icon: "users",
  },
  {
    id: "services",
    value: "1000+",
    label: "Services Completed",
    hint: "Bridal to everyday glam",
    icon: "sparkles",
  },
  {
    id: "experts",
    value: "Verified",
    label: "Beauty Experts",
    hint: "Trained professional artists",
    icon: "badge",
  },
  {
    id: "hygiene",
    value: "100%",
    label: "Hygienic Service",
    hint: "Your safety is our priority",
    icon: "shield",
  },
];

export type HeroFloatingCard = {
  id: string;
  value: string;
  label: string;
  className: string;
  delay: string;
};

export function buildFloatingCards(trustItems: CmsHomeHeroTrust[]): HeroFloatingCard[] {
  const google = trustItems.find((t) => t.label === "Google Reviews") ?? trustItems[0];
  const clients = trustItems.find((t) => t.label === "Happy Clients");
  const services = trustItems.find((t) => t.label === "Services Completed");

  return [
    {
      id: "google",
      value: google?.value ?? "4.9",
      label: "Google Rating",
      className: "hero-luxury__float-card--google",
      delay: "0s",
    },
    {
      id: "clients",
      value: clients?.value ?? "500+",
      label: "Happy Clients",
      className: "hero-luxury__float-card--clients",
      delay: "0.8s",
    },
    {
      id: "services",
      value: services?.value ?? "1000+",
      label: "Services Completed",
      className: "hero-luxury__float-card--services",
      delay: "1.6s",
    },
    {
      id: "bridal",
      value: "Bridal",
      label: "Specialist",
      className: "hero-luxury__float-card--bridal",
      delay: "2.4s",
    },
  ];
}
