import { randomUUID } from "crypto";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsOffer } from "@/lib/cms-types";

const KEY = "offers";

async function ensureSeeded() {
  const list = await readCmsJson<CmsOffer[]>(KEY, []);
  if (list.length > 0) return;
  const ts = new Date().toISOString();
  const seed: CmsOffer[] = [
    {
      id: randomUUID(),
      title: "Bridal Beauty Package",
      description:
        "Complete bridal prep — makeup trial, mehndi consultation, and glow facial.",
      discountLabel: "20% OFF",
      originalPrice: "Rs. 35,000",
      offerPrice: "Rs. 28,000",
      includedServices: ["Bridal Trial", "Bridal Makeup Barat", "Bridal Mehndi"],
      promoCode: "BRIDAL20",
      featured: true,
      active: true,
      sortOrder: 0,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      title: "Party Ready Glow",
      description:
        "Party makeup with hair styling — perfect for weddings and celebrations.",
      discountLabel: "15% OFF",
      originalPrice: "Rs. 12,000",
      offerPrice: "Rs. 10,200",
      includedServices: ["Party Makeup", "Hair Styling"],
      featured: true,
      active: true,
      sortOrder: 1,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      title: "Eid Mehndi Special",
      description: "Beautiful Arabic mehndi designs for Eid and family gatherings.",
      discountLabel: "Rs. 500 OFF",
      originalPrice: "Rs. 2,500",
      offerPrice: "Rs. 2,000",
      includedServices: ["Arabic Mehndi (Hands)"],
      promoCode: "EID2026",
      featured: false,
      active: true,
      sortOrder: 2,
      createdAt: ts,
      updatedAt: ts,
    },
  ];
  await writeCmsJson(KEY, seed);
}

export async function getOffers(): Promise<CmsOffer[]> {
  await ensureSeeded();
  return (await readCmsJson<CmsOffer[]>(KEY, [])).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getActiveOffers(): Promise<CmsOffer[]> {
  const now = Date.now();
  return (await getOffers()).filter((o) => {
    if (!o.active) return false;
    if (o.startsAt && Date.parse(o.startsAt) > now) return false;
    if (o.endsAt && Date.parse(o.endsAt) < now) return false;
    return true;
  });
}

export async function saveOffers(offers: CmsOffer[]): Promise<void> {
  await writeCmsJson(KEY, offers);
}

export async function createOffer(
  input: Omit<CmsOffer, "id" | "createdAt" | "updatedAt">
): Promise<CmsOffer> {
  const list = await getOffers();
  const ts = new Date().toISOString();
  const offer: CmsOffer = { ...input, id: randomUUID(), createdAt: ts, updatedAt: ts };
  list.push(offer);
  await saveOffers(list);
  return offer;
}

export async function updateOffer(
  id: string,
  patch: Partial<Omit<CmsOffer, "id" | "createdAt">>
): Promise<CmsOffer | null> {
  const list = await getOffers();
  const idx = list.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await saveOffers(list);
  return list[idx];
}

export async function deleteOffer(id: string): Promise<boolean> {
  const list = await getOffers();
  const next = list.filter((o) => o.id !== id);
  if (next.length === list.length) return false;
  await saveOffers(next);
  return true;
}
