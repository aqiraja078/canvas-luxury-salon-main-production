import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("body-spa", "Wax");

export default function BodySpaServicesPage() {
  return <DynamicCategoryPage slug="body-spa" />;
}
