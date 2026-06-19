"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ServiceCardIcon } from "@/components/services/ServiceCardIcon";
import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";

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
};

function inferTheme(text: string): ServiceThemeId {
  const n = text.toLowerCase();
  if (n.includes("mehndi") || n.includes("henna")) return "mehndi";
  if (n.includes("nail") || n.includes("manicure") || n.includes("pedicure"))
    return "nails";
  if (n.includes("facial") || n.includes("skin")) return "facial";
  if (n.includes("spa") || n.includes("massage") || n.includes("wax"))
    return "bodySpa";
  if (n.includes("hair") || n.includes("cut") || n.includes("colour"))
    return "hair";
  return "makeup";
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function OfferSlideCard({ item }: { item: HomeOfferSlideItem }) {
  const theme = inferTheme(
    `${item.title} ${item.includedServices.join(" ")} ${item.iconName}`
  );

  return (
    <article className="home-offer-slide-card">
      <span className="home-offer-slide-card__badge home-offer-slide-card__badge--deal">
        {item.discountLabel}
      </span>
      <div className="home-offer-slide-card__icon-ring">
        <ServiceCardIcon name={item.iconName} theme={theme} />
      </div>
      <h3 className="home-offer-slide-card__title">{item.title}</h3>
      <p className="home-offer-slide-card__desc">{item.description}</p>
      <div className="home-offer-slide-card__price-wrap">
        {item.originalPrice ? (
          <span className="home-offer-slide-card__price-old">
            {item.originalPrice}
          </span>
        ) : null}
        <p className="home-offer-slide-card__price">{item.price}</p>
      </div>
      {item.includedServices.length > 0 ? (
        <p className="home-offer-slide-card__includes">
          {item.includedServices.slice(0, 2).join(" · ")}
          {item.includedServices.length > 2
            ? ` +${item.includedServices.length - 2}`
            : ""}
        </p>
      ) : null}
      {item.promoCode ? (
        <p className="home-offer-slide-card__code">Code: {item.promoCode}</p>
      ) : null}
      <Link
        href={`/book?service=${encodeURIComponent(item.title)}`}
        className="home-offer-slide-card__cta btn-service-book btn-service-book--outline"
      >
        Claim offer
      </Link>
    </article>
  );
}

type Props = {
  items: HomeOfferSlideItem[];
};

/** Auto-scrolling row of CMS offers (synced with /offers page). */
export function HomeServiceOffersSlider({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const slideItems = reducedMotion ? items : [...items, ...items];

  useEffect(() => {
    if (items.length === 0 || paused || reducedMotion) return;

    const track = trackRef.current;
    if (!track) return;

    let frame: number;
    let offset = 0;
    const speed = 0.5;

    const step = () => {
      const half = track.scrollWidth / 2;
      offset += speed;
      if (offset >= half) offset = 0;
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items.length, paused, reducedMotion]);

  if (items.length === 0) return null;

  if (reducedMotion) {
    return (
      <div className="home-offer-slider home-offer-slider--static px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <div key={item.id} className="snap-start">
              <OfferSlideCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="home-offer-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="home-offer-slider__fade home-offer-slider__fade--left" aria-hidden />
      <div className="home-offer-slider__fade home-offer-slider__fade--right" aria-hidden />
      <div className="home-offer-slider__viewport">
        <div ref={trackRef} className="home-offer-slider__track">
          {slideItems.map((item, idx) => (
            <OfferSlideCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
