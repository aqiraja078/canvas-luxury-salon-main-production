import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("makeup", "Makeup");

export default function MakeupServicesPage() {
  return <DynamicCategoryPage slug="makeup" />;
}
