import Link from "next/link";
import type { CmsOffer } from "@/lib/cms-types";

type OfferCardProps = {
  offer: CmsOffer;
};

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <article className="card-premium-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-black to-black shadow-deep-gold">
      {offer.imageUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-2xl font-bold text-gold-light sm:text-3xl">
          {offer.discountLabel}
        </p>
        <h3 className="mt-3 font-display text-xl text-white sm:text-2xl">
          {offer.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
          {offer.description}
        </p>
        {(offer.originalPrice || offer.offerPrice) && (
          <p className="mt-4 text-base">
            {offer.originalPrice ? (
              <span className="mr-3 text-white/40 line-through">
                {offer.originalPrice}
              </span>
            ) : null}
            {offer.offerPrice ? (
              <span className="font-semibold text-gold-light">{offer.offerPrice}</span>
            ) : null}
          </p>
        )}
        {offer.includedServices.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {offer.includedServices.slice(0, 4).map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
        {offer.promoCode ? (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gold">
            Code: {offer.promoCode}
          </p>
        ) : null}
        <Link
          href={`/book?service=${encodeURIComponent(offer.title)}`}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/20 sm:w-auto sm:px-8"
        >
          Claim offer
        </Link>
      </div>
    </article>
  );
}
