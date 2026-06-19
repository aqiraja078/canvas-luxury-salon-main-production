import { randomUUID } from "crypto";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { buildSeedServices } from "@/lib/services-seed";
import { getUniqueServiceDescription } from "@/lib/service-descriptions";

const KEY = "services";
const SEEDED_KEY = "services-seeded";
const DESCRIPTIONS_SYNC_KEY = "services-descriptions-v3";

async function ensureSeeded() {
  const seeded = await readCmsJson<boolean>(SEEDED_KEY, false);
  if (seeded) return;
  const services = buildSeedServices();
  await writeCmsJson(KEY, services);
  await writeCmsJson(SEEDED_KEY, true);
  await writeCmsJson(DESCRIPTIONS_SYNC_KEY, true);
}

/** Patch stored descriptions with unique keyword-rich copy (preserves ids & admin edits on other fields). */
async function ensureDescriptionsSynced() {
  const synced = await readCmsJson<boolean>(DESCRIPTIONS_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const updated = list.map((s) => ({
    ...s,
    description: getUniqueServiceDescription(
      s.name,
      s.categorySlug,
      s.sectionTitle,
      s.description
    ),
    updatedAt: new Date().toISOString(),
  }));

  await writeCmsJson(KEY, updated);
  await writeCmsJson(DESCRIPTIONS_SYNC_KEY, true);
}

export async function getServices(): Promise<CmsService[]> {
  await ensureSeeded();
  await ensureDescriptionsSynced();
  const list = await readCmsJson<CmsService[]>(KEY, []);
  return list.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getActiveServices(): Promise<CmsService[]> {
  const list = await getServices();
  return list.filter((s) => s.active);
}

export async function getServicesByCategory(
  categorySlug: ServiceCategorySlug
): Promise<CmsService[]> {
  return (await getActiveServices()).filter(
    (s) => s.categorySlug === categorySlug
  );
}

export async function getServiceById(id: string): Promise<CmsService | null> {
  const list = await getServices();
  return list.find((s) => s.id === id) ?? null;
}

export async function saveServices(services: CmsService[]): Promise<void> {
  await writeCmsJson(KEY, services);
}

export async function createService(
  input: Omit<CmsService, "id" | "createdAt" | "updatedAt">
): Promise<CmsService> {
  const list = await getServices();
  const ts = new Date().toISOString();
  const service: CmsService = {
    ...input,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
    description: getUniqueServiceDescription(
      input.name,
      input.categorySlug,
      input.sectionTitle,
      input.description
    ),
  };
  list.push(service);
  await saveServices(list);
  return service;
}

export async function updateService(
  id: string,
  patch: Partial<Omit<CmsService, "id" | "createdAt">>
): Promise<CmsService | null> {
  const list = await getServices();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await saveServices(list);
  return list[idx];
}

export async function deleteService(id: string): Promise<boolean> {
  const list = await getServices();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  await saveServices(next);
  return true;
}

export function groupServicesForMenu(services: CmsService[]) {
  const sections = new Map<
    string,
    {
      id: string;
      emoji: string;
      title: string;
      services: Array<{
        id: string;
        name: string;
        price: string;
        blurb: string;
        meta?: string;
        imageUrl?: string;
        featured?: boolean;
      }>;
    }
  >();

  for (const s of services) {
    const key = `${s.sectionId}:${s.sectionTitle}`;
    if (!sections.has(key)) {
      sections.set(key, {
        id: s.sectionId,
        emoji: s.sectionEmoji,
        title: s.sectionTitle,
        services: [],
      });
    }
    sections.get(key)!.services.push({
      id: s.id,
      name: s.name,
      price: s.price,
      blurb: s.description,
      meta: s.duration,
      imageUrl: s.imageUrl,
      featured: s.featured,
    });
  }

  return Array.from(sections.values());
}

const ALL_CATEGORY_ORDER: ServiceCategorySlug[] = [
  "hair",
  "makeup",
  "facial",
  "body-spa",
  "nails",
  "mehndi",
];

export function groupAllServicesByCategory(services: CmsService[]) {
  return ALL_CATEGORY_ORDER.map((slug) => ({
    slug,
    sections: groupServicesForMenu(
      services.filter((s) => s.categorySlug === slug)
    ),
  })).filter((c) => c.sections.some((sec) => sec.services.length > 0));
}

export async function getBookingServiceNames(): Promise<string[]> {
  const services = await getActiveServices();
  return Array.from(new Set(services.map((s) => s.name))).sort((a, b) =>
    a.localeCompare(b)
  );
}
