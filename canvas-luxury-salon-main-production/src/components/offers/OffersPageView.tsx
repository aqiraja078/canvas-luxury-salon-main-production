import Link from "next/link";
import type { CmsOffer } from "@/lib/cms-types";
import { OffersCountdown } from "@/components/offers/OffersCountdown";
import { OffersHeroFeatures } from "@/components/offers/OffersHeroFeatures";
import { OffersPremiumCard } from "@/components/offers/OffersPremiumCard";
import { nearestOfferEndDate, offersHeroImage } from "@/lib/offers-page-utils";

type Props = {
  offers: CmsOffer[];
};

export function OffersPageView({ offers }: Props) {
  const heroImage = offersHeroImage(offers);
  const countdownEnd = nearestOfferEndDate(offers);

  return (
    <div className="offers-page">
      <section className="offers-hero-ref" aria-label="Offers hero">
        <div className="offers-hero-ref__dark">
          <div className="offers-hero-ref__inner">
            <div className="offers-hero-ref__grid">
              <div className="offers-hero-ref__copy">
                <span className="offers-hero-ref__badge">Exclusive offers</span>

                <h1 className="offers-hero-ref__title">
                  Beauty Deals
                  <span className="offers-hero-ref__script">You&apos;ll Love</span>
                </h1>

                <p className="offers-hero-ref__lead">
                  Limited time offers on our premium beauty &amp; home services
                </p>

                <div className="offers-hero-ref__actions">
                  <Link href="/book" className="offers-hero-ref__btn offers-hero-ref__btn--primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                    Book appointment
                  </Link>
                  <a href="#offers-list" className="offers-hero-ref__btn offers-hero-ref__btn--outline">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <rect x="3" y="8" width="18" height="13" rx="1.5" />
                      <path d="M12 8V21M3 12h18M8.5 8C7 8 6 6.8 6 5.5 6 4.1 7.6 3 9 3c1.8 0 3 1.4 3 5M15.5 8c1.5 0 2.5-1.2 2.5-2.5C18 4.1 16.4 3 15 3c-1.8 0-3 1.4-3 5" />
                    </svg>
                    View all offers
                  </a>
                </div>
              </div>

              <div className="offers-hero-ref__visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt="Bridal beauty offer by Huma Beauty Saloon"
                  className="offers-hero-ref__img"
                />
              </div>
            </div>
          </div>

          <div className="offers-hero-ref__wave" aria-hidden>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path
                d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
                fill="#0a0a0a"
              />
            </svg>
          </div>
        </div>

        <OffersHeroFeatures />
      </section>

      <section id="offers-list" className="offers-showcase" aria-label="Limited time offers">
        <header className="offers-showcase__header">
          <span className="offers-showcase__floral-icon" aria-hidden>
            ✿
          </span>
          <p className="offers-showcase__kicker">Limited time offers</p>
        </header>

        {offers.length > 0 ? (
          <div className="offers-showcase__list">
            {offers.map((offer) => (
              <OffersPremiumCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <p className="offers-showcase__empty">
            No active offers right now — check back soon or book your favourite service.
          </p>
        )}
      </section>

      {countdownEnd ? <OffersCountdown endsAt={countdownEnd} /> : null}

      <section className="offers-cta-banner" aria-label="Book now">
        <div className="offers-cta-banner__floral" aria-hidden />
        <div className="offers-cta-banner__inner">
          <span className="offers-cta-banner__phone" aria-hidden>
            ☎
          </span>
          <p className="offers-cta-banner__text">
            Ready to glow? Book your favourite service now and save more!
          </p>
          <Link href="/book" className="offers-cta-banner__btn">
            Book now →
          </Link>
        </div>
      </section>
    </div>
  );
}
