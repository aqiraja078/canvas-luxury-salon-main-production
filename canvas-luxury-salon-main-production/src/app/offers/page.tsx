import { OffersPageView } from "@/components/offers/OffersPageView";
import { getActiveOffers } from "@/lib/offers-store";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Offers & Packages",
  description: `Exclusive beauty deals, bridal packages, and limited-time offers from ${site.name}.`,
  path: "/offers",
});

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <div className="offers-page-wrap">
      <OffersPageView offers={offers} />
    </div>
  );
}
