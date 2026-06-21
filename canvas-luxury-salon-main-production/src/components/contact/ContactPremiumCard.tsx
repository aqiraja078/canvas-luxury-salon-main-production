import type { ReactNode } from "react";

type Props = {
  title: string;
  badge?: string;
  icon: ReactNode;
  accent?: number;
  featured?: boolean;
  children: ReactNode;
  className?: string;
  titleAs?: "h2" | "h3";
};

function CardDecorations() {
  return (
    <>
      <span className="premium-service-card__flare premium-service-card__flare--tl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--tr" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--bl" aria-hidden />
      <span className="premium-service-card__flare premium-service-card__flare--br" aria-hidden />
      <svg
        className="premium-service-card__vine premium-service-card__vine--left"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 44 C8 36 6 28 12 22 C16 18 14 12 18 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M10 30 C14 28 16 24 14 20 M16 18 C20 16 22 12 20 8"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <svg
        className="premium-service-card__vine premium-service-card__vine--right"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden
      >
        <path
          d="M44 44 C40 36 42 28 36 22 C32 18 34 12 30 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M38 30 C34 28 32 24 34 20 M32 18 C28 16 26 12 28 8"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className="premium-service-card__stars" aria-hidden />
    </>
  );
}

export function ContactPremiumCard({
  title,
  badge = "Contact",
  icon,
  accent = 0,
  featured = false,
  children,
  className = "",
  titleAs: TitleTag = "h2",
}: Props) {
  const accentClass = `premium-service-card--accent-${accent % 6}`;

  return (
    <article
      className={`premium-service-card premium-service-card--contact ${accentClass} ${featured ? "premium-service-card--featured" : ""} ${className}`.trim()}
    >
      <CardDecorations />
      <span className="premium-service-card__badge">{badge}</span>
      <div className="premium-service-card__icon-ring">{icon}</div>
      <TitleTag className="premium-service-card__title">{title}</TitleTag>
      <div className="premium-service-card__contact-body">{children}</div>
    </article>
  );
}
