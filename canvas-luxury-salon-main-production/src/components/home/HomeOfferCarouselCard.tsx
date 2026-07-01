import Link from "next/link";
import { splitOfferTitle } from "@/lib/offers-page-utils";
import type { HomeOfferSlideItem } from "@/components/home/HomeServiceOffersSlider";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85";

type Props = {
  item: HomeOfferSlideItem;
  active?: boolean;
};

export function HomeOfferCarouselCard({ item, active = false }: Props) {
  const { line1, line2 } = splitOfferTitle(item.title);
  const imageSrc = item.imageUrl?.trim() || FALLBACK_IMAGE;

  return (
    <article
      className={`home-offer-carousel-card${active ? " home-offer-carousel-card--active" : ""}`}
    >
      <div className="home-offer-carousel-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={item.title} className="home-offer-carousel-card__img" />
        <span className="home-offer-carousel-card__badge">{item.discountLabel}</span>
      </div>

      <div className="home-offer-carousel-card__body">
        <h3 className="home-offer-carousel-card__title">
          <span className="home-offer-carousel-card__title-inner">
            <span className="home-offer-carousel-card__title-line">{line1}</span>
            {line2 ? (
              <>
                {" "}
                <span className="home-offer-carousel-card__title-accent">{line2}</span>
              </>
            ) : null}
          </span>
        </h3>

        {(item.originalPrice || item.price) && (
          <p className="home-offer-carousel-card__prices">
            {item.originalPrice ? (
              <span className="home-offer-carousel-card__price-old">{item.originalPrice}</span>
            ) : null}
            {item.originalPrice && item.price ? (
              <span className="home-offer-carousel-card__price-sep" aria-hidden>
                {" "}
                —{" "}
              </span>
            ) : null}
            {item.price ? (
              <span className="home-offer-carousel-card__price-new">{item.price}</span>
            ) : null}
          </p>
        )}

        {item.description?.trim() ? (
          <p className="home-offer-carousel-card__desc">{item.description}</p>
        ) : null}

        {item.includedServices.length > 0 ? (
          <ul className="home-offer-carousel-card__list">
            {item.includedServices.slice(0, 3).map((service) => (
              <li key={service}>
                <span className="home-offer-carousel-card__check" aria-hidden>
                  ✓
                </span>
                {service}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={`/book?service=${encodeURIComponent(item.title)}`}
          className="home-offer-carousel-card__cta"
        >
          <svg
            className="home-offer-carousel-card__cta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M7 7h.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Claim offer
        </Link>
      </div>
    </article>
  );
}
