import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import { unstable_noStore as noStore } from "next/cache";
import type { CmsAboutPage } from "@/lib/cms-types";
import { buildDefaultAboutPage } from "@/lib/about-page-defaults";
import { normalizeAboutPage } from "@/lib/about-page-normalize";

const KEY = "about-page";

async function ensureSeeded(): Promise<void> {
  const stored = await readCmsJson<CmsAboutPage | null>(KEY, null);
  if (stored) return;
  await writeCmsJson(KEY, buildDefaultAboutPage());
}

export async function getAboutPage(): Promise<CmsAboutPage> {
  noStore();
  await ensureSeeded();
  const stored = await readCmsJson<CmsAboutPage | null>(KEY, null);
  return normalizeAboutPage(stored);
}

export async function saveAboutPage(page: CmsAboutPage): Promise<CmsAboutPage> {
  const next: CmsAboutPage = {
    ...normalizeAboutPage(page),
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(KEY, next);
  return next;
}

export { normalizeAboutPage } from "@/lib/about-page-normalize";
