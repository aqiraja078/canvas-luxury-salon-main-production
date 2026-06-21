import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import { parsePriceLabelAmount } from "@/lib/admin-dashboard-stats";
import type { CmsHomeCard, CmsHomePage } from "@/lib/cms-types";
import { buildDefaultHomePage } from "@/lib/home-page-defaults";
import {
  homePageNeedsMigration,
  normalizeHomePage,
} from "@/lib/home-page-normalize";
import type { HomeCategoryCard } from "@/lib/home-category-cards";

const KEY = "home-page";

async function ensureSeeded(): Promise<void> {
  const stored = await readCmsJson<CmsHomePage | null>(KEY, null);
  if (stored) return;
  await writeCmsJson(KEY, buildDefaultHomePage());
}

export async function getHomePage(): Promise<CmsHomePage> {
  await ensureSeeded();
  const stored = await readCmsJson<CmsHomePage | null>(KEY, null);
  const page = normalizeHomePage(stored);
  if (homePageNeedsMigration(stored)) {
    await writeCmsJson(KEY, page);
  }
  return page;
}

export async function saveHomePage(page: CmsHomePage): Promise<CmsHomePage> {
  const next: CmsHomePage = {
    ...normalizeHomePage(page),
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(KEY, next);
  return next;
}

export function activeHomeCards(cards: CmsHomeCard[]): HomeCategoryCard[] {
  return cards
    .filter((c) => c.active)
    .sort((a, b) => {
      const priceValue = (label: string) => {
        const amount = parsePriceLabelAmount(label);
        return amount === 0 && !/\d/.test(label)
          ? Number.POSITIVE_INFINITY
          : amount;
      };
      const byPrice = priceValue(a.price) - priceValue(b.price);
      return byPrice !== 0 ? byPrice : a.sortOrder - b.sortOrder;
    })
    .map(({ id, name, price, image }) => ({ id, name, price, image }));
}

export { normalizeHomePage } from "@/lib/home-page-normalize";
