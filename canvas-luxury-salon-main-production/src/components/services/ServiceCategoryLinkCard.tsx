import Link from "next/link";
import { ServiceCardIcon } from "@/components/services/ServiceCardIcon";
import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";

const SLUG_THEME: Record<string, ServiceThemeId> = {
  hair: "hair",
  facial: "facial",
  "body-spa": "bodySpa",
  nails: "nails",
  mehndi: "mehndi",
  makeup: "makeup",
};

type Props = {
  slug: string;
  title: string;
  short: string;
  price: string;
  href: string;
};

export function ServiceCategoryLinkCard({
  slug,
  title,
  short,
  price,
  href,
}: Props) {
  const theme = SLUG_THEME[slug] ?? "hair";

  return (
    <Link
      href={href}
      className="premium-service-card premium-service-card--link group"
    >
      <span className="premium-service-card__flare premium-service-card__flare--tl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--tr" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--bl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--br" aria-hidden />
      <div className="premium-service-card__stars" aria-hidden />
      <span className="premium-service-card__badge">Premium</span>

      <div className="premium-service-card__icon-ring">
        <ServiceCardIcon name={title} theme={theme} />
      </div>

      <h2 className="premium-service-card__title">{title}</h2>
      <p className="premium-service-card__desc">{short}</p>
      <p className="premium-service-card__price">{price}</p>

      <span className="premium-service-card__cta btn-service-book btn-service-book--outline">
        View menu
      </span>
    </Link>
  );
}
