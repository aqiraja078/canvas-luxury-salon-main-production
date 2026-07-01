"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HomeOfferCarouselCard } from "@/components/home/HomeOfferCarouselCard";

export type HomeOfferSlideItem = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  price: string;
  originalPrice?: string;
  promoCode?: string;
  iconName: string;
  includedServices: string[];
  imageUrl?: string;
};

type Props = {
  items: HomeOfferSlideItem[];
};

const SLIDE_GAP_PX = 16;
const DESKTOP_BREAKPOINT = 1024;

type CarouselLayout = {
  slideWidth: number;
  slidesPerView: 1 | 2;
};

export function HomeServiceOffersSlider({ items }: Props) {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<CarouselLayout>({
    slideWidth: 0,
    slidesPerView: 1,
  });
  const count = items.length;
  const maxIndex = Math.max(0, count - layout.slidesPerView);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportWidth = viewport.getBoundingClientRect().width;
    const slidesPerView: 1 | 2 =
      viewportWidth >= DESKTOP_BREAKPOINT && count > 1 ? 2 : 1;
    const slideWidth =
      (viewportWidth - SLIDE_GAP_PX * (slidesPerView - 1)) / slidesPerView;

    setLayout({ slideWidth, slidesPerView });
  }, [count]);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length, measure]);

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const trackTransform =
    layout.slideWidth > 0
      ? layout.slidesPerView === 1
        ? `translateX(calc(50% - ${index * (layout.slideWidth + SLIDE_GAP_PX) + layout.slideWidth / 2}px))`
        : `translateX(-${index * (layout.slideWidth + SLIDE_GAP_PX)}px)`
      : undefined;

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="home-offers-carousel home-offers-carousel--single">
        <HomeOfferCarouselCard item={items[0]} active />
      </div>
    );
  }

  const showControls = count > layout.slidesPerView;

  return (
    <div
      className={`home-offers-carousel${layout.slidesPerView === 2 ? " home-offers-carousel--duo" : ""}`}
    >
      {showControls ? (
        <button
          type="button"
          className="home-offers-carousel__arrow home-offers-carousel__arrow--prev"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous offer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      <div className="home-offers-carousel__viewport" ref={viewportRef}>
        <div
          className="home-offers-carousel__track"
          style={trackTransform ? { transform: trackTransform } : undefined}
        >
          {items.map((item, idx) => {
            const isActive =
              layout.slidesPerView === 2
                ? idx === index || idx === index + 1
                : idx === index;

            return (
              <div
                key={item.id}
                className={`home-offers-carousel__slide${isActive ? " home-offers-carousel__slide--active" : ""}`}
                style={
                  layout.slideWidth > 0
                    ? { flex: `0 0 ${layout.slideWidth}px` }
                    : undefined
                }
              >
                <HomeOfferCarouselCard item={item} active={isActive} />
              </div>
            );
          })}
        </div>
      </div>

      {showControls ? (
        <button
          type="button"
          className="home-offers-carousel__arrow home-offers-carousel__arrow--next"
          onClick={next}
          disabled={index >= maxIndex}
          aria-label="Next offer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {showControls ? (
        <div className="home-offers-carousel__dots" role="tablist" aria-label="Offer slides">
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === index}
              aria-label={`Offer slide group ${dotIndex + 1}`}
              className={`home-offers-carousel__dot${dotIndex === index ? " home-offers-carousel__dot--active" : ""}`}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
