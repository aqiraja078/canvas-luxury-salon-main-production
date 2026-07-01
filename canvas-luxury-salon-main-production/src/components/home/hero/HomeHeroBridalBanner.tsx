type Props = {
  footnote?: string;
};

export function HomeHeroBridalBanner({ footnote }: Props) {
  if (!footnote?.trim()) return null;

  const parts = footnote
    .split(/[—–-]\s*home service/i)[0]
    .split(/[·•]/)
    .map((part) => part.trim())
    .filter(Boolean);

  const services =
    parts.length > 1
      ? parts.slice(1).join(" · ").replace(/\s*[—–-].*/, "")
      : footnote.replace(/\s*[—–-]\s*home service.*/i, "").trim();

  return (
    <div className="hero-luxury__bridal-banner hero-luxury__reveal hero-luxury__reveal--9">
      <span className="hero-luxury__bridal-banner-star" aria-hidden="true">
        ★
      </span>
      <div className="hero-luxury__bridal-banner-copy">
        <p className="hero-luxury__bridal-banner-title">Bridal Specialist</p>
        <p className="hero-luxury__bridal-banner-text">{services || footnote}</p>
      </div>
    </div>
  );
}
