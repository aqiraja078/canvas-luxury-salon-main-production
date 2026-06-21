import Image from "next/image";
import Link from "next/link";
import type { CmsHomeHero } from "@/lib/cms-types";

export function HomeHero({ hero }: { hero: CmsHomeHero }) {
  return (
    <section className="home-hero" aria-label="Welcome">
      <div className="home-hero__media">
        {hero.imageUrl.startsWith("/api/") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.imageUrl}
            alt="Luxury home beauty service atmosphere"
            className="home-hero__image absolute inset-0 h-full w-full object-cover object-[center_22%] sm:object-[center_32%] md:object-[center_28%]"
          />
        ) : (
          <Image
            src={hero.imageUrl}
            alt="Luxury home beauty service atmosphere"
            fill
            priority
            className="home-hero__image object-cover object-[center_22%] sm:object-[center_32%] md:object-[center_28%]"
            sizes="100vw"
          />
        )}
      </div>

      <div className="home-hero__overlay" aria-hidden="true" />
      <span className="home-hero__monogram" aria-hidden="true">
        {hero.badgeText.charAt(hero.badgeText.length - 1) || "H"}
      </span>
      <div className="home-hero__frame" aria-hidden="true" />

      <div className="home-hero__shell">
        <div className="home-hero__content">
          <div className="home-hero__badge-row home-hero__reveal home-hero__reveal--1">
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" aria-hidden="true" />
              {hero.badgeText}
            </span>
          </div>

          <div className="home-hero__kicker-wrap home-hero__reveal home-hero__reveal--2">
            <span className="home-hero__kicker-line" aria-hidden="true" />
            <p className="home-hero__kicker">{hero.kicker}</p>
            <span className="home-hero__kicker-line" aria-hidden="true" />
          </div>

          <h1 className="home-hero__title home-hero__reveal home-hero__reveal--3">
            <span className="home-hero__title-line">{hero.titleLine1}</span>
            <span className="home-hero__title-accent">{hero.titleLine2}</span>
          </h1>

          <div className="home-hero__lead-wrap home-hero__reveal home-hero__reveal--4">
            <span className="home-hero__lead-accent" aria-hidden="true" />
            <p className="home-hero__lead">{hero.description}</p>
          </div>

          <div className="home-hero__actions home-hero__reveal home-hero__reveal--5">
            <Link href={hero.primaryBtnHref} className="home-hero__btn home-hero__btn--primary">
              {hero.primaryBtnLabel}
            </Link>
            <Link href={hero.secondaryBtnHref} className="home-hero__btn home-hero__btn--ghost">
              {hero.secondaryBtnLabel}
            </Link>
          </div>

          <p className="home-hero__footnote home-hero__reveal home-hero__reveal--6">
            {hero.footnote}
          </p>
        </div>

        <div className="home-hero__trust-wrap">
          {hero.trustItems.map((stat, idx) => (
            <div
              key={`${stat.label}-${idx}`}
              className={`home-hero__trust-item home-hero__reveal home-hero__reveal--trust-${idx + 1}`}
            >
              <span className="home-hero__trust-value">{stat.value}</span>
              <span className="home-hero__trust-label">{stat.label}</span>
              <span className="home-hero__trust-hint">{stat.hint}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
