import { HomeHeroLuxury } from "@/components/home/hero/HomeHeroLuxury";
import type { CmsHomeHero } from "@/lib/cms-types";

export function HomeHero({ hero }: { hero: CmsHomeHero }) {
  return <HomeHeroLuxury hero={hero} />;
}
