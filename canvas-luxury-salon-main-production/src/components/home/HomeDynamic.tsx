import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/HomeSection";
import type { CmsService } from "@/lib/cms-types";
import { getActiveOffers } from "@/lib/offers-store";
import { getActiveServices } from "@/lib/services-store";
import type { CmsHomeSectionMeta } from "@/lib/cms-types";
import { getActiveTeamMembers } from "@/lib/team-store";
import { serviceCategories } from "@/lib/site";

export async function HomeServicesDynamic() {
  const services = await getActiveServices();
  const byCategory = new Map<string, CmsService[]>();
  for (const s of services) {
    const list = byCategory.get(s.categorySlug) || [];
    list.push(s);
    byCategory.set(s.categorySlug, list);
  }

  const cards = serviceCategories.map((cat) => {
    const items = byCategory.get(cat.slug) || [];
    const featured = items.find((s) => s.featured && s.imageUrl) || items.find((s) => s.imageUrl);
    const minPrice = items.reduce((min, s) => {
      const num = parseInt(s.price.replace(/\D/g, ""), 10);
      return num && (!min || num < min) ? num : min;
    }, 0);
    return {
      ...cat,
      image: featured?.imageUrl || cat.image,
      price: minPrice ? `Starting at PKR ${minPrice.toLocaleString()}` : cat.price,
      count: items.length,
    };
  });

  return (
    <HomeSection tone="velvet">
      <HomeSectionHeader
        kicker="Services"
        title="Six ways we make you glow"
        subtitle="Every category — makeup, hair, skin, mehndi & more — delivered at your door."
      />
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {cards.map((s, idx) => (
          <Reveal key={s.slug} delay={idx * 0.08} scale>
            <Link href={s.href} className="service-card group relative block overflow-hidden">
              <div className="relative aspect-[5/6] overflow-hidden sm:aspect-[4/5]">
                {s.image.startsWith("/api/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 overlay-dark-light" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,rgba(201,169,98,0.08),transparent)]" />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-gold-light sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-white/70 sm:text-sm">{s.short}</p>
                <p className="mt-3 text-sm font-semibold text-gold-accent">{s.price}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                  {s.count} services
                </p>
                <span className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold opacity-0 transition group-hover:opacity-100">
                  View all →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </HomeSection>
  );
}

export async function HomeOffersDynamic() {
  const offers = await getActiveOffers();
  const featured = offers.find((o) => o.featured) || offers[0];
  if (!featured) return null;

  return (
    <HomeSection tone="midnight">
      <Reveal scale>
        <div className="home-offer-spotlight mx-auto max-w-5xl">
          <p className="home-offer-spotlight__label">
            <span className="h-1 w-1 rounded-full bg-gold" aria-hidden />
            Limited offer
          </p>
          <p className="home-offer-spotlight__discount">{featured.discountLabel}</p>
          <p className="mt-4 text-lg text-white/85">{featured.title}</p>
          <p className="mt-2 text-sm text-white/55">{featured.description}</p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/book?service=${encodeURIComponent(featured.title)}`}
              className="inline-flex rounded-full bg-white px-12 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-nude-muted"
            >
              Claim offer
            </Link>
            <Link
              href="/offers"
              className="inline-flex rounded-full border border-gold/40 px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-gold"
            >
              All offers
            </Link>
          </div>
        </div>
      </Reveal>
    </HomeSection>
  );
}

export async function HomeTeamDynamic({ meta }: { meta: CmsHomeSectionMeta }) {
  const team = await getActiveTeamMembers();

  return (
    <HomeSection tone="obsidian" className="home-team-section">
      <HomeSectionHeader
        kicker={meta.kicker}
        title={meta.title}
        subtitle={meta.subtitle}
        index={meta.sectionIndex}
      />
      {team.length > 0 ? (
        <div className="home-team-section__grid">
          {team.map((m) => (
            <div key={m.id} className="home-team-section__item">
              <article className="home-team-card">
                <div className="home-team-card__media">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.imageUrl} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-gold/50">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-white">{m.name}</h3>
                  <p className="text-sm text-gold">{m.role}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/60">{m.bio}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      ) : (
        <p className="home-team-section__empty">
          Team profiles will appear here once active members are added in admin.
        </p>
      )}
    </HomeSection>
  );
}
