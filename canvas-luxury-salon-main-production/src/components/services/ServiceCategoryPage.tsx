import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCategoryHero } from "@/components/services/ServiceCategoryHero";
import { PremiumServiceCard } from "@/components/services/PremiumServiceCard";
import type { ServiceMenuSection } from "@/components/services/service-menu-mappers";

export type ServiceThemeId =
  | "hair"
  | "makeup"
  | "facial"
  | "bodySpa"
  | "nails"
  | "mehndi";

type Props = {
  theme: ServiceThemeId;
  heroIcon: string;
  heroHighlight?: string;
  kicker: string;
  title: string;
  description: string;
  sections: ServiceMenuSection[];
  footerNote: string;
};

function themeClasses(id: ServiceThemeId) {
  switch (id) {
    case "hair":
      return {
        hero:
          "min-h-[auto] rounded-b-[1.5rem] border-b border-gold/20 sm:rounded-b-[2rem]",
        heroInner:
          "relative z-[1] flex flex-col justify-end pb-8 pt-6 sm:justify-center sm:pb-14 sm:pt-10",
        sectionBgAlt: "bg-white/[0.025]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-1 w-14 rounded-full bg-gold/70",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col border border-y border-r border-white/10 border-l-[3px] border-l-gold/80 bg-white/[0.035] p-4 backdrop-blur-sm transition active:scale-[0.99] sm:rounded-r-2xl sm:p-6",
      };
    case "makeup":
      return {
        hero:
          "min-h-[auto] rounded-b-[2rem] shadow-[0_24px_60px_-28px_rgba(190,80,100,0.35)]",
        heroInner:
          "relative z-[1] flex flex-col justify-end pb-9 sm:justify-center sm:pb-16 sm:pt-8",
        sectionBgAlt: "bg-rose-950/[0.06]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-px w-20 bg-gradient-to-r from-rose-300/60 to-transparent",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-rose-950/30 to-white/[0.03] p-4 ring-1 ring-rose-500/15 backdrop-blur-sm transition active:scale-[0.99] sm:p-6",
      };
    case "facial":
      return {
        hero: "min-h-[auto] border-b border-emerald-500/15",
        heroInner:
          "relative z-[1] flex flex-col justify-end pb-8 sm:justify-center sm:pb-14 sm:pt-6",
        sectionBgAlt: "bg-emerald-950/[0.05]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 h-1 w-12 rounded-full bg-emerald-400/50",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-3xl border border-emerald-900/30 bg-white/[0.04] p-4 backdrop-blur-sm transition active:scale-[0.99] sm:p-6",
      };
    case "bodySpa":
      return {
        hero: "min-h-[auto] border-b border-sky-400/15",
        heroInner:
          "relative z-[1] flex flex-col justify-center pb-9 pt-4 sm:pb-14 sm:pt-8",
        sectionBgAlt: "bg-sky-950/[0.04]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 w-24 border-t-2 border-sky-400/40 border-double",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-xl border border-sky-900/25 bg-gradient-to-br from-sky-950/20 to-white/[0.02] p-4 sm:p-6",
      };
    case "nails":
      return {
        hero: "min-h-[auto] border-b border-fuchsia-400/15",
        heroInner:
          "relative z-[1] flex flex-col justify-end pb-7 sm:justify-center sm:pb-12 sm:pt-4",
        sectionBgAlt: "bg-fuchsia-950/[0.05]",
        h2: "font-display text-[1.5rem] leading-tight text-white xs:text-2xl sm:text-3xl md:text-4xl",
        rule: "mt-2.5 h-0.5 w-16 bg-fuchsia-400/55",
        grid: "mt-7 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:mt-9 sm:gap-4 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-xl border border-fuchsia-900/25 bg-white/[0.04] p-3.5 sm:p-5",
      };
    case "mehndi":
      return {
        hero:
          "min-h-[auto] rounded-b-[1.25rem] border-b-2 border-double border-gold/25 sm:rounded-b-none",
        heroInner:
          "relative z-[1] flex flex-col justify-end pb-8 sm:justify-center sm:pb-14 sm:pt-6",
        sectionBgAlt: "bg-amber-950/[0.07]",
        h2: "font-display text-[1.65rem] leading-tight text-white xs:text-3xl sm:text-4xl md:text-[2.25rem]",
        rule: "mt-3 flex gap-1",
        grid: "mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3",
        card: "flex min-h-0 flex-col rounded-lg border-2 border-double border-gold/35 bg-amber-950/15 p-4 sm:p-6",
      };
    default: {
      const _x: never = id;
      void _x;
      return themeClasses("hair");
    }
  }
}

export function ServiceCategoryPage({
  theme,
  heroIcon,
  heroHighlight,
  kicker,
  title,
  description,
  sections,
  footerNote,
}: Props) {
  const t = themeClasses(theme);

  return (
    <div className="pt-[max(5.5rem,env(safe-area-inset-top,0px))] sm:pt-28">
      <section
        className={`relative overflow-hidden px-4 pb-2 sm:px-6 md:px-8 ${t.hero}`}
      >
        <ServiceCategoryHero
          theme={theme}
          icon={heroIcon}
          highlight={heroHighlight}
        />
        <div className={`mx-auto max-w-7xl ${t.heroInner}`}>
          <Reveal>
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.22em] text-gold/85 hover:text-gold sm:min-h-0"
            >
              ← All services
            </Link>
            <p className="mt-4 text-[10px] uppercase tracking-[0.38em] text-gold xs:text-xs sm:mt-6">
              {kicker}
            </p>
            <h1 className="mt-2 max-w-[18ch] font-display text-[1.85rem] leading-[1.1] text-white xs:max-w-none xs:text-4xl sm:mt-3 sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-6 text-xs font-semibold uppercase tracking-[0.2em] text-black sm:w-auto sm:px-8"
              >
                Book now
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/25 bg-white/[0.04] px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:border-gold/45 sm:w-auto sm:px-8"
              >
                All services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {sections.map((section, si) => (
        <section
          key={section.id}
          id={section.id}
          className={`border-t border-white/5 px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 ${
            si % 2 === 1 ? t.sectionBgAlt : ""
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <h2 className={t.h2}>
                <span className="mr-2 inline-block" aria-hidden>
                  {section.emoji}
                </span>
                {section.title}
              </h2>
              {theme === "mehndi" ? (
                <div className={t.rule} aria-hidden>
                  <span className="h-1 w-6 rounded-full bg-gold/60" />
                  <span className="h-1 w-4 rounded-full bg-gold/40" />
                  <span className="h-1 w-6 rounded-full bg-gold/60" />
                </div>
              ) : (
                <div className={t.rule} aria-hidden />
              )}
            </Reveal>

            <div className="service-grid mt-8 sm:mt-10">
              {section.services.map((item, idx) => (
                <Reveal
                  key={item.id || item.name}
                  delay={Math.min(idx * 0.025, 0.2)}
                >
                  <PremiumServiceCard item={item} theme={theme} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-white/5 px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl px-1 text-center sm:px-0">
          <Reveal>
            <div className="mb-6 grid grid-cols-2 gap-2 sm:mb-8 sm:grid-cols-4">
              {["Certified", "Hygiene", "Premium", "On-time"].map((point) => (
                <span
                  key={point}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/85"
                >
                  {point}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-white/55 sm:text-base">
              {footerNote}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/book?service=${encodeURIComponent("Consultation / Trial")}`}
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
