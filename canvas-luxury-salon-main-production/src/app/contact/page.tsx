import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} — home beauty in Jhelum, Dina & Gujrat. WhatsApp, call, or book online.`,
};

const FAQ = [
  {
    q: "Do you only serve Jhelum, Dina, and Gujrat?",
    a: "Yes — we offer doorstep home service in these three areas. Share your location on WhatsApp before we confirm your slot.",
  },
  {
    q: "How far in advance should I book bridal or event services?",
    a: "For bridal makeup, mehndi, and hair, we recommend booking at least 2–4 weeks ahead. During peak season, book early to secure your preferred date and time.",
  },
  {
    q: "How does payment work?",
    a: "Advance or full payment is agreed on WhatsApp — usually cash on the day of service or an agreed advance. Online payment is not available on the site; we confirm details by call or WhatsApp.",
  },
  {
    q: "Are travel or home visit charges extra?",
    a: "Charges may vary by location and service. Tell us your area and chosen service via the booking form or WhatsApp — we will share a clear quote.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes — please let us know on WhatsApp as soon as possible. Late cancellations on bridal dates may be subject to our policy; we handle every case fairly.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Say hello</p>
            <h1 className="mt-3 font-display text-3xl text-white xs:text-4xl sm:text-5xl md:text-6xl">
              Contact
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Call, WhatsApp, or book online — whatever suits you best. We reply quickly
              and help you choose the right service and time slot.
            </p>
            <p className="mt-3 max-w-2xl text-sm text-gold-light/90">
              WhatsApp is usually the fastest way to reach us — we often reply within 30
              minutes.
            </p>
            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/book"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90"
              >
                Book appointment
              </Link>
              <a
                href={`https://wa.me/${site.phoneDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-emerald-500/35 bg-emerald-500/10 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100 transition hover:bg-emerald-500/20"
              >
                WhatsApp
              </a>
              <a
                href={`tel:+${site.phoneDigits}`}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-white/40"
              >
                Call now
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-gold/50 hover:text-gold"
              >
                Instagram
              </a>
              <a
                href={site.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-gold/50 hover:text-gold"
              >
                TikTok
              </a>
              <Link
                href="/courses"
                className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2.5 text-xs uppercase tracking-wider text-gold-light transition hover:bg-gold/15"
              >
                Beauty courses
              </Link>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="glass-panel h-full rounded-3xl p-8 md:p-10">
                <h2 className="font-display text-2xl text-white">Service areas</h2>
                <p className="mt-6 text-sm leading-relaxed text-white/70">
                  {site.address}
                </p>
                <div className="mt-8 space-y-4 text-sm">
                  <p>
                    <span className="text-white/40">Phone</span>
                    <br />
                    <a
                      href={`tel:+${site.phoneDigits}`}
                      className="text-gold hover:underline"
                    >
                      {site.phone}
                    </a>
                  </p>
                  <p>
                    <span className="text-white/40">Email</span>
                    <br />
                    <a
                      href={`mailto:${site.email}`}
                      className="text-gold hover:underline"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/book"
                    className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/20"
                  >
                    Book online
                  </Link>
                  <a
                    href={`https://wa.me/${site.phoneDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:border-gold/40 hover:text-gold"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="glass-panel h-full rounded-3xl border border-white/10 p-8 md:p-10">
                <h2 className="font-display text-2xl text-white">Coverage details</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  We provide doorstep services in these areas with appointment-based
                  slots.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {["Jhelum", "Dina", "Gujrat"].map((area) => (
                    <div
                      key={area}
                      className="flex min-h-[44px] items-center justify-center rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/90"
                    >
                      {area}
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-light">
                    Scheduling
                  </p>
                  <p className="mt-2 rounded-xl border border-white/12 bg-black/20 px-3 py-2 text-sm font-medium text-white/90">
                    Home service timings: 8:00 AM – 10:00 PM
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Typical response time is under 30 minutes on WhatsApp. Early booking
                    is recommended for bridal and event dates.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mt-16">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.35em] text-gold">FAQ</p>
              <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
                Common questions
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/55">
                Answers to questions we hear most often — if you need anything else, message
                us on WhatsApp.
              </p>
              <ul className="mt-8 space-y-4">
                {FAQ.map((item) => (
                  <li
                    key={item.q}
                    className="rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6"
                  >
                    <h3 className="font-display text-lg text-white">{item.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.a}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
