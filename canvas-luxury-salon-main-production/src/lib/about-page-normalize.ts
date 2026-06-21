import type { CmsAboutPage } from "@/lib/cms-types";
import { buildDefaultAboutPage } from "@/lib/about-page-defaults";

export function normalizeAboutPage(
  stored: Partial<CmsAboutPage> | null | undefined
): CmsAboutPage {
  const defaults = buildDefaultAboutPage();
  if (!stored) return defaults;

  return {
    ...defaults,
    ...stored,
    hero: {
      ...defaults.hero,
      ...stored.hero,
      cities: stored.hero?.cities?.length ? stored.hero.cities : defaults.hero.cities,
    },
    story: {
      ...defaults.story,
      ...stored.story,
      timeline: stored.story?.timeline?.length
        ? stored.story.timeline
        : defaults.story.timeline,
    },
    team: { ...defaults.team, ...stored.team },
    pillars: {
      ...defaults.pillars,
      ...stored.pillars,
      items: stored.pillars?.items?.length ? stored.pillars.items : defaults.pillars.items,
    },
    stats: stored.stats?.length ? stored.stats : defaults.stats,
    coverage: {
      ...defaults.coverage,
      ...stored.coverage,
      cities: stored.coverage?.cities?.length
        ? stored.coverage.cities
        : defaults.coverage.cities,
    },
    homeKit: {
      ...defaults.homeKit,
      ...stored.homeKit,
      items: stored.homeKit?.items?.length ? stored.homeKit.items : defaults.homeKit.items,
    },
    cta: {
      ...defaults.cta,
      ...stored.cta,
      buttons: stored.cta?.buttons?.length ? stored.cta.buttons : defaults.cta.buttons,
    },
    updatedAt: stored.updatedAt ?? defaults.updatedAt,
  };
}
