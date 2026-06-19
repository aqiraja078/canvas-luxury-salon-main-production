import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import type { ServiceMenuItem } from "@/components/services/service-menu-mappers";
import { ServiceCardIcon } from "@/components/services/ServiceCardIcon";
import { ServiceBookButton } from "@/components/ui/ServiceBookButton";

type Props = {
  item: ServiceMenuItem;
  theme: ServiceThemeId;
};

function cardAccentClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `premium-service-card--accent-${h % 6}`;
}

function formatPrice(price: string): string {
  const trimmed = price.trim();
  if (/^from\s/i.test(trimmed)) return trimmed;
  if (/^rs\.?\s/i.test(trimmed)) return `From ${trimmed}`;
  return trimmed;
}

/**
 * Luxury gold-on-black service card — center-aligned, unique icon per service.
 */
export function PremiumServiceCard({ item, theme }: Props) {
  const accent = cardAccentClass(item.name);

  return (
    <article
      className={`premium-service-card ${accent} ${item.featured ? "premium-service-card--featured" : ""}`}
    >
      <span className="premium-service-card__flare premium-service-card__flare--tl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--tr" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--bl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--br" aria-hidden />

      <svg
        className="premium-service-card__vine premium-service-card__vine--left"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 44 C8 36 6 28 12 22 C16 18 14 12 18 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M10 30 C14 28 16 24 14 20 M16 18 C20 16 22 12 20 8"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <svg
        className="premium-service-card__vine premium-service-card__vine--right"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <path
          d="M44 44 C40 36 42 28 36 22 C32 18 34 12 30 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M38 30 C34 28 32 24 34 20 M32 18 C28 16 26 12 28 8"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      <div className="premium-service-card__stars" aria-hidden />

      <span className="premium-service-card__badge">Premium</span>

      <div className="premium-service-card__icon-ring">
        <ServiceCardIcon name={item.name} theme={theme} />
      </div>

      <h3 className="premium-service-card__title">{item.name}</h3>

      <p className="premium-service-card__desc">{item.blurb}</p>

      <p className="premium-service-card__price">{formatPrice(item.price)}</p>

      {item.meta ? (
        <p className="premium-service-card__duration">{item.meta}</p>
      ) : null}

      <ServiceBookButton serviceName={item.name} className="premium-service-card__cta" />
    </article>
  );
}
