import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const heroImage =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85";

const trustItems = [
  {
    value: "3 cities",
    label: "Jhelum · Dina · Gujrat",
    hint: "We travel to you",
  },
  {
    value: "8AM – 10PM",
    label: "Morning to evening",
    hint: "Flexible home slots",
  },
  {
    value: "Full setup",
    label: "Light · mirror · kit",
    hint: "Salon at your door",
  },
  {
    value: "48 hrs",
    label: "Booking confirmed",
    hint: "Clear quote upfront",
  },
] as const;

export function HomeHeroAnimated() {
  const salonName = site.name.split(" ")[0];

  return (
    <section className="home-hero" aria-label="Welcome">
      <div className="home-hero__media">
        <Image
          src={heroImage}
          alt="Luxury home beauty service atmosphere"
          fill
          priority
          className="home-hero__image object-cover object-[center_38%] sm:object-[center_32%] md:object-[center_28%]"
          sizes="100vw"
        />
      </div>

      <div className="home-hero__overlay" aria-hidden="true" />
      <span className="home-hero__monogram" aria-hidden="true">
        {salonName.charAt(0)}
      </span>
      <div className="home-hero__frame" aria-hidden="true" />

      <div className="home-hero__shell">
        <div className="home-hero__content">
          <div className="home-hero__badge-row home-hero__reveal home-hero__reveal--1">
            <span className="home-hero__badge">
              <span className="home-hero__badge-dot" aria-hidden="true" />
              Doorstep luxury · {salonName}
            </span>
          </div>

          <div className="home-hero__kicker-wrap home-hero__reveal home-hero__reveal--2">
            <span className="home-hero__kicker-line" aria-hidden="true" />
            <p className="home-hero__kicker">{site.tagline}</p>
            <span className="home-hero__kicker-line" aria-hidden="true" />
          </div>

          <h1 className="home-hero__title home-hero__reveal home-hero__reveal--3">
            <span className="home-hero__title-line">Salon-grade beauty,</span>
            <span className="home-hero__title-accent">without leaving home</span>
          </h1>

          <div className="home-hero__lead-wrap home-hero__reveal home-hero__reveal--4">
            <span className="home-hero__lead-accent" aria-hidden="true" />
            <p className="home-hero__lead">{site.description}</p>
          </div>

          <div className="home-hero__actions home-hero__reveal home-hero__reveal--5">
            <Link href="/book" className="home-hero__btn home-hero__btn--primary">
              Book appointment
            </Link>
            <Link href="/services" className="home-hero__btn home-hero__btn--ghost">
              Explore services
            </Link>
          </div>

          <p className="home-hero__footnote home-hero__reveal home-hero__reveal--6">
            Bridal · Mehndi · Hair · Skin · Nails — one message away on WhatsApp
          </p>
        </div>

        <div className="home-hero__trust-wrap">
          {trustItems.map((stat, idx) => (
            <div
              key={stat.label}
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
