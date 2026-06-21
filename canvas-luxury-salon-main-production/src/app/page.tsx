import { HomeCta, HomeSteps, HomeTestimonials, HomeWhy } from "@/components/home/HomeSections";
import { HomeTeamDynamic } from "@/components/home/HomeDynamic";
import { HomeHero } from "@/components/home/HomeHeroAnimated";
import { HomeCategoryServicesRow } from "@/components/home/HomeCategoryServicesRow";
import { HomeServiceOffersSection } from "@/components/home/HomeServiceOffersSection";
import { activeHomeCards, getHomePage } from "@/lib/home-page-store";

export default async function HomePage() {
  const home = await getHomePage();

  return (
    <main className="home-landing">
      <HomeHero hero={home.hero} />
      <HomeCategoryServicesRow
        kicker={home.makeup.kicker}
        title={home.makeup.title}
        subtitle={home.makeup.subtitle}
        cards={activeHomeCards(home.makeup.cards)}
        viewAllHref={home.makeup.viewAllHref}
        viewAllLabel={home.makeup.viewAllLabel}
        sectionIndex={home.makeup.sectionIndex}
        variant={home.makeup.variant}
      />
      <HomeServiceOffersSection meta={home.offers} />
      <HomeCategoryServicesRow
        kicker={home.hair.kicker}
        title={home.hair.title}
        subtitle={home.hair.subtitle}
        cards={activeHomeCards(home.hair.cards)}
        viewAllHref={home.hair.viewAllHref}
        viewAllLabel={home.hair.viewAllLabel}
        sectionIndex={home.hair.sectionIndex}
        variant={home.hair.variant}
      />
      <HomeCategoryServicesRow
        kicker={home.facial.kicker}
        title={home.facial.title}
        subtitle={home.facial.subtitle}
        cards={activeHomeCards(home.facial.cards)}
        viewAllHref={home.facial.viewAllHref}
        viewAllLabel={home.facial.viewAllLabel}
        sectionIndex={home.facial.sectionIndex}
        variant={home.facial.variant}
      />
      <HomeCategoryServicesRow
        kicker={home.nails.kicker}
        title={home.nails.title}
        subtitle={home.nails.subtitle}
        cards={activeHomeCards(home.nails.cards)}
        viewAllHref={home.nails.viewAllHref}
        viewAllLabel={home.nails.viewAllLabel}
        sectionIndex={home.nails.sectionIndex}
        variant={home.nails.variant}
      />
      <HomeCategoryServicesRow
        kicker={home.waxing.kicker}
        title={home.waxing.title}
        subtitle={home.waxing.subtitle}
        cards={activeHomeCards(home.waxing.cards)}
        viewAllHref={home.waxing.viewAllHref}
        viewAllLabel={home.waxing.viewAllLabel}
        sectionIndex={home.waxing.sectionIndex}
        variant={home.waxing.variant}
      />
      <HomeCategoryServicesRow
        kicker={home.mehndi.kicker}
        title={home.mehndi.title}
        subtitle={home.mehndi.subtitle}
        cards={activeHomeCards(home.mehndi.cards)}
        viewAllHref={home.mehndi.viewAllHref}
        viewAllLabel={home.mehndi.viewAllLabel}
        sectionIndex={home.mehndi.sectionIndex}
        variant={home.mehndi.variant}
      />
      <HomeWhy section={home.why} />
      <HomeTeamDynamic meta={home.team} />
      <HomeSteps section={home.steps} />
      <HomeTestimonials section={home.testimonials} />
      <HomeCta cta={home.cta} />
    </main>
  );
}
