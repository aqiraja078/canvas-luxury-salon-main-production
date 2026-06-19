import Link from "next/link";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import {
  HomeServiceOffersSlider,
  type HomeOfferSlideItem,
} from "@/components/home/HomeServiceOffersSlider";
import type { CmsOffer } from "@/lib/cms-types";
import { getActiveOffers } from "@/lib/offers-store";
import { site } from "@/lib/site";

function offerToSlideItem(offer: CmsOffer): HomeOfferSlideItem {
  const iconName = offer.includedServices[0] || offer.title;
  let price = offer.offerPrice || offer.discountLabel;
  if (offer.offerPrice && offer.originalPrice) {
    price = `${offer.offerPrice}`;
  }

  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    discountLabel: offer.discountLabel,
    price,
    originalPrice: offer.originalPrice,
    promoCode: offer.promoCode,
    iconName,
    includedServices: offer.includedServices,
  };
}

export async function HomeServiceOffersSection() {
  const offers = await getActiveOffers();
  const items = offers.map(offerToSlideItem);

  if (items.length === 0) return null;

  return (
    <HomeSection tone="obsidian" bleed>
      <div className="home-section__inner">
        <HomeSectionHeader
          kicker="Limited offers"
          title="Packages & special deals"
          subtitle={`${items.length} active offer${items.length === 1 ? "" : "s"} from ${site.name} — swipe through our best home-service packages.`}
          index="02"
        />
      </div>

      <div className="mt-2 sm:mt-4">
        <HomeServiceOffersSlider items={items} />
      </div>

      <div className="home-section__inner mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
        <Link
          href="/offers"
          className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full border border-gold/45 bg-gold/10 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold/15 sm:w-auto"
        >
          View all offers
        </Link>
        <Link
          href="/book"
          className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:border-gold/40 sm:w-auto"
        >
          Book now
        </Link>
      </div>
    </HomeSection>
  );
}
