import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryServiceCard } from "@/components/services/CategoryServiceCard";
import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import { ServiceCategoryHero } from "@/components/services/ServiceCategoryHero";
import { enrichHairMenuSections } from "@/lib/hair-menu";
import {
  getActiveServices,
  groupAllServicesByCategory,
} from "@/lib/services-store";
import type { ServiceCategorySlug } from "@/lib/cms-types";
import { serviceCategories, site } from "@/lib/site";

const SLUG_THEME: Record<ServiceCategorySlug, ServiceThemeId> = {
  hair: "hair",
  makeup: "makeup",
  facial: "facial",
  "body-spa": "bodySpa",
  nails: "nails",
  mehndi: "mehndi",
};

export async function AllServicesPage() {
  const services = await getActiveServices();
  const grouped = groupAllServicesByCategory(services);
  const total = services.length;

  return (
    <div className="pt-[max(5.5rem,env(safe-area-inset-top,0px))] sm:pt-28">
      <section className="relative overflow-hidden border-b border-white/5 px-4 pb-8 sm:px-6 sm:pb-12 md:px-8 md:pb-14">
        <ServiceCategoryHero
          theme="all"
          icon="✨"
          highlight={`${total} services · Home visit`}
        />
        <div className="relative z-[1] mx-auto max-w-7xl pt-8 sm:pt-10">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.38em] text-gold xs:text-xs">
              Full menu · {site.name}
            </p>
            <h1 className="mt-2 font-display text-[2rem] leading-[1.08] text-white xs:text-4xl sm:mt-3 sm:text-5xl md:text-6xl">
              All services
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-5 sm:text-base">
              Browse every hair, makeup, facial, wax, nails, and mehndi service
              in one place — scroll the full menu below.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-8"
              >
                Book now
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-gold/45 sm:w-auto sm:px-8"
              >
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {grouped.map((cat, catIdx) => {
        const meta = serviceCategories.find((c) => c.slug === cat.slug);
        if (!meta) return null;
        const theme = SLUG_THEME[cat.slug];
        const sections =
          cat.slug === "hair"
            ? enrichHairMenuSections(cat.sections)
            : cat.sections;
        const serviceCount = sections.reduce(
          (n, sec) => n + sec.services.length,
          0
        );

        return (
          <section
            key={cat.slug}
            id={cat.slug}
            className={`scroll-mt-28 border-t border-white/5 px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16 ${
              catIdx % 2 === 1 ? "bg-white/[0.02]" : ""
            }`}
          >
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-gold xs:text-xs">
                      {serviceCount} services
                    </p>
                    <h2 className="mt-1 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                      {meta.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/60">
                      {meta.short}
                    </p>
                  </div>
                  <Link
                    href={meta.href}
                    className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold transition hover:bg-gold/15"
                  >
                    {meta.title} only →
                  </Link>
                </div>
                <div className="mt-3 h-px w-20 bg-gradient-to-r from-gold/70 to-transparent" />
              </Reveal>

              {sections.map((section) => (
                <div key={section.id} className="mt-8 sm:mt-10">
                  <Reveal>
                    <h3 className="font-display text-lg text-white sm:text-xl">
                      <span className="mr-2" aria-hidden>
                        {section.emoji}
                      </span>
                      {section.title}
                    </h3>
                  </Reveal>
                  <div className="service-grid mt-5 sm:mt-6">
                    {section.services.map((item, idx) => (
                      <Reveal
                        key={item.id || item.name}
                        delay={Math.min(idx * 0.02, 0.15)}
                      >
                        <CategoryServiceCard item={item} theme={theme} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm leading-relaxed text-white/55 sm:text-base">
              Need help choosing? Book a consultation — we guide you to the
              right services for your occasion across Jhelum, Dina, and Gujrat.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/book?service=Consultation%20%2F%20Trial"
                className="inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-10"
              >
                Book consultation
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 sm:w-auto"
              >
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
