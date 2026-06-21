import { randomUUID } from "crypto";
import { parsePriceLabelAmount } from "@/lib/admin-dashboard-stats";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { buildFacialSeedServices, buildHairSeedServices, buildMakeupSeedServices, buildMehndiSeedServices, buildNailsSeedServices, buildSeedServices, buildWaxSeedServices } from "@/lib/services-seed";
import { getUniqueServiceDescription } from "@/lib/service-descriptions";
import { WAX_SECTION_IDS } from "@/lib/waxing-services-data";

const KEY = "services";
const SEEDED_KEY = "services-seeded";
const DESCRIPTIONS_SYNC_KEY = "services-descriptions-v3";
const WAX_MENU_SYNC_KEY = "services-wax-menu-v3";
const FACIAL_MENU_SYNC_KEY = "services-facial-menu-v1";
const MAKEUP_MENU_SYNC_KEY = "services-makeup-menu-v1";
const NAILS_MENU_SYNC_KEY = "services-nails-menu-v1";
const MEHNDI_MENU_SYNC_KEY = "services-mehndi-menu-v2";
const HAIR_MENU_SYNC_KEY = "services-hair-menu-v1";

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

/** Replace body-spa rows with the current wax menu (owner prices & categories). */
async function ensureWaxMenuSynced() {
  const synced = await readCmsJson<boolean>(WAX_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutBodySpa = list.filter((s) => s.categorySlug !== "body-spa");
  const maxOrder = withoutBodySpa.reduce(
    (max, s) => Math.max(max, s.sortOrder),
    -1
  );
  const waxServices = buildWaxSeedServices(maxOrder + 1);

  await writeCmsJson(KEY, [...withoutBodySpa, ...waxServices]);
  await writeCmsJson(WAX_MENU_SYNC_KEY, true);
}

/** Replace facial rows with the current facial menu (owner prices & categories). */
async function ensureFacialMenuSynced() {
  const synced = await readCmsJson<boolean>(FACIAL_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutFacial = list.filter((s) => s.categorySlug !== "facial");
  const existingFacial = list.filter((s) => s.categorySlug === "facial");
  const startOrder =
    existingFacial.length > 0
      ? Math.min(...existingFacial.map((s) => s.sortOrder))
      : withoutFacial.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
  const facialServices = buildFacialSeedServices(startOrder);

  await writeCmsJson(KEY, [...withoutFacial, ...facialServices]);
  await writeCmsJson(FACIAL_MENU_SYNC_KEY, true);
}

/** Replace makeup rows with the current makeup menu (owner prices & categories). */
async function ensureMakeupMenuSynced() {
  const synced = await readCmsJson<boolean>(MAKEUP_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutMakeup = list.filter((s) => s.categorySlug !== "makeup");
  const existingMakeup = list.filter((s) => s.categorySlug === "makeup");
  const startOrder =
    existingMakeup.length > 0
      ? Math.min(...existingMakeup.map((s) => s.sortOrder))
      : withoutMakeup.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
  const makeupServices = buildMakeupSeedServices(startOrder);

  await writeCmsJson(KEY, [...withoutMakeup, ...makeupServices]);
  await writeCmsJson(MAKEUP_MENU_SYNC_KEY, true);
}

/** Replace nails rows with the current nails menu (owner prices & categories). */
async function ensureNailsMenuSynced() {
  const synced = await readCmsJson<boolean>(NAILS_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutNails = list.filter((s) => s.categorySlug !== "nails");
  const existingNails = list.filter((s) => s.categorySlug === "nails");
  const startOrder =
    existingNails.length > 0
      ? Math.min(...existingNails.map((s) => s.sortOrder))
      : withoutNails.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
  const nailsServices = buildNailsSeedServices(startOrder);

  await writeCmsJson(KEY, [...withoutNails, ...nailsServices]);
  await writeCmsJson(NAILS_MENU_SYNC_KEY, true);
}

/** Replace mehndi rows with the current mehndi menu (owner prices & categories). */
async function ensureMehndiMenuSynced() {
  const synced = await readCmsJson<boolean>(MEHNDI_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutMehndi = list.filter((s) => s.categorySlug !== "mehndi");
  const existingMehndi = list.filter((s) => s.categorySlug === "mehndi");
  const startOrder =
    existingMehndi.length > 0
      ? Math.min(...existingMehndi.map((s) => s.sortOrder))
      : withoutMehndi.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
  const mehndiServices = buildMehndiSeedServices(startOrder);

  await writeCmsJson(KEY, [...withoutMehndi, ...mehndiServices]);
  await writeCmsJson(MEHNDI_MENU_SYNC_KEY, true);
}

/** Replace hair rows with the current hair menu (owner prices & categories). */
async function ensureHairMenuSynced() {
  const synced = await readCmsJson<boolean>(HAIR_MENU_SYNC_KEY, false);
  if (synced) return;

  const list = await readCmsJson<CmsService[]>(KEY, []);
  if (list.length === 0) return;

  const withoutHair = list.filter((s) => s.categorySlug !== "hair");
  const existingHair = list.filter((s) => s.categorySlug === "hair");
  const startOrder =
    existingHair.length > 0
      ? Math.min(...existingHair.map((s) => s.sortOrder))
      : withoutHair.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;
  const hairServices = buildHairSeedServices(startOrder);

  await writeCmsJson(KEY, [...withoutHair, ...hairServices]);
  await writeCmsJson(HAIR_MENU_SYNC_KEY, true);
}

export async function getServices(): Promise<CmsService[]> {
  await ensureSeeded();
  await ensureDescriptionsSynced();
  await ensureWaxMenuSynced();
  await ensureFacialMenuSynced();
  await ensureMakeupMenuSynced();
  await ensureNailsMenuSynced();
  await ensureMehndiMenuSynced();
  await ensureHairMenuSynced();
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
  const list = (await getActiveServices()).filter(
    (s) => s.categorySlug === categorySlug
  );
  if (categorySlug !== "body-spa") return list;
  return list.filter((s) => WAX_SECTION_IDS.has(s.sectionId));
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

  for (const section of sections.values()) {
    section.services.sort((a, b) => {
      const priceValue = (label: string) => {
        const amount = parsePriceLabelAmount(label);
        return amount === 0 && !/\d/.test(label)
          ? Number.POSITIVE_INFINITY
          : amount;
      };
      const byPrice = priceValue(a.price) - priceValue(b.price);
      return byPrice !== 0 ? byPrice : a.name.localeCompare(b.name);
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
      services.filter((s) => {
        if (s.categorySlug !== slug) return false;
        if (slug === "body-spa") {
          return WAX_SECTION_IDS.has(s.sectionId);
        }
        return true;
      })
    ),
  })).filter((c) => c.sections.some((sec) => sec.services.length > 0));
}

export async function getBookingServiceNames(): Promise<string[]> {
  const services = await getActiveServices();
  return Array.from(new Set(services.map((s) => s.name))).sort((a, b) =>
    a.localeCompare(b)
  );
}
