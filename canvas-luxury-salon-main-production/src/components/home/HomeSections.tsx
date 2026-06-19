import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { HomeCategoryServicesRow } from "@/components/home/HomeCategoryServicesRow";
import { HomeAboutSection } from "@/components/home/HomeAboutSection";
import { HomeHeroAnimated } from "@/components/home/HomeHeroAnimated";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import { homeMakeupCards } from "@/lib/makeup-home-cards";
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

const steps = [
  { n: "01", title: "Book appointment", desc: "Share your date and preferred service." },
  { n: "02", title: "Trial setup", desc: "Optional trial for bridal and special events." },
  { n: "03", title: "Confirm booking", desc: "We confirm timing and personalize your plan." },
  { n: "04", title: "Enjoy service", desc: "Relax — our artists take care of the rest." },
];

export function HomeHero() {
  return <HomeHeroAnimated />;
}

/** Makeup feature row — matches salon “five pillars” with image, price, book CTA. */
export function HomeMakeupServices() {
  return (
    <HomeCategoryServicesRow
      kicker="Makeup services"
      title="Signature looks for every celebration"
      subtitle="Bridal, walima, and event artistry — priced clearly, booked in one step."
      cards={homeMakeupCards}
      viewAllHref="/services/makeup"
      viewAllLabel="Makeup menu"
      sectionIndex="01"
    />
  );
}

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
                <div className="relative aspect-[5/6] sm:aspect-[4/5] overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
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

export function HomeWhy() {
  const reasons = [
    { title: "Doorstep luxury", desc: "Full salon setup at your home — no salon visit needed." },
    { title: "Bridal specialists", desc: "Makeup, mehndi & hair artists for your full wedding journey." },
    { title: "Honest pricing", desc: "Clear rates on every service — no hidden charges at arrival." },
  ];
  return (
    <HomeSection tone="gold-mist">
      <HomeSectionHeader
        kicker="Why us"
        title="The Huma promise"
        subtitle="Three reasons families across Jhelum, Dina & Gujrat choose us for every celebration."
        index="08"
      />
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {reasons.map((r, idx) => (
          <Reveal key={r.title} delay={idx * 0.1} scale>
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

export function HomeSteps() {
  return (
    <HomeSection tone="velvet">
      <HomeSectionHeader
        kicker="Process"
        title="Your journey"
        subtitle="From first message to final touch-up — a calm, clear booking flow at your home."
        index="10"
      />
      <div className="home-steps-grid">
        {steps.map((s, idx) => (
          <Reveal key={s.n} delay={idx * 0.08}>
            <div className="home-step-card">
              <span className="home-step-card__badge">{s.n}</span>
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

export function HomeTestimonials() {
  return (
    <HomeSection tone="midnight">
      <HomeSectionHeader
        kicker="Testimonials"
        title="Loved by our clients"
        subtitle="Brides, party guests, and families who booked us at home."
        index="13"
      />
      <div className="mx-auto max-w-3xl">
        <TestimonialSlider />
      </div>
    </HomeSection>
  );
}

export function HomeCta() {
  const trustPoints = [
    "Certified staff",
    "Hygiene protocol",
    "Premium products",
    "On-time slots",
  ] as const;
  const proof = [
    { name: "Areeba K.", event: "Bridal", line: "Makeup stayed flawless for 12+ hours." },
    { name: "Hina M.", event: "Party", line: "Quick service, polished look, right on time." },
  ] as const;

  return (
    <HomeSection tone="gold-mist">
      <Reveal>
        <div className="home-cta-trust mx-auto max-w-5xl">
          {trustPoints.map((point) => (
            <div key={point} className="home-cta-trust__pill">
              {point}
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:mt-10 sm:grid-cols-2">
          {proof.map((p) => (
            <div key={p.name} className="home-why-card">
              <p className="text-sm leading-relaxed text-white/85">{p.line}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                {p.name} · {p.event}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal scale>
        <div className="home-cta-finale mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="home-cta-finale__ornament" aria-hidden />
          <h2 className="text-headline-lg">Book your appointment now</h2>
          <p className="mx-auto mt-6 max-w-md text-body-default leading-relaxed text-white/75">
            Tell us your preferred date — we will confirm within 48 hours.
          </p>
          <Link
            href="/book"
            className="btn-gold-premium mt-10 inline-flex px-14 py-4 text-xs hover-scale-up"
          >
            Schedule visit
          </Link>
        </div>
      </Reveal>
    </HomeSection>
  );
}
