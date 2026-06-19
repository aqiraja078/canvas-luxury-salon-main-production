import { randomUUID } from "crypto";
import { bodySpaServiceSections } from "@/lib/body-spa-services-data";
import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { facialServiceSections } from "@/lib/facial-services-data";
import { hairServiceSections } from "@/lib/hair-services-data";
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

export function buildSeedServices(): CmsService[] {
  const items: CmsService[] = [];
  let order = 0;

  const push = (
    categorySlug: ServiceCategorySlug,
    section: { id: string; emoji: string; title: string },
    service: {
      name: string;
      description: string;
      price: string;
      duration?: string;
    }
  ) => {
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
      duration: service.duration,
      imageUrl: CATEGORY_IMAGES[categorySlug],
      featured: false,
      sortOrder: order++,
      active: true,
      createdAt: now(),
      updatedAt: now(),
    });
  };

  for (const section of hairServiceSections) {
    for (const s of section.services) {
      push("hair", section, {
        name: s.name,
        description: s.hint,
        price: s.price,
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

  for (const section of bodySpaServiceSections) {
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
      categorySlug: "body-spa",
      section: {
        id: "waxing",
        emoji: "✨",
        title: "Body waxing",
      },
      services: [
        {
          name: "Body Waxing",
          description: "Full or partial waxing with gentle prep and aftercare.",
          price: "From Rs. 2,500",
        },
      ],
    },
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
