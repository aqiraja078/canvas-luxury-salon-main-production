import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { facialServiceSections } from "@/lib/facial-services-data";
import { hairServiceSections } from "@/lib/hair-services-data";
import { makeupServiceSections } from "@/lib/makeup-services-data";
import { mehndiServiceSections } from "@/lib/mehndi-services-data";
import { nailsServiceSections } from "@/lib/nails-services-data";
import {
  WAX_SECTION_IDS,
  waxingServiceSections,
} from "@/lib/waxing-services-data";

export type ServiceSectionOption = {
  id: string;
  emoji: string;
  title: string;
};

const SEED_SECTIONS: Record<ServiceCategorySlug, ServiceSectionOption[]> = {
  hair: hairServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
  makeup: makeupServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
  facial: facialServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
  "body-spa": waxingServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
  nails: nailsServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
  mehndi: mehndiServiceSections.map((s) => ({
    id: s.id,
    emoji: s.emoji,
    title: s.title,
  })),
};

function sectionKey(section: Pick<ServiceSectionOption, "id" | "title">) {
  return `${section.id}:${section.title}`;
}

export function getServiceSectionsForCategory(
  categorySlug: ServiceCategorySlug,
  existingServices: CmsService[] = []
): ServiceSectionOption[] {
  const fromSeed = SEED_SECTIONS[categorySlug] ?? [];
  const fromCms = existingServices
    .filter((s) => {
      if (s.categorySlug !== categorySlug) return false;
      if (categorySlug === "body-spa") return WAX_SECTION_IDS.has(s.sectionId);
      return true;
    })
    .map((s) => ({
      id: s.sectionId,
      emoji: s.sectionEmoji,
      title: s.sectionTitle,
    }));

  const seen = new Set<string>();
  const merged: ServiceSectionOption[] = [];

  for (const section of [...fromSeed, ...fromCms]) {
    const key = sectionKey(section);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(section);
  }

  return merged;
}

export function applySectionToForm(
  section: ServiceSectionOption | undefined
): Pick<CmsService, "sectionId" | "sectionEmoji" | "sectionTitle"> {
  if (!section) {
    return { sectionId: "", sectionEmoji: "✨", sectionTitle: "" };
  }
  return {
    sectionId: section.id,
    sectionEmoji: section.emoji,
    sectionTitle: section.title,
  };
}
