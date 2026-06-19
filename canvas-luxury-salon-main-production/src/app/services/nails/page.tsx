import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("nails", "Nails");

export default function NailsServicesPage() {
  return <DynamicCategoryPage slug="nails" />;
}
