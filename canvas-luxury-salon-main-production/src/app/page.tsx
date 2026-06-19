import {
  HomeCta,
  HomeHero,
  HomeMakeupServices,
  HomeSteps,
  HomeTestimonials,
  HomeWhy,
} from "@/components/home/HomeSections";
import { HomeTeamDynamic } from "@/components/home/HomeDynamic";
import {
  HomeHairServices,
  HomeFacialServices,
  HomeWaxingServices,
  HomeMehndiServices,
} from "@/components/home/HomeCategorySections";
import { HomeServiceOffersSection } from "@/components/home/HomeServiceOffersSection";

export default function HomePage() {
  return (
    <main className="home-landing">
      <HomeHero />
      <HomeMakeupServices />
      <HomeServiceOffersSection />
      <HomeHairServices />
      <HomeFacialServices />
      <HomeWaxingServices />
      <HomeMehndiServices />
      <HomeWhy />
      <HomeTeamDynamic />
      <HomeSteps />
      <HomeTestimonials />
      <HomeCta />
    </main>
  );
}
