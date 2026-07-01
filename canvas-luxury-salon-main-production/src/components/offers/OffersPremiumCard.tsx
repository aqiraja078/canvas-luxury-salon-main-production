import Link from "next/link";
import { HeroIconWhatsApp } from "@/components/home/hero/HeroIcons";
import type { CmsOffer } from "@/lib/cms-types";
import { offerWhatsAppUrl, splitOfferTitle } from "@/lib/offers-page-utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85";

type Props = {
  offer: CmsOffer;
};

export function OffersPremiumCard({ offer }: Props) {
  const imageSrc = offer.imageUrl?.trim() || FALLBACK_IMAGE;
  const { line1, line2 } = splitOfferTitle(offer.title);

  return (
    <article className="offers-row-card">
      <div className="offers-row-card__media">
        <div className="offers-row-card__img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={offer.title} className="offers-row-card__img" />
        </div>
        <span className="offers-row-card__badge">{offer.discountLabel}</span>
      </div>

      <div className="offers-row-card__content">
        <h3 className="offers-row-card__title">
          <span className="offers-row-card__title-inner">
            <span className="offers-row-card__title-line">{line1}</span>
            {line2 ? (
              <>
                {" "}
                <span className="offers-row-card__title-accent">{line2}</span>
              </>
            ) : null}
          </span>
        </h3>

        {(offer.originalPrice || offer.offerPrice) && (
          <p className="offers-row-card__prices">
            {offer.originalPrice ? (
              <span className="offers-row-card__price-old">{offer.originalPrice}</span>
            ) : null}
            {offer.originalPrice && offer.offerPrice ? (
              <span className="offers-row-card__price-sep" aria-hidden>
                ·
              </span>
            ) : null}
            {offer.offerPrice ? (
              <span className="offers-row-card__price-new">{offer.offerPrice}</span>
            ) : null}
          </p>
        )}

        {offer.description?.trim() ? (
          <p className="offers-row-card__desc">{offer.description}</p>
        ) : null}

        {offer.includedServices.length > 0 ? (
          <ul className="offers-row-card__list">
            {offer.includedServices.slice(0, 3).map((item) => (
              <li key={item}>
                <span className="offers-row-card__check" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="offers-row-card__aside">
        <div className="offers-row-card__actions">
          <Link
            href={`/book?service=${encodeURIComponent(offer.title)}`}
            className="offers-row-card__cta"
          >
            Claim offer
          </Link>
          <a
            href={offerWhatsAppUrl(offer)}
            target="_blank"
            rel="noopener noreferrer"
            className="offers-row-card__cta offers-row-card__cta--whatsapp"
            aria-label={`WhatsApp about ${offer.title}`}
          >
            <HeroIconWhatsApp className="offers-row-card__cta-icon" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
