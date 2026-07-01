import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsGalleryItem, CmsGalleryPage } from "@/lib/cms-types";
import { defaultGalleryPage } from "@/lib/gallery-page-defaults";

const ITEMS_KEY = "gallery-items";
const PAGE_KEY = "gallery-page";

async function ensurePageSeeded() {
  const existing = await readCmsJson<CmsGalleryPage | null>(PAGE_KEY, null);
  if (existing) return;
  await writeCmsJson(PAGE_KEY, defaultGalleryPage());
}

async function ensureItemsSeeded() {
  const list = await readCmsJson<CmsGalleryItem[] | null>(ITEMS_KEY, null);
  if (list !== null) return;

  const ts = new Date().toISOString();
  const seed: CmsGalleryItem[] = [
    {
      id: randomUUID(),
      category: "before-after",
      mediaType: "before-after",
      title: "Bridal glow transformation",
      caption: "Pre-bridal facial + HD makeup",
      beforeImageUrl:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=85",
      afterImageUrl:
        "https://images.unsplash.com/photo-1522337360788-8b13dee2a3a0?w=800&q=85",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      category: "bridal",
      mediaType: "image",
      title: "Walima bridal glam",
      imageUrl:
        "https://i.pinimg.com/736x/ae/98/b3/ae98b360d36f7de2f3779737997f291a.jpg",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      category: "hair",
      mediaType: "image",
      title: "Balayage refresh",
      imageUrl:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=85",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      category: "facial",
      mediaType: "image",
      title: "Pre-bridal glow facial",
      imageUrl:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=85",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      category: "mehndi",
      mediaType: "image",
      title: "Dense bridal mehndi",
      imageUrl:
        "https://i.pinimg.com/736x/ae/84/5f/ae845fba0f519d795710e90bf6a866ec.jpg",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  await writeCmsJson(ITEMS_KEY, seed);
}

export async function getGalleryItems(): Promise<CmsGalleryItem[]> {
  noStore();
  await ensurePageSeeded();
  await ensureItemsSeeded();
  return (await readCmsJson<CmsGalleryItem[]>(ITEMS_KEY, [])).sort(
    (a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt)
  );
}

export async function getActiveGalleryItems(): Promise<CmsGalleryItem[]> {
  return (await getGalleryItems()).filter((i) => i.active);
}

export async function getGalleryPage(): Promise<CmsGalleryPage> {
  noStore();
  await ensurePageSeeded();
  return await readCmsJson<CmsGalleryPage>(PAGE_KEY, defaultGalleryPage());
}

export async function updateGalleryPage(
  patch: Partial<Omit<CmsGalleryPage, "updatedAt">>
): Promise<CmsGalleryPage> {
  const current = await getGalleryPage();
  const next: CmsGalleryPage = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(PAGE_KEY, next);
  return next;
}

export async function createGalleryItem(
  input: Omit<CmsGalleryItem, "id" | "createdAt" | "updatedAt">
): Promise<CmsGalleryItem> {
  const list = await getGalleryItems();
  const ts = new Date().toISOString();
  const item: CmsGalleryItem = {
    ...input,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(item);
  await writeCmsJson(ITEMS_KEY, list);
  return item;
}

export async function updateGalleryItem(
  id: string,
  patch: Partial<Omit<CmsGalleryItem, "id" | "createdAt">>
): Promise<CmsGalleryItem | null> {
  const list = await getGalleryItems();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(ITEMS_KEY, list);
  return list[idx];
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const list = await getGalleryItems();
  const next = list.filter((i) => i.id !== id);
  if (next.length === list.length) return false;
  await writeCmsJson(ITEMS_KEY, next);
  return true;
}
