import Link from "next/link";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import {
  HomeServiceOffersSlider,
  type HomeOfferSlideItem,
} from "@/components/home/HomeServiceOffersSlider";
import type { CmsHomeSectionMeta, CmsOffer } from "@/lib/cms-types";

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
    imageUrl: offer.imageUrl,
  };
}

type Props = {
  meta: CmsHomeSectionMeta;
  offers: CmsOffer[];
};

/** Sync section — offers data must be fetched in the parent page to preserve DOM order below hero. */
export function HomeServiceOffersSection({ meta, offers }: Props) {
  const items = offers.map(offerToSlideItem);

  if (items.length === 0) return null;

  return (
    <HomeSection
      id="home-offers"
      tone="obsidian"
      bleed
      className="home-offers-section !pb-6 sm:!pb-12"
    >
      <div className="home-section__inner">
        <HomeSectionHeader
          kicker={meta.kicker}
          title={meta.title}
          subtitle={meta.subtitle}
          index={meta.sectionIndex}
        />
      </div>

      <div className="mt-0 sm:mt-3">
        <HomeServiceOffersSlider items={items} />
      </div>

      <div className="home-section__inner mt-3 flex justify-center sm:mt-5">
        <Link
          href="/offers"
          className="inline-flex min-h-[44px] w-full max-w-xs items-center justify-center rounded-full border border-gold/45 bg-gold/10 px-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold/15 sm:w-auto"
        >
          View all offers
        </Link>
      </div>
    </HomeSection>
  );
}
