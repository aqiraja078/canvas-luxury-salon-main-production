import type { ServiceMenuSection } from "@/components/services/service-menu-mappers";
import { findHairServiceByName } from "@/lib/hair-services-data";

export function enrichHairMenuSections(
  sections: ServiceMenuSection[]
): ServiceMenuSection[] {
  return sections.map((section) => ({
    ...section,
    services: section.services.map((item) => {
      if (item.lengthPricing && Object.keys(item.lengthPricing).length > 0) {
        return item;
      }
      const hair = findHairServiceByName(item.name);
      if (!hair) return item;
      return {
        ...item,
        lengthPricing: hair.lengthPricing,
      };
    }),
  }));
}
