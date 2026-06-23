import { randomUUID } from "crypto";
import { waxingServiceSections } from "@/lib/waxing-services-data";
import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { facialServiceSections } from "@/lib/facial-services-data";
import {
  type HairLengthPricing,
  hairServiceSections,
} from "@/lib/hair-services-data";
import { makeupServiceSections } from "@/lib/makeup-services-data";
import { mehndiServiceSections } from "@/lib/mehndi-services-data";
import { nailsServiceSections } from "@/lib/nails-services-data";
import { getUniqueServiceDescription } from "@/lib/service-descriptions";
import { serviceCategories } from "@/lib/site";

const CATEGORY_IMAGES: Record<ServiceCategorySlug, string> = {
  hair: serviceCategories.find((c) => c.slug === "hair")!.image,
  facial: serviceCategories.find((c) => c.slug === "facial")!.image,
  "body-spa": serviceCategories.find((c) => c.slug === "body-spa")!.image,
  nails: serviceCategories.find((c) => c.slug === "nails")!.image,
  mehndi: serviceCategories.find((c) => c.slug === "mehndi")!.image,
  makeup: serviceCategories.find((c) => c.slug === "makeup")!.image,
};

function now() {
  return new Date().toISOString();
}

type PushFn = (
  categorySlug: ServiceCategorySlug,
  section: { id: string; emoji: string; title: string },
  service: {
    name: string;
    description: string;
    price: string;
    duration?: string;
    lengthPricing?: HairLengthPricing;
  }
) => void;

function createPush(items: CmsService[], startOrder: number): { push: PushFn; nextOrder: () => number } {
  let order = startOrder;
  const push: PushFn = (categorySlug, section, service) => {
    items.push({
      id: randomUUID(),
      categorySlug,
      sectionId: section.id,
      sectionEmoji: section.emoji,
      sectionTitle: section.title,
      name: service.name,
      description: getUniqueServiceDescription(
        service.name,
        categorySlug,
        section.title,
        service.description
      ),
      price: service.price,
      lengthPricing: service.lengthPricing,
      duration: service.duration,
      imageUrl: CATEGORY_IMAGES[categorySlug],
      featured: false,
      sortOrder: order++,
      active: true,
      createdAt: now(),
      updatedAt: now(),
    });
  };
  return { push, nextOrder: () => order };
}

/** Replaceable facial menu rows for CMS sync. */
export function buildFacialSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of facialServiceSections) {
    for (const s of section.services) {
      push("facial", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  return items;
}

/** Replaceable makeup menu rows for CMS sync. */
export function buildMakeupSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of makeupServiceSections) {
    for (const s of section.services) {
      push("makeup", section, {
        name: s.name,
        description: s.hint,
        price: s.price,
      });
    }
  }

  return items;
}

/** Replaceable hair menu rows for CMS sync. */
export function buildHairSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of hairServiceSections) {
    for (const s of section.services) {
      push("hair", section, {
        name: s.name,
        description: s.hint,
        price: s.price,
        lengthPricing: s.lengthPricing,
      });
    }
  }

  return items;
}

/** Replaceable mehndi menu rows for CMS sync. */
export function buildMehndiSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of mehndiServiceSections) {
    for (const s of section.services) {
      push("mehndi", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  return items;
}

/** Replaceable nails menu rows for CMS sync. */
export function buildNailsSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of nailsServiceSections) {
    for (const s of section.services) {
      push("nails", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  return items;
}

/** Replaceable wax menu rows for CMS sync (body-spa category). */
export function buildWaxSeedServices(startOrder = 0): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, startOrder);

  for (const section of waxingServiceSections) {
    for (const s of section.services) {
      push("body-spa", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  return items;
}

export function buildSeedServices(): CmsService[] {
  const items: CmsService[] = [];
  const { push } = createPush(items, 0);

  for (const section of hairServiceSections) {
    for (const s of section.services) {
      push("hair", section, {
        name: s.name,
        description: s.hint,
        price: s.price,
        lengthPricing: s.lengthPricing,
      });
    }
  }

  for (const section of makeupServiceSections) {
    for (const s of section.services) {
      push("makeup", section, {
        name: s.name,
        description: s.hint,
        price: s.price,
      });
    }
  }

  for (const section of facialServiceSections) {
    for (const s of section.services) {
      push("facial", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  for (const section of waxingServiceSections) {
    for (const s of section.services) {
      push("body-spa", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  for (const section of nailsServiceSections) {
    for (const s of section.services) {
      push("nails", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  for (const section of mehndiServiceSections) {
    for (const s of section.services) {
      push("mehndi", section, {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
      });
    }
  }

  const extras: Array<{
    categorySlug: ServiceCategorySlug;
    section: { id: string; emoji: string; title: string };
    services: Array<{
      name: string;
      description: string;
      price: string;
    }>;
  }> = [
    {
      categorySlug: "hair",
      section: {
        id: "laser",
        emoji: "💫",
        title: "Advanced hair reduction",
      },
      services: [
        {
          name: "Laser Hair Removal",
          description: "Consultation-based sessions for long-term hair reduction.",
          price: "Consult for quote",
        },
      ],
    },
  ];

  for (const group of extras) {
    for (const s of group.services) {
      push(group.categorySlug, group.section, s);
    }
  }

  return items;
}
