"use client";

import { useCallback, useState } from "react";
import type { CmsOffer } from "@/lib/cms-types";
import { OffersPremiumCard } from "@/components/offers/OffersPremiumCard";

type Props = {
  offers: CmsOffer[];
};

export function OffersPageCarousel({ offers }: Props) {
  const [index, setIndex] = useState(0);
  const count = offers.length;

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  if (count === 0) {
    return (
      <p className="offers-carousel__empty">
        No active offers right now — check back soon or book your favourite service.
      </p>
    );
  }

  if (count === 1) {
    return (
      <div className="offers-carousel offers-carousel--single">
        <OffersPremiumCard offer={offers[0]} />
      </div>
    );
  }

  return (
    <div className="offers-carousel">
      <button
        type="button"
        className="offers-carousel__arrow offers-carousel__arrow--prev"
        onClick={prev}
        aria-label="Previous offer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="offers-carousel__viewport">
        <div
          className="offers-carousel__track"
          style={{ transform: `translateX(calc(-${index} * (min(88vw, 22rem) + 1rem)))` }}
        >
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`offers-carousel__slide${idx === index ? " offers-carousel__slide--active" : ""}`}
            >
              <OffersPremiumCard offer={offer} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="offers-carousel__arrow offers-carousel__arrow--next"
        onClick={next}
        aria-label="Next offer"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="offers-carousel__dots" role="tablist" aria-label="Offer slides">
        {offers.map((offer, idx) => (
          <button
            key={offer.id}
            type="button"
            role="tab"
            aria-selected={idx === index}
            aria-label={`Offer ${idx + 1}: ${offer.title}`}
            className={`offers-carousel__dot${idx === index ? " offers-carousel__dot--active" : ""}`}
            onClick={() => setIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
