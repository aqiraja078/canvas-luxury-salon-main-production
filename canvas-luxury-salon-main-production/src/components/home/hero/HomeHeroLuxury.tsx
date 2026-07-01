"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CmsHomeHero } from "@/lib/cms-types";
import { whatsappUrl } from "@/lib/site";
import { HomeHeroBackground } from "@/components/home/hero/HomeHeroBackground";
import { HomeHeroBridalBanner } from "@/components/home/hero/HomeHeroBridalBanner";
import { HomeHeroFeatureStrip } from "@/components/home/hero/HomeHeroFeatureStrip";
import { HomeHeroVisual } from "@/components/home/hero/HomeHeroVisual";
import {
  HeroIconArrowRight,
  HeroIconCalendar,
  HeroIconCrown,
  HeroIconGallery,
  HeroIconWhatsApp,
} from "@/components/home/hero/HeroIcons";

type Props = {
  hero: CmsHomeHero;
};

function useMouseParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return offset;
}

function resolveWhatsAppHref(hero: CmsHomeHero): string {
  const href = hero.secondaryBtnHref?.trim() ?? "";
  if (href.includes("wa.me") || href.includes("whatsapp.com")) return href;
  return whatsappUrl();
}

export function HomeHeroLuxury({ hero }: Props) {
  const { x, y } = useMouseParallax();
  const whatsappHref = resolveWhatsAppHref(hero);

  return (
    <section className="hero-luxury" aria-label="Welcome">
      <HomeHeroBackground parallaxX={x} parallaxY={y} />

      <div className="hero-luxury__container">
        <div className="hero-luxury__grid">
          <div className="hero-luxury__copy">
            <div className="hero-luxury__badge hero-luxury__badge--sparkle hero-luxury__reveal hero-luxury__reveal--1">
              <span className="hero-luxury__badge-dot" aria-hidden="true" />
              ✨ {hero.badgeText}
            </div>

            <p className="hero-luxury__kicker hero-luxury__reveal hero-luxury__reveal--2">
              <HeroIconCrown className="hero-luxury__kicker-icon" aria-hidden="true" />
              {hero.kicker}
            </p>

            <h1 className="hero-luxury__title hero-luxury__reveal hero-luxury__reveal--3">
              <span className="hero-luxury__title-line">{hero.titleLine1}</span>
              <span className="hero-luxury__title-gold">{hero.titleLine2}</span>
            </h1>

            {hero.scriptLine ? (
              <p className="hero-luxury__script hero-luxury__reveal hero-luxury__reveal--4">
                {hero.scriptLine}
              </p>
            ) : null}

            <div className="hero-luxury__lead-wrap hero-luxury__reveal hero-luxury__reveal--5">
              <span className="hero-luxury__lead-bar" aria-hidden="true" />
              <p className="hero-luxury__lead">{hero.description}</p>
            </div>

            {hero.footnote ? (
              <p className="hero-luxury__footnote hero-luxury__footnote--desktop hero-luxury__reveal hero-luxury__reveal--7">
                {hero.footnote}
              </p>
            ) : null}
          </div>

          <HomeHeroVisual hero={hero} parallaxX={x} parallaxY={y} />

          <div className="hero-luxury__actions hero-luxury__reveal hero-luxury__reveal--6">
            <Link
              href={hero.primaryBtnHref || "/book"}
              className="hero-luxury__btn hero-luxury__btn--gold"
            >
              <HeroIconCalendar className="h-4 w-4 shrink-0" />
              <span className="hero-luxury__btn-text">
                {hero.primaryBtnLabel || "Book Appointment"}
              </span>
              <HeroIconArrowRight className="hero-luxury__btn-arrow h-4 w-4 shrink-0" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-luxury__btn hero-luxury__btn--whatsapp"
            >
              <HeroIconWhatsApp className="h-4 w-4 shrink-0" />
              <span className="hero-luxury__btn-text">
                {hero.secondaryBtnLabel || "WhatsApp Now"}
              </span>
            </a>
            <Link
              href={hero.portfolioBtnHref || "/gallery#bridal"}
              className="hero-luxury__btn hero-luxury__btn--outline"
            >
              <HeroIconGallery className="h-4 w-4 shrink-0" />
              <span className="hero-luxury__btn-text">
                {hero.portfolioBtnLabel || "View Bridal Portfolio"}
              </span>
            </Link>
          </div>
        </div>

        <HomeHeroFeatureStrip />
        <HomeHeroBridalBanner footnote={hero.footnote} />
      </div>
    </section>
  );
}
