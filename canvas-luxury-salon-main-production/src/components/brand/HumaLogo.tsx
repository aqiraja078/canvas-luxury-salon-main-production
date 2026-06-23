import { HumaBrandLogo } from "@/components/brand/HumaBrandLogo";
import { HumaLogoMark } from "@/components/brand/HumaLogoMark";
import { HumaLogoOrnate } from "@/components/brand/HumaLogoOrnate";
import { site } from "@/lib/site";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "full" | "mark" | "wordmark" | "ornate" | "brand";

type Props = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
};

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 40,
  md: 46,
  lg: 52,
};

const ORNATE_WIDTH: Record<LogoSize, number> = {
  sm: 120,
  md: 148,
  lg: 176,
};

const [brandPrimary, ...brandRest] = site.name.split(" ");
const brandSecondary = brandRest.join(" ").toUpperCase();

function LogoWordmark({ size }: { size: LogoSize }) {
  const primarySize =
    size === "lg"
      ? "text-xl sm:text-2xl"
      : size === "md"
        ? "text-lg sm:text-xl"
        : "text-base xs:text-lg";

  const secondarySize =
    size === "lg"
      ? "text-[10px] tracking-[0.32em]"
      : size === "md"
        ? "text-[9px] tracking-[0.28em]"
        : "text-[8px] tracking-[0.24em] xs:text-[9px]";

  return (
    <div className="min-w-0 leading-none">
      <span className={`huma-logo__gold-name block font-display ${primarySize}`}>
        {brandPrimary}
      </span>
      <span className={`huma-logo__gold-tag mt-1 block font-display ${secondarySize}`}>
        {brandSecondary}
      </span>
    </div>
  );
}

export function HumaLogo({
  variant = "full",
  size = "md",
  className = "",
}: Props) {
  if (variant === "brand" || variant === "full") {
    return <HumaBrandLogo size={size} className={className} />;
  }

  if (variant === "ornate") {
    return (
      <HumaLogoOrnate width={ORNATE_WIDTH[size]} className={className} title={site.name} />
    );
  }

  const markSize = MARK_SIZE[size];

  if (variant === "mark") {
    return <HumaLogoMark size={markSize} className={className} title={site.name} />;
  }

  if (variant === "wordmark") {
    return (
      <div className={`huma-logo huma-logo--wordmark ${className}`.trim()}>
        <LogoWordmark size={size} />
      </div>
    );
  }

  return (
    <div className={`huma-logo flex items-center gap-2.5 sm:gap-3 ${className}`.trim()}>
      <HumaLogoMark size={markSize} title={site.name} />
      <LogoWordmark size={size} />
    </div>
  );
}
