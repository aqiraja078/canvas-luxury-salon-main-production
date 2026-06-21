import Image from "next/image";
import Link from "next/link";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import { TeamArtistsSection } from "@/components/team/TeamArtistsSection";
import { AboutStatsBanner } from "@/components/about/AboutStatsBanner";
import { Reveal } from "@/components/ui/Reveal";
import { getActiveTeamMembers } from "@/lib/team-store";
import type { CmsAboutCtaButton, CmsAboutPage } from "@/lib/cms-types";
import { site } from "@/lib/site";

function CmsImage({
  src,
  alt,
  fill,
  className = "",
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src.startsWith("/api/")) {
    const fillClass = fill ? "absolute inset-0 h-full w-full " : "";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`${fillClass}${className}`.trim()} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
    />
  );
}

function ctaButtonClass(variant: CmsAboutCtaButton["variant"]): string {
  switch (variant) {
    case "primary":
      return "btn-gold-premium inline-flex min-h-[48px] px-10";
    case "outline":
      return "inline-flex min-h-[48px] items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold/15";
    default:
      return "inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:border-gold/40";
  }
}

export async function AboutPageContent({ about }: { about: CmsAboutPage }) {
  const team = await getActiveTeamMembers();
  const featuredTeam = team.slice(0, about.team.memberLimit);
  const salonName = site.name.split(" ")[0];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__media" aria-hidden>
          <CmsImage
            src={about.hero.imageUrl}
            alt=""
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
        </div>
        <div className="about-hero__shade" aria-hidden />
        <span className="about-hero__monogram" aria-hidden>
          {salonName.charAt(0)}
        </span>
        <div className="about-hero__frame" aria-hidden />

        <div className="about-hero__inner">
          <Reveal>
            <p className="text-caption-golden">{about.hero.kicker}</p>
            <h1 className="about-hero__title mt-4">
              {about.hero.titleBefore}{" "}
              <span className="about-hero__accent">{about.hero.titleAccent}</span>
            </h1>
            <p className="about-hero__lead mt-6 max-w-2xl">{about.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {about.hero.cities.map((c) => (
                <span key={c.id} className="about-hero__pill">
                  {c.name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story + image */}
      <HomeSection tone="velvet" className="about-story-section">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="relative lg:col-span-5">
            <div className="about-story-visual">
              <div className="about-story-visual__frame">
                <CmsImage
                  src={about.story.imageUrl}
                  alt="Bridal makeup artistry"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="about-story-visual__quote">
                <p className="font-display text-lg text-gold-light">
                  {about.story.quoteLine1}
                </p>
                <p className="font-display text-lg text-white">{about.story.quoteLine2}</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <HomeSectionHeader
              kicker={about.story.kicker}
              title={
                <>
                  {about.story.titleBefore}{" "}
                  <span className="text-gold-light">{about.story.titleAccent}</span>
                </>
              }
              subtitle={about.story.subtitle}
              align="left"
              index={about.story.sectionIndex}
            />
            <Reveal delay={0.08}>
              <p className="text-base leading-relaxed text-white/72 sm:text-lg">
                {about.story.paragraph1}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
                {about.story.paragraph2}
              </p>
            </Reveal>

            <div className="about-timeline mt-12">
              {about.story.timeline.map((item, idx) => (
                <Reveal key={item.id} delay={0.06 + idx * 0.06}>
                  <div className="about-timeline__item">
                    <span className="about-timeline__year">{item.year}</span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </HomeSection>

      {/* Team */}
      {featuredTeam.length > 0 ? (
        <TeamArtistsSection
          kicker={about.team.kicker}
          title={about.team.title}
          subtitle={about.team.subtitle}
          index={about.team.sectionIndex}
          members={featuredTeam}
          limit={about.team.memberLimit}
        />
      ) : null}

      {/* Pillars */}
      <HomeSection tone="obsidian">
        <HomeSectionHeader
          kicker={about.pillars.kicker}
          title={about.pillars.title}
          subtitle={about.pillars.subtitle}
          index={about.pillars.sectionIndex}
        />
        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {about.pillars.items.map((p, idx) => (
            <Reveal key={p.id} delay={idx * 0.08} scale>
              <article className="about-pillar-card">
                <span className="about-pillar-card__num" aria-hidden>
                  {p.num}
                </span>
                <h3 className="mt-6 font-display text-xl text-white">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </HomeSection>

      <Reveal>
        <AboutStatsBanner stats={about.stats} />
      </Reveal>

      {/* Cities */}
      <HomeSection tone="gold-mist">
        <HomeSectionHeader
          kicker={about.coverage.kicker}
          title={about.coverage.title}
          subtitle={about.coverage.subtitle}
          index={about.coverage.sectionIndex}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {about.coverage.cities.map((city, idx) => (
            <Reveal key={city.id} delay={idx * 0.08} scale>
              <article className="about-city-card">
                <span className="about-city-card__dot" aria-hidden />
                <h3 className="font-display text-2xl text-gold-light">{city.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{city.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </HomeSection>

      {/* Home kit + quote */}
      <HomeSection tone="midnight">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <HomeSectionHeader
              kicker={about.homeKit.kicker}
              title={about.homeKit.title}
              subtitle={about.homeKit.subtitle}
              align="left"
              index={about.homeKit.sectionIndex}
            />
            <ul className="about-kit-list">
              {about.homeKit.items.map((item, idx) => (
                <Reveal key={item.id} delay={idx * 0.05}>
                  <li className="about-kit-list__item">
                    <span className="about-kit-list__check" aria-hidden>
                      ✓
                    </span>
                    {item.text}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1} scale>
            <blockquote className="about-quote-block">
              <p className="about-quote-block__text">
                &ldquo;{about.homeKit.quote}&rdquo;
              </p>
              <footer className="about-quote-block__footer">
                — {about.homeKit.quoteAttribution}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </HomeSection>

      {/* CTA */}
      <HomeSection tone="gold-mist" className="about-cta-section">
        <Reveal scale>
          <div className="about-cta-panel">
            <div className="about-cta-panel__ornament" aria-hidden />
            <p className="text-caption-golden">{about.cta.kicker}</p>
            <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              {about.cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              {about.cta.subtitle}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {about.cta.buttons.map((btn) => (
                <Link key={btn.id} href={btn.href} className={ctaButtonClass(btn.variant)}>
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </HomeSection>
    </div>
  );
}
