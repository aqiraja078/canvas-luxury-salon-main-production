import type { CmsHomeHeroTrust } from "@/lib/cms-types";

type Props = {
  items: CmsHomeHeroTrust[];
};

function GoogleStars({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-gold ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-sm leading-none sm:text-base">
          ★
        </span>
      ))}
    </span>
  );
}

/** Luxury Google reviews + trust stats rail for the hero. */
export function HomeHeroSocialProof({ items }: Props) {
  const google = items.find((item) => item.label === "Google Reviews") ?? items[0];
  const stats = items.filter((item) => item !== google);

  if (!google && stats.length === 0) return null;

  return (
    <div
      className="home-hero__reveal home-hero__reveal--social mt-6 sm:mt-7"
      aria-label="Client reviews and trust metrics"
    >
      <div className="overflow-hidden rounded-2xl border border-gold/30 bg-black/55 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md">
        {google ? (
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-gold/12 via-gold/5 to-transparent px-4 py-4 sm:gap-4 sm:px-5 sm:py-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.35)] sm:h-11 sm:w-11"
              aria-hidden="true"
            >
              <span className="font-display text-base font-bold text-[#4285F4] sm:text-lg">
                G
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-1"
                aria-label={`Rated ${google.value} on Google`}
              >
                <GoogleStars />
                <span className="font-display text-xl font-bold leading-none text-white sm:text-2xl">
                  {google.value}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90 sm:text-[11px]">
                {google.label}
              </p>
            </div>

            <div className="hidden shrink-0 sm:block">
              <p className="max-w-[9rem] text-right text-[10px] leading-snug text-white/45">
                {google.hint && google.hint !== "★★★★★" ? google.hint : "Top-rated home beauty"}
              </p>
            </div>
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-white/10 xs:grid-cols-3 xs:divide-x xs:divide-y-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center justify-center px-3 py-4 text-center transition-colors hover:bg-gold/[0.04] sm:px-4 sm:py-5"
              >
                <p className="font-display text-2xl font-bold leading-none text-white sm:text-[1.65rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                  {stat.label}
                </p>
                {stat.hint ? (
                  <p className="mt-1 max-w-[11rem] text-[10px] leading-snug text-white/45">
                    {stat.hint}
                  </p>
                ) : null}
                <span
                  className="mt-3 h-px w-8 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
