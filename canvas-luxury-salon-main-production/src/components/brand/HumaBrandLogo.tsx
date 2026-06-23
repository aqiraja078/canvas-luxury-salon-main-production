import { HumaLogoMark } from "@/components/brand/HumaLogoMark";
import { site } from "@/lib/site";

type LogoSize = "sm" | "md" | "lg";

type Props = {
  size?: LogoSize;
  className?: string;
};

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 36,
  md: 42,
  lg: 50,
};

const SCRIPT_CLASS: Record<LogoSize, string> = {
  sm: "text-[1.65rem] leading-none",
  md: "text-[1.95rem] sm:text-[2.15rem] leading-none",
  lg: "text-[2.35rem] sm:text-[2.65rem] leading-none",
};

const TAG_CLASS: Record<LogoSize, string> = {
  sm: "mt-0.5 text-[7px] tracking-[0.28em]",
  md: "mt-1 text-[8px] sm:text-[9px] tracking-[0.3em]",
  lg: "mt-1 text-[9px] sm:text-[10px] tracking-[0.32em]",
};

const [, ...brandRest] = site.name.split(" ");
const brandTagline = brandRest.join(" ").toUpperCase();

/** Clean gold lockup — crisp HTML type + ornate monogram (no raster, no SVG text). */
export function HumaBrandLogo({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`huma-brand-logo flex items-center gap-2 sm:gap-2.5 ${className}`.trim()}
      role="img"
      aria-label={site.name}
    >
      <HumaLogoMark size={MARK_SIZE[size]} />
      <div className="min-w-0 leading-none">
        <span
          className={`huma-brand-logo__script font-script block ${SCRIPT_CLASS[size]}`}
        >
          Huma
        </span>
        <span
          className={`huma-brand-logo__tag block font-sans font-medium uppercase ${TAG_CLASS[size]}`}
        >
          {brandTagline}
        </span>
      </div>
    </div>
  );
}
