import Link from "next/link";

type Props = {
  serviceName: string;
  variant?: "outline" | "gold";
  className?: string;
};

/** Consistent book CTA used on all service cards site-wide. */
export function ServiceBookButton({
  serviceName,
  variant = "outline",
  className = "",
}: Props) {
  const base = "btn-service-book";
  const variantClass =
    variant === "gold" ? "btn-service-book--gold" : "btn-service-book--outline";

  return (
    <Link
      href={`/book?service=${encodeURIComponent(serviceName)}`}
      className={`${base} ${variantClass} ${className}`.trim()}
    >
      BOOK NOW
    </Link>
  );
}
