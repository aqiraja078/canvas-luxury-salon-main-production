import type { CmsAboutStat } from "@/lib/cms-types";

function StatIcon({ index }: { index: number }) {
  const cls = "about-stats__icon-svg";
  switch (index % 4) {
    case 0:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M6 20c0-3.5 2.8-5.5 6-5.5s6 2 6 5.5" strokeLinecap="round" />
          <path d="M16 4.5 17.5 3M17.5 6.5 19 5" strokeLinecap="round" />
        </svg>
      );
    case 1:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="6" y="4" width="12" height="16" rx="1.5" />
          <path d="M9 8h6M9 12h4" strokeLinecap="round" />
          <path d="m14.5 15.5 1.5 1.5 3-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 2:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M4 12c2-2 4.5-3 8-3s6 1 8 3" strokeLinecap="round" />
          <path d="M6 12v3.5c0 1 1.5 2.5 3 2.5M18 12v3.5c0 1-1.5 2.5-3 2.5" strokeLinecap="round" />
          <path d="M9.5 14.5c.8.8 1.8 1.2 2.5 1.2s1.7-.4 2.5-1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10Z" strokeLinejoin="round" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      );
  }
}

function ChevronSeparator() {
  return (
    <div className="about-stats__sep" aria-hidden>
      <svg viewBox="0 0 28 200" preserveAspectRatio="none" className="about-stats__sep-svg">
        <line x1="28" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1.2" />
        <line x1="28" y1="200" x2="0" y2="100" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="12" cy="100" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}

export function AboutStatsBanner({ stats }: { stats: CmsAboutStat[] }) {
  return (
    <section className="about-stats" aria-label="Highlights">
      <div className="about-stats__wrap">
        <div className="about-stats__frame">
          <svg
            className="about-stats__shape about-stats__shape--mobile"
            viewBox="0 0 1200 360"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="about-stats-fill-m" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#121212" />
                <stop offset="50%" stopColor="#090909" />
                <stop offset="100%" stopColor="#101010" />
              </linearGradient>
              <linearGradient id="about-stats-stroke-m" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(201,169,98,0.35)" />
                <stop offset="50%" stopColor="rgba(232,213,163,0.75)" />
                <stop offset="100%" stopColor="rgba(201,169,98,0.35)" />
              </linearGradient>
            </defs>
            <path
              d="M 22 3 Q 3 3 3 22 V 338 Q 3 357 22 357 H 1178 Q 1197 357 1197 338 V 22 Q 1197 3 1178 3 H 22 Z"
              fill="url(#about-stats-fill-m)"
              stroke="url(#about-stats-stroke-m)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg
            className="about-stats__shape about-stats__shape--desktop"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="about-stats-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#121212" />
                <stop offset="50%" stopColor="#090909" />
                <stop offset="100%" stopColor="#101010" />
              </linearGradient>
              <linearGradient id="about-stats-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(201,169,98,0.35)" />
                <stop offset="50%" stopColor="rgba(232,213,163,0.75)" />
                <stop offset="100%" stopColor="rgba(201,169,98,0.45)" />
              </linearGradient>
            </defs>
            <path
              d="M 28 4 Q 4 4 4 28 V 192 Q 4 216 28 216 H 1040 L 1196 110 L 1040 4 H 28 Z"
              fill="url(#about-stats-fill)"
              stroke="url(#about-stats-stroke)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span className="about-stats__flare about-stats__flare--top" aria-hidden />
          <span className="about-stats__flare about-stats__flare--bottom" aria-hidden />
          <span className="about-stats__dots about-stats__dots--tl" aria-hidden />
          <span className="about-stats__dots about-stats__dots--br" aria-hidden />

          <div className="about-stats__grid">
            {stats.map((stat, idx) => (
              <div key={stat.id} className="about-stats__cell">
                {idx > 0 ? <ChevronSeparator /> : null}
                <div className="about-stats__content">
                  <span className="about-stats__icon" aria-hidden>
                    <StatIcon index={idx} />
                  </span>
                  <p className="about-stats__value">{stat.value}</p>
                  <span className="about-stats__rule" aria-hidden>
                    <span className="about-stats__diamond">◆</span>
                  </span>
                  <p className="about-stats__label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
