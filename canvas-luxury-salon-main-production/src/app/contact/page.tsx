import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ContactPremiumCard } from "@/components/contact/ContactPremiumCard";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} — home beauty in Jhelum, Dina & Gujrat. WhatsApp, call, or book online.`,
};

const FAQ = [
  {
    q: "Do you only serve Jhelum, Dina, and Gujrat?",
    a: "Yes — we offer doorstep home service in these three areas. Share your location on WhatsApp before we confirm your slot.",
    icon: "◎",
    accent: 0,
  },
  {
    q: "How far in advance should I book bridal or event services?",
    a: "For bridal makeup, mehndi, and hair, we recommend booking at least 2–4 weeks ahead. During peak season, book early to secure your preferred date and time.",
    icon: "◆",
    accent: 1,
  },
  {
    q: "How does payment work?",
    a: "Advance or full payment is agreed on WhatsApp — usually cash on the day of service or an agreed advance. Online payment is not available on the site; we confirm details by call or WhatsApp.",
    icon: "◇",
    accent: 2,
  },
  {
    q: "Are travel or home visit charges extra?",
    a: "Charges may vary by location and service. Tell us your area and chosen service via the booking form or WhatsApp — we will share a clear quote.",
    icon: "✦",
    accent: 3,
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes — please let us know on WhatsApp as soon as possible. Late cancellations on bridal dates may be subject to our policy; we handle every case fairly.",
    icon: "◈",
    accent: 4,
  },
] as const;

const AREAS = [
  { name: "Jhelum", accent: 0 },
  { name: "Dina", accent: 1 },
  { name: "Gujrat", accent: 2 },
] as const;

export default function ContactPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="flex flex-col items-center px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="contact-page-main mx-auto w-full max-w-2xl text-center">
          <Reveal className="w-full">
            <div className="contact-hero w-full">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">Say hello</p>
              <h1 className="mt-3 font-display text-3xl text-white xs:text-4xl sm:text-5xl md:text-6xl">
                Contact
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Call, WhatsApp, or book online — whatever suits you best. We reply quickly
                and help you choose the right service and time slot.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm text-gold-light/90">
                WhatsApp is usually the fastest way to reach us — we often reply within 30
                minutes.
              </p>
              <div className="contact-hero-cta mt-6">
                <Link
                  href="/book"
                  className="contact-hero-btn contact-hero-btn--primary"
                >
                  Book appointment
                </Link>
                <div className="contact-hero-row contact-hero-row--2">
                  <a
                    href={`https://wa.me/${site.phoneDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-hero-btn contact-hero-btn--whatsapp"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:+${site.phoneDigits}`}
                    className="contact-hero-btn contact-hero-btn--call"
                  >
                    Call now
                  </a>
                </div>
                <div className="contact-hero-row contact-hero-row--3">
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-hero-btn contact-hero-btn--link"
                  >
                    Instagram
                  </a>
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-hero-btn contact-hero-btn--link"
                  >
                    TikTok
                  </a>
                  <Link
                    href="/courses"
                    className="contact-hero-btn contact-hero-btn--courses"
                  >
                    Courses
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-14 w-full">
            <ContactPremiumCard
              className="contact-coverage-card"
              title="Coverage details"
              badge="Home service"
              accent={3}
              icon={
                <span className="font-display text-xl text-gold-light" aria-hidden>
                  ◎
                </span>
              }
            >
                <p>
                  We provide doorstep services in these areas with appointment-based
                  slots.
                </p>

                <p className="mt-4 text-sm text-white/70 sm:hidden">
                  <span className="font-display text-white">Jhelum · Dina · Gujrat</span>
                  {" — "}
                  doorstep service in all three areas.
                </p>

                <div className="contact-area-grid hidden sm:grid">
                  {AREAS.map((area) => (
                    <div
                      key={area.name}
                      className="flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-gold/25 bg-black/30 px-3 py-3 text-center"
                    >
                      <p className="font-display text-base text-white">{area.name}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/45">
                        Doorstep service
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-gold-light/80">
                  Scheduling
                </p>
                <p className="contact-schedule-box">
                  Home service timings: 8:00 AM – 10:00 PM
                </p>
                <p className="mt-3">
                  Typical response time is under 30 minutes on WhatsApp. Early booking
                  is recommended for bridal and event dates.
                </p>
              </ContactPremiumCard>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 w-full max-w-7xl">
          <Reveal delay={0.12}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">FAQ</p>
              <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
                Common questions
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55">
                Answers to questions we hear most often — if you need anything else,
                message us on WhatsApp.
              </p>
            </div>
            <ul className="contact-faq-grid">
              {FAQ.map((item) => (
                <li key={item.q}>
                  <ContactPremiumCard
                    title={item.q}
                    badge="FAQ"
                    accent={item.accent}
                    titleAs="h3"
                    icon={
                      <span className="font-display text-lg text-gold-light" aria-hidden>
                        {item.icon}
                      </span>
                    }
                  >
                    <p>{item.a}</p>
                  </ContactPremiumCard>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Link
                href="/book"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black"
              >
                Ready to book?
              </Link>
              <a
                href={`https://wa.me/${site.phoneDigits}?text=${encodeURIComponent("Hello, I would like more information about your services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gold/40 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold"
              >
                Ask on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
