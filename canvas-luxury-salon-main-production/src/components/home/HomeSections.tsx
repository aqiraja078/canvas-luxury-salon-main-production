import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HomeAboutSection } from "@/components/home/HomeAboutSection";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import type {
  CmsHomeCta,
  CmsHomePage,
} from "@/lib/cms-types";
import { serviceCategories, site } from "@/lib/site";

const TestimonialSlider = dynamic(
  () =>
    import("@/components/home/TestimonialSlider").then((m) => ({
      default: m.TestimonialSlider,
    })),
  {
    loading: () => (
      <div
        className="mx-auto h-48 max-w-3xl animate-pulse rounded-3xl bg-white/[0.04]"
        aria-hidden
      />
    ),
  }
);

const galleryImages = [
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&q=80",
  "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80",
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80",
];

export function HomeServices() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-caption-golden">Services</p>
          <h2 className="text-headline mt-3">
            Crafted for every occasion
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {serviceCategories.map((s, idx) => (
            <Reveal key={s.slug} delay={idx * 0.08} scale>
              <Link
                href={s.href}
                className="service-card group relative block overflow-hidden"
              >
                <div className="service-card__media relative aspect-[5/6] overflow-hidden sm:aspect-[4/5]">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 overlay-dark-light" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(201,169,98,0.08),transparent)]" />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-lg font-bold text-white sm:text-xl group-hover:text-gold-light transition-colors">{s.title}</h3>
                  <p className="mt-2 text-xs text-white/70 sm:text-sm">{s.short}</p>
                  <p className="mt-3 text-sm font-semibold text-gold-accent">{s.price ?? "Competitive pricing available"}</p>
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold opacity-0 transition group-hover:opacity-100">
                    View all →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeAbout() {
  return <HomeAboutSection />;
}

export function HomeWhy({ section }: { section: CmsHomePage["why"] }) {
  return (
    <HomeSection tone="gold-mist">
      <HomeSectionHeader
        kicker={section.kicker}
        title={section.title}
        subtitle={section.subtitle}
        index={section.sectionIndex}
      />
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {section.cards.map((r, idx) => (
          <Reveal key={r.id} delay={idx * 0.1} scale>
            <div className="home-why-card">
              <span className="home-why-card__num" aria-hidden>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{r.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </HomeSection>
  );
}

export function HomeSteps({ section }: { section: CmsHomePage["steps"] }) {
  return (
    <HomeSection tone="velvet">
      <HomeSectionHeader
        kicker={section.kicker}
        title={section.title}
        subtitle={section.subtitle}
        index={section.sectionIndex}
      />
      <div className="home-steps-grid">
        {section.items.map((s, idx) => (
          <Reveal key={s.id} delay={idx * 0.08}>
            <div className="home-step-card">
              <span className="home-step-card__badge">{s.number}</span>
              <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </HomeSection>
  );
}

export function HomeGallery() {
  const tileClass = (idx: number) => {
    if (idx === 0) return "home-gallery-tile home-gallery-tile--hero";
    if (idx <= 2) return "home-gallery-tile home-gallery-tile--side";
    return "home-gallery-tile home-gallery-tile--small";
  };

  return (
    <HomeSection tone="obsidian">
      <HomeSectionHeader
        kicker="Portfolio"
        title="Moments of glow"
        subtitle="Real bridal looks, party glam, and skin prep — fresh work shared on Instagram."
        align="left"
        index="11"
        action={
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold transition hover:text-gold-light"
          >
            <span>Follow on Instagram</span>
            <span className="transition group-hover:translate-x-1">→</span>
          </a>
        }
      />
      <div className="home-gallery-grid">
        {galleryImages.map((src, idx) => (
          <Reveal
            key={src}
            delay={(idx % 3) * 0.06}
            scale
            className={`group relative ${tileClass(idx)} shadow-card-lifted`}
          >
            <Image
              src={src}
              alt={`${site.name} gallery preview ${idx + 1} of ${galleryImages.length}`}
              fill
              className="object-cover transition duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(201,169,98,0.06),transparent)]" />
          </Reveal>
        ))}
      </div>
    </HomeSection>
  );
}

export function HomeOffers() {
  return (
    <section className="border-t border-white/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
      <Reveal scale>
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-gold/20 via-black to-nude-deep/15 p-8 text-center shadow-deep-gold animate-glow-soft sm:p-12 md:p-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_0%,rgba(201,169,98,0.08),transparent)]" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.5em] text-gold-light font-semibold">
              Limited offer
            </p>
            <p className="mt-6 font-display text-5xl font-bold text-white xs:text-6xl md:text-7xl bg-gradient-to-r from-gold-light via-gold-accent to-gold bg-clip-text text-transparent">
              25% OFF
            </p>
            <p className="mt-6 text-white/80 text-body-default ">
              Professional makeup services — reserve your slot this season.
            </p>
            <Link
              href="/book"
              className="mt-10 inline-flex rounded-full bg-white px-12 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-nude-muted hover:shadow-lg transform hover:scale-105"
            >
              Reserve your spot
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeTestimonials({ section }: { section: CmsHomePage["testimonials"] }) {
  return (
    <HomeSection tone="midnight" className="home-testimonials-section">
      <HomeSectionHeader
        kicker={section.kicker}
        title={section.title}
        subtitle={section.subtitle}
        index={section.sectionIndex}
      />
      <TestimonialSlider items={section.items} />
    </HomeSection>
  );
}

export function HomeCta({ cta }: { cta: CmsHomeCta }) {
  return (
    <HomeSection tone="gold-mist" className="home-cta-section">
      <div className="home-cta-stack mx-auto max-w-2xl">
        <Reveal>
          <div className="home-cta-trust">
            {cta.trustPoints.map((point) => (
              <div key={point} className="home-cta-trust__pill">
                {point}
              </div>
            ))}
          </div>
        </Reveal>
        {cta.proofCards.length > 0 ? (
          <Reveal>
            <div className="home-cta-proof grid gap-3 sm:grid-cols-2">
              {cta.proofCards.map((p) => (
                <div key={p.id} className="home-cta-proof-card">
                  <p className="text-sm leading-relaxed text-white/85">{p.line}</p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                    {p.name} · {p.event}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}
        <Reveal scale>
          <div className="home-cta-finale">
            <div className="home-cta-finale__ornament" aria-hidden />
            <h2 className="home-cta-finale__title">{cta.title}</h2>
            <p className="home-cta-finale__subtitle">{cta.subtitle}</p>
            <Link href={cta.buttonHref} className="home-cta-finale__btn btn-gold-premium hover-scale-up">
              {cta.buttonLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </HomeSection>
  );
}
