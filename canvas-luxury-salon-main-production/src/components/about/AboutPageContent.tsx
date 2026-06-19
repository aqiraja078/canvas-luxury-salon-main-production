import Image from "next/image";
import Link from "next/link";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import { Reveal } from "@/components/ui/Reveal";
import { getActiveTeamMembers } from "@/lib/team-store";
import { site } from "@/lib/site";

const salonName = site.name.split(" ")[0];

const PILLARS = [
  {
    num: "01",
    title: "We come to you",
    text: "Professional lighting, sanitised kit, and a calm setup — your home becomes our studio for the day.",
  },
  {
    num: "02",
    title: "Bridal-first care",
    text: "Makeup, mehndi, and hair artists who understand walima, mehndi night, and barat timelines.",
  },
  {
    num: "03",
    title: "Honest & warm",
    text: "Clear pricing before we arrive. The patience we would give our own family on wedding day.",
  },
] as const;

const TIMELINE = [
  {
    year: "Day one",
    title: "Built for home beauty",
    text: "Huma started with one belief — every woman deserves salon results without leaving her home.",
  },
  {
    year: "Growing",
    title: "Bridal specialists joined",
    text: "Senior makeup artists, mehndi designers, and hair stylists came together for full wedding journeys.",
  },
  {
    year: "Today",
    title: "Three cities, one promise",
    text: "Jhelum, Dina, and Gujrat — same hygiene standards, same premium products, same calm care.",
  },
] as const;

const STATS = [
  { value: "10+", label: "Years collective expertise" },
  { value: "100%", label: "Consultation-first approach" },
  { value: "1:1", label: "Trials for major events" },
  { value: "3", label: "Cities we serve" },
] as const;

const CITIES = [
  {
    name: "Jhelum",
    note: "Our busiest home-service zone — bridal, party, and everyday beauty.",
  },
  {
    name: "Dina",
    note: "Dedicated doorstep visits with the same premium kit and artists.",
  },
  {
    name: "Gujrat",
    note: "Full wedding prep — makeup, mehndi, hair, and skin rituals at home.",
  },
] as const;

const HOME_KIT = [
  "Professional ring light & mirror setup",
  "Sanitised tools & fresh disposable kits",
  "Premium branded makeup & skin products",
  "Clean setup, calm service, tidy breakdown",
] as const;

const heroImage =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=85";

export async function AboutPageContent() {
  const team = await getActiveTeamMembers();
  const featuredTeam = team.slice(0, 3);

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <Image
          src={heroImage}
          alt={`${site.name} team at work`}
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="about-hero__shade" aria-hidden />
        <span className="about-hero__monogram" aria-hidden>
          {salonName.charAt(0)}
        </span>
        <div className="about-hero__frame" aria-hidden />

        <div className="about-hero__inner">
          <Reveal>
            <p className="text-caption-golden">Our story</p>
            <h1 className="about-hero__title mt-4">
              Artistry rooted in{" "}
              <span className="about-hero__accent">care & calm</span>
            </h1>
            <p className="about-hero__lead mt-6 max-w-2xl">
              {site.name} brings senior stylists and makeup artists to your doorstep
              across Jhelum, Dina, and Gujrat — salon-grade results, zero travel stress.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <span key={c.name} className="about-hero__pill">
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
                <Image
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85"
                  alt="Bridal makeup artistry"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="about-story-visual__quote">
                <p className="font-display text-lg text-gold-light">Salon results.</p>
                <p className="font-display text-lg text-white">Your doorstep.</p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <HomeSectionHeader
              kicker="Who we are"
              title={
                <>
                  Your home, our{" "}
                  <span className="text-gold-light">quiet luxury studio</span>
                </>
              }
              subtitle="We were built for brides, working women, and families who want premium beauty without the salon rush."
              align="left"
              index="01"
            />
            <Reveal delay={0.08}>
              <p className="text-base leading-relaxed text-white/72 sm:text-lg">
                {site.name} combines senior makeup artists, mehndi designers, hair
                stylists, and skin specialists who share one goal: make you feel
                unmistakably yourself — only more radiant.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
                From bridal trials to quick party refreshes, every appointment gets the
                same patience, hygiene standards, and eye for detail. We invest in
                premium products and continuous training so your results look as
                beautiful in photographs as they do in person.
              </p>
            </Reveal>

            <div className="about-timeline mt-12">
              {TIMELINE.map((item, idx) => (
                <Reveal key={item.title} delay={0.06 + idx * 0.06}>
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

      {/* Pillars */}
      <HomeSection tone="obsidian">
        <HomeSectionHeader
          kicker="Our values"
          title="Three pillars of the Huma promise"
          subtitle="What stays the same — whether it is bridal prep or a quick glow facial."
          index="02"
        />
        <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {PILLARS.map((p, idx) => (
            <Reveal key={p.title} delay={idx * 0.08} scale>
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

      {/* Stats band */}
      <section className="about-stat-band" aria-label="Highlights">
        <div className="about-stat-band__inner">
          {STATS.map((s, idx) => (
            <Reveal key={s.label} delay={idx * 0.06}>
              <div className="about-stat-band__item">
                <p className="about-stat-band__value">{s.value}</p>
                <p className="about-stat-band__label">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cities */}
      <HomeSection tone="gold-mist">
        <HomeSectionHeader
          kicker="Coverage"
          title="Home service across Punjab"
          subtitle="We travel to you — share your location on WhatsApp and we confirm your slot."
          index="03"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {CITIES.map((city, idx) => (
            <Reveal key={city.name} delay={idx * 0.08} scale>
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
              kicker="What we bring"
              title="Full salon setup at your door"
              subtitle="Every visit includes professional equipment — not just a bag of products."
              align="left"
              index="04"
            />
            <ul className="about-kit-list">
              {HOME_KIT.map((item, idx) => (
                <Reveal key={item} delay={idx * 0.05}>
                  <li className="about-kit-list__item">
                    <span className="about-kit-list__check" aria-hidden>
                      ✓
                    </span>
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1} scale>
            <blockquote className="about-quote-block">
              <p className="about-quote-block__text">
                &ldquo;We don&apos;t rush beauty. We listen first, prep properly, and
                leave you glowing — that is the Huma way.&rdquo;
              </p>
              <footer className="about-quote-block__footer">
                — {site.name}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </HomeSection>

      {/* Team preview */}
      {featuredTeam.length > 0 ? (
        <HomeSection tone="velvet">
          <HomeSectionHeader
            kicker="The artists"
            title="Meet the team behind your glow"
            subtitle="Certified specialists for bridal makeup, mehndi, hair, and skin."
            index="05"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTeam.map((m, idx) => (
              <Reveal key={m.id} delay={idx * 0.08} scale>
                <article className="home-team-card">
                  <div className="home-team-card__media">
                    {m.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-gold/50">
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl text-white">{m.name}</h3>
                    <p className="text-sm text-gold">{m.role}</p>
                    <p className="mt-2 line-clamp-3 text-sm text-white/60">{m.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </HomeSection>
      ) : null}

      {/* CTA */}
      <HomeSection tone="gold-mist" className="about-cta-section">
        <Reveal scale>
          <div className="about-cta-panel">
            <div className="about-cta-panel__ornament" aria-hidden />
            <p className="text-caption-golden">Ready when you are</p>
            <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Plan your next look at home
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
              Book online or message us on WhatsApp — we confirm within 48 hours and
              share clear pricing before we arrive.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/book" className="btn-gold-premium inline-flex min-h-[48px] px-10">
                Book appointment
              </Link>
              <Link
                href="/courses"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:border-gold/40"
              >
                View courses
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-10 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold/15"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </HomeSection>
    </div>
  );
}
