import type { ReactNode } from "react";

export type HomeSectionTone = "velvet" | "obsidian" | "gold-mist" | "midnight";

type HomeSectionProps = {
  tone?: HomeSectionTone;
  className?: string;
  id?: string;
  children: ReactNode;
  /** Skip default max-width inner padding wrapper */
  bleed?: boolean;
};

export function HomeSection({
  tone = "velvet",
  className = "",
  id,
  children,
  bleed = false,
}: HomeSectionProps) {
  return (
    <section
      id={id}
      className={`home-section home-section--${tone} ${className}`.trim()}
    >
      <div className="home-section__ambient" aria-hidden />
      <div className={bleed ? "relative" : "home-section__inner relative"}>
        {children}
      </div>
    </section>
  );
}

type HomeSectionHeaderProps = {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
  index?: string;
};

export function HomeSectionHeader({
  kicker,
  title,
  subtitle,
  align = "center",
  action,
  index,
}: HomeSectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`home-section-header ${centered ? "home-section-header--center" : "home-section-header--left"}`}
    >
      {index ? (
        <span className="home-section-header__index" aria-hidden>
          {index}
        </span>
      ) : null}
      <div className={centered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
        <p className="home-section-header__kicker">{kicker}</p>
        <h2 className="home-section-header__title">{title}</h2>
        {subtitle ? (
          <p className="home-section-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="home-section-header__action">{action}</div> : null}
    </div>
  );
}
