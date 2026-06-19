import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";

export type ServiceHeroTheme = ServiceThemeId | "all";

type Props = {
  theme: ServiceHeroTheme;
  icon: string;
  highlight?: string;
};

/** Image-free decorative backdrop — unique layout per service category. */
export function ServiceCategoryHero({ theme, icon, highlight }: Props) {
  return (
    <div
      className={`service-category-hero service-category-hero--${theme}`}
      aria-hidden
    >
      <span className="service-category-hero__icon">{icon}</span>
      {highlight ? (
        <span className="service-category-hero__highlight">{highlight}</span>
      ) : null}
      <div className="service-category-hero__orb service-category-hero__orb--1" />
      <div className="service-category-hero__orb service-category-hero__orb--2" />
      <div className="service-category-hero__mesh" />
    </div>
  );
}
