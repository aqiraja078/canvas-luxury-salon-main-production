import type { CmsHomeHero, CmsHomeHeroTrust } from "@/lib/cms-types";
import type { HeroBottomStat } from "@/components/home/hero/home-hero-constants";

export function isGoogleTrustItem(item: CmsHomeHeroTrust): boolean {
  return item.label.toLowerCase().includes("google");
}

/** Bottom stats bar — all trust rows except Google. */
export function heroBottomStats(trustItems: CmsHomeHeroTrust[]): CmsHomeHeroTrust[] {
  return trustItems.filter((item) => !isGoogleTrustItem(item));
}

export function statIconForLabel(label: string): HeroBottomStat["icon"] {
  const n = label.toLowerCase();
  if (n.includes("client")) return "users";
  if (n.includes("service")) return "sparkles";
  if (n.includes("hygien")) return "shield";
  return "badge";
}

export function mergeHeroFields(
  defaults: CmsHomeHero,
  stored?: Partial<CmsHomeHero>
): CmsHomeHero {
  if (!stored) return defaults;

  return {
    ...defaults,
    ...stored,
    trustItems:
      stored.trustItems && stored.trustItems.length > 0
        ? stored.trustItems
        : defaults.trustItems,
  };
}
