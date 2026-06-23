"use client";

import { useMemo, useState } from "react";
import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import type { ServiceMenuItem } from "@/components/services/service-menu-mappers";
import { ServiceCardIcon } from "@/components/services/ServiceCardIcon";
import { ServiceBookButton } from "@/components/ui/ServiceBookButton";
import {
  HAIR_LENGTH_LABELS,
  type HairLength,
  buildHairBookingUrl,
  formatHairRs,
  getAvailableHairLengths,
} from "@/lib/hair-services-data";

type Props = {
  item: ServiceMenuItem;
  theme: ServiceThemeId;
};

function cardAccentClass(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `premium-service-card--accent-${h % 6}`;
}

export function HairServiceCard({ item, theme }: Props) {
  const pricing = item.lengthPricing ?? {};
  const lengths = useMemo(() => getAvailableHairLengths(pricing), [pricing]);
  const [length, setLength] = useState<HairLength>(() => lengths[0] ?? "short");

  const activeLength = lengths.includes(length) ? length : lengths[0];
  const amount =
    activeLength != null ? pricing[activeLength] ?? null : null;
  const displayPrice =
    amount != null ? formatHairRs(amount) : item.price;
  const bookHref =
    amount != null && activeLength
      ? buildHairBookingUrl(item.name, activeLength, amount)
      : undefined;
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
      </svg>

      <div className="premium-service-card__stars" aria-hidden />
      <span className="premium-service-card__badge">Premium</span>

      <div className="premium-service-card__icon-ring">
        <ServiceCardIcon name={item.name} theme={theme} />
      </div>

      <h3 className="premium-service-card__title">{item.name}</h3>
      <p className="premium-service-card__desc">{item.blurb}</p>

      {lengths.length > 0 ? (
        <div className="hair-length-picker" role="group" aria-label="Hair length">
          <p className="hair-length-picker__label">Select length</p>
          <div className="hair-length-picker__options">
            {lengths.map((len) => (
              <button
                key={len}
                type="button"
                className={`hair-length-picker__btn ${
                  activeLength === len ? "hair-length-picker__btn--active" : ""
                }`}
                aria-pressed={activeLength === len}
                onClick={() => setLength(len)}
              >
                {HAIR_LENGTH_LABELS[len]}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="premium-service-card__price">{displayPrice}</p>

      {item.meta ? (
        <p className="premium-service-card__duration">{item.meta}</p>
      ) : null}

      <ServiceBookButton
        serviceName={item.name}
        bookHref={bookHref}
        className="premium-service-card__cta"
      />
    </article>
  );
}
