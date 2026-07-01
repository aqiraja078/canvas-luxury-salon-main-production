const FEATURES = [
  {
    label: "Best Deals Everyday",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8.5 9.5c.8-1.2 2-1.8 3.5-1.8 2.2 0 3.5 1.4 3.5 3 0 2.2-2.4 2.6-3.5 4.1-.3.4-.5.9-.5 1.4h-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="17.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Expert Professionals",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4l1.2 2.4 2.7.4-2 1.9.5 2.7L12 10.2 9.6 11.4l.5-2.7-2-1.9 2.7-.4L12 4z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 18.5c1.2-2.2 3.3-3.5 5.5-3.5s4.3 1.3 5.5 3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="13" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Doorstep Service",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 01-1 1h-5v-5.5H10.5V21h-5a1 1 0 01-1-1v-9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "100% Safe & Hygienic",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3.5l6.5 2.8v5.2c0 4.2-2.8 7.4-6.5 8.5-3.7-1.1-6.5-4.3-6.5-8.5V6.3L12 3.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

export function OffersHeroFeatures() {
  return (
    <div className="offers-hero-ref__features">
      {FEATURES.map(({ label, icon }) => (
        <div key={label} className="offers-hero-ref__feature">
          <span className="offers-hero-ref__feature-icon">{icon}</span>
          <p className="offers-hero-ref__feature-label">{label}</p>
        </div>
      ))}
    </div>
  );
}
