import type {
  CmsHomeCategorySection,
  CmsHomePage,
} from "@/lib/cms-types";
import { buildDefaultHomePage } from "@/lib/home-page-defaults";
import { mergeHeroFields } from "@/lib/hero-cms-utils";

function mergeCategorySection(
  defaults: CmsHomeCategorySection,
  stored?: Partial<CmsHomeCategorySection>
): CmsHomeCategorySection {
  if (!stored) return defaults;
  return {
    ...defaults,
    ...stored,
    cards: stored.cards?.length ? stored.cards : defaults.cards,
  };
}

/** Fill missing sections when CMS was saved before new home fields existed. */
export function normalizeHomePage(
  stored: Partial<CmsHomePage> | null | undefined
): CmsHomePage {
  const defaults = buildDefaultHomePage();
  if (!stored) return defaults;

  return {
    ...defaults,
    ...stored,
    hero: mergeHeroFields(defaults.hero, stored.hero),
    makeup: mergeCategorySection(defaults.makeup, stored.makeup),
    offers: { ...defaults.offers, ...stored.offers },
    hair: mergeCategorySection(defaults.hair, stored.hair),
    facial: mergeCategorySection(defaults.facial, stored.facial),
    nails: mergeCategorySection(defaults.nails, stored.nails),
    waxing: mergeCategorySection(defaults.waxing, stored.waxing),
    mehndi: mergeCategorySection(defaults.mehndi, stored.mehndi),
    why: {
      ...defaults.why,
      ...stored.why,
      cards: stored.why?.cards?.length ? stored.why.cards : defaults.why.cards,
    },
    team: { ...defaults.team, ...stored.team },
    steps: {
      ...defaults.steps,
      ...stored.steps,
      items: stored.steps?.items?.length ? stored.steps.items : defaults.steps.items,
    },
    testimonials: {
      ...defaults.testimonials,
      ...stored.testimonials,
      items: stored.testimonials?.items?.length
        ? stored.testimonials.items
        : defaults.testimonials.items,
    },
    cta: {
      ...defaults.cta,
      ...stored.cta,
      trustPoints: stored.cta?.trustPoints?.length
        ? stored.cta.trustPoints
        : defaults.cta.trustPoints,
      proofCards: stored.cta?.proofCards?.length
        ? stored.cta.proofCards
        : defaults.cta.proofCards,
    },
    updatedAt: stored.updatedAt ?? defaults.updatedAt,
  };
}

export function homePageNeedsMigration(stored: Partial<CmsHomePage> | null | undefined): boolean {
  if (!stored) return false;
  return !stored.nails;
}
