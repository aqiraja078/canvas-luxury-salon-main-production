import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("mehndi", "Mehndi");

export default function MehndiServicesPage() {
  return <DynamicCategoryPage slug="mehndi" />;
}
