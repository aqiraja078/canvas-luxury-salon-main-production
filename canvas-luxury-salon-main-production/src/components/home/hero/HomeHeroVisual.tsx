import Image from "next/image";
import type { CmsHomeHero } from "@/lib/cms-types";
import {
  buildFloatingCards,
  HERO_SECONDARY_IMAGE,
} from "@/components/home/hero/home-hero-constants";
import { HomeHeroFloatingCards } from "@/components/home/hero/HomeHeroFloatingCards";

type Props = {
  hero: CmsHomeHero;
  parallaxX?: number;
  parallaxY?: number;
};

function HeroImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes: string;
}) {
  if (src.startsWith("/api/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`.trim()}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
    />
  );
}

export function HomeHeroVisual({ hero, parallaxX = 0, parallaxY = 0 }: Props) {
  const cards = buildFloatingCards(hero.trustItems);
  const secondarySrc = hero.secondaryImageUrl?.trim() || HERO_SECONDARY_IMAGE;
  const mainShift = {
    ["--hero-parallax-x" as string]: `${parallaxX * -8}px`,
    ["--hero-parallax-y" as string]: `${parallaxY * -6}px`,
  };
  const secondaryShift = {
    ["--hero-parallax-x" as string]: `${parallaxX * 14}px`,
    ["--hero-parallax-y" as string]: `${parallaxY * 10}px`,
  };

  return (
    <div className="hero-luxury__visual hero-luxury__reveal hero-luxury__reveal--visual">
      <div className="hero-luxury__visual-glow" aria-hidden="true" />

      <div className="hero-luxury__visual-stage">
        <div className="hero-luxury__image-main" style={mainShift}>
          <div className="hero-luxury__image-main-frame">
            <HeroImage
              src={hero.imageUrl}
              alt="Luxury bridal beauty by Huma Beauty Saloon"
              className="object-cover object-[center_20%]"
              priority
              sizes="(max-width: 1024px) 55vw, 42vw"
            />
            <div className="hero-luxury__image-shine" aria-hidden="true" />
          </div>

          <div className="hero-luxury__care-badge">
            <span className="hero-luxury__care-badge-star" aria-hidden="true">
              ★
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gold-light">
                Premium Care
              </p>
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/55">
                Assured
              </p>
            </div>
          </div>
        </div>

        <div className="hero-luxury__image-secondary" style={secondaryShift}>
          <div className="hero-luxury__image-secondary-frame">
            <HeroImage
              src={secondarySrc}
              alt="Luxury salon interior"
              className="object-cover"
              sizes="(max-width: 1024px) 38vw, 18vw"
            />
          </div>
        </div>

        <div className="hero-luxury__verified-ring" aria-hidden="true">
          <span>Verified Experts</span>
        </div>

        <HomeHeroFloatingCards cards={cards} />
      </div>
    </div>
  );
}
