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

/** Auto-scrolling row of CMS offers — each offer shown once. */
export function HomeServiceOffersSlider({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [fitsViewport, setFitsViewport] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const measure = () => {
      setFitsViewport(track.scrollWidth <= viewport.clientWidth + 2);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  useEffect(() => {
    if (items.length === 0 || paused || reducedMotion || fitsViewport) return;

    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const maxScroll = track.scrollWidth - viewport.clientWidth;
    if (maxScroll <= 0) return;

    let frame: number;
    let offset = 0;
    let direction = 1;
    const speed = 0.45;

    const step = () => {
      offset += speed * direction;
      if (offset >= maxScroll) {
        offset = maxScroll;
        direction = -1;
      } else if (offset <= 0) {
        offset = 0;
        direction = 1;
      }
      track.style.transform = `translate3d(-${offset}px, 0, 0)`;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items.length, paused, reducedMotion, fitsViewport]);

  if (items.length === 0) return null;

  const useStaticLayout = reducedMotion || fitsViewport;

  if (useStaticLayout) {
    return (
      <div className="home-offer-slider home-offer-slider--static px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-4 pb-2 sm:gap-5">
          {items.map((item) => (
            <div key={item.id} className="shrink-0">
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
      <div ref={viewportRef} className="home-offer-slider__viewport">
        <div ref={trackRef} className="home-offer-slider__track">
          {items.map((item) => (
            <OfferSlideCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
