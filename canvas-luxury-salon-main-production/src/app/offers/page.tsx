import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { OfferCard } from "@/components/offers/OfferCard";
import { getActiveOffers } from "@/lib/offers-store";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offers & Packages",
  description: `Special offers and packages from ${site.name}.`,
};

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <div className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden px-4 pb-12 sm:px-6 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,169,98,0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="text-caption-golden">Limited time</p>
            <h1 className="text-headline-lg mt-3 max-w-3xl">
              Offers &amp; packages
            </h1>
            <p className="mt-5 max-w-2xl text-body-default text-white/70">
              Exclusive deals on bridal, party, and seasonal beauty services —
              home service across Jhelum, Dina, and Gujrat.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Current offers
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/55">
              {offers.length} package{offers.length === 1 ? "" : "s"} — same luxury
              treatment, special savings.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((o, idx) => (
              <Reveal key={o.id} delay={idx * 0.06} scale>
                <OfferCard offer={o} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
