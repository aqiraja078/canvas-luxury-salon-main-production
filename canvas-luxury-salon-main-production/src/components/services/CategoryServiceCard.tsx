import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";
import { HairServiceCard } from "@/components/services/HairServiceCard";
import { PremiumServiceCard } from "@/components/services/PremiumServiceCard";
import type { ServiceMenuItem } from "@/components/services/service-menu-mappers";

type Props = {
  item: ServiceMenuItem;
  theme: ServiceThemeId;
};

export function CategoryServiceCard({ item, theme }: Props) {
  if (theme === "hair" && item.lengthPricing) {
    return <HairServiceCard item={item} theme={theme} />;
  }
  return <PremiumServiceCard item={item} theme={theme} />;
}
