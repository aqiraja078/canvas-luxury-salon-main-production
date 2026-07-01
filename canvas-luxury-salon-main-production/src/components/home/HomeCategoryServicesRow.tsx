import Image from "next/image";
import Link from "next/link";
import {
  HomeSection,
  HomeSectionHeader,
  type HomeSectionTone,
} from "@/components/home/HomeSection";
import { Reveal } from "@/components/ui/Reveal";
import type { HomeCategoryCard } from "@/lib/home-category-cards";

type Props = {
  kicker: string;
  title: string;
  subtitle: string;
  cards: HomeCategoryCard[];
  viewAllHref: string;
  viewAllLabel?: string;
  variant?: "default" | "alt";
  sectionIndex?: string;
};

/** Home row of image cards with price + book CTA (makeup-style). */
export function HomeCategoryServicesRow({
  kicker,
  title,
  subtitle,
  cards,
  viewAllHref,
  viewAllLabel = "View all",
  variant = "default",
  sectionIndex,
}: Props) {
  const tone: HomeSectionTone = variant === "alt" ? "obsidian" : "velvet";

  return (
    <HomeSection tone={tone} className="home-category-section">
      <HomeSectionHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        index={sectionIndex}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5 lg:gap-4 xl:gap-5">
        {cards.map((card, idx) => (
          <Reveal key={card.id} delay={idx * 0.06} scale>
            <article className="home-category-card group">
              <span className="home-category-card__index" aria-hidden>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="home-category-card__media relative w-full overflow-hidden">
                {card.image.startsWith("/api/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 18vw"
                  />
                )}
                <div className="absolute inset-0 overlay-dark-heavy" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(201,169,98,0.12),transparent)]" />
              </div>

              <div className="home-category-card__footer">
                <p className="line-clamp-2 text-center font-display text-sm font-bold text-white sm:text-base lg:text-lg xl:text-xl">
                  {card.name}
                </p>
                <p className="mt-1.5 text-center font-display text-xs font-bold text-gold-accent sm:text-sm lg:text-base">
                  {card.price}
                </p>
                <Link
                  href={`/book?service=${encodeURIComponent(card.name)}`}
                  className="home-category-card__cta btn-gold-premium mt-3 w-full py-2 text-[10px] sm:text-[11px] lg:py-3 lg:text-xs"
                >
                  Book now
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 text-center sm:mt-10">
          <Link
            href={viewAllHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold/15"
          >
            {viewAllLabel} →
          </Link>
        </div>
      </Reveal>
    </HomeSection>
  );
}
