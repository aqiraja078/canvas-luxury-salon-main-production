type Props = {
  parallaxX?: number;
  parallaxY?: number;
};

export function HomeHeroBackground({ parallaxX = 0, parallaxY = 0 }: Props) {
  const px = parallaxX * 12;
  const py = parallaxY * 10;

  return (
    <div className="hero-luxury__bg" aria-hidden="true">
      <div
        className="hero-luxury__mesh"
        style={{ transform: `translate3d(${px * 0.3}px, ${py * 0.3}px, 0)` }}
      />
      <div
        className="hero-luxury__orb hero-luxury__orb--1"
        style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
      />
      <div
        className="hero-luxury__orb hero-luxury__orb--2"
        style={{ transform: `translate3d(${-px * 0.6}px, ${-py * 0.5}px, 0)` }}
      />
      <div
        className="hero-luxury__orb hero-luxury__orb--3"
        style={{ transform: `translate3d(${px * 0.4}px, ${-py * 0.7}px, 0)` }}
      />

      <svg className="hero-luxury__curve hero-luxury__curve--1" viewBox="0 0 400 400" fill="none">
        <path
          d="M-20 280 C120 180, 220 80, 420 40"
          stroke="url(#heroGoldGrad)"
          strokeWidth="1.2"
          opacity="0.35"
        />
        <defs>
          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="50%" stopColor="#F5E6A7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="hero-luxury__curve hero-luxury__curve--2" viewBox="0 0 400 400" fill="none">
        <path
          d="M400 120 C280 200, 180 300, -20 360"
          stroke="url(#heroGoldGrad2)"
          strokeWidth="1"
          opacity="0.25"
        />
        <defs>
          <linearGradient id="heroGoldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5E6A7" stopOpacity="0" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5E6A7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="hero-luxury__floral" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="48" stroke="rgba(212,175,55,0.12)" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="72" stroke="rgba(245,230,167,0.08)" strokeWidth="0.5" />
        <path
          d="M100 28 C112 52, 108 68, 100 82 C92 68, 88 52, 100 28ZM28 100 C52 88, 68 92, 82 100 C68 108, 52 112, 28 100ZM172 100 C148 112, 132 108, 118 100 C132 92, 148 88, 172 100ZM100 172 C88 148, 92 132, 100 118 C108 132, 112 148, 100 172Z"
          fill="rgba(212,175,55,0.06)"
        />
      </svg>

      <div className="hero-luxury__particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="hero-luxury__particle"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 11) % 100}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-luxury__vignette" />
    </div>
  );
}
