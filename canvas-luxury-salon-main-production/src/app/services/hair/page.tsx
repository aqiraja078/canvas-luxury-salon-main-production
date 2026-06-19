import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("hair", "Hair");

export default function HairServicesPage() {
  return <DynamicCategoryPage slug="hair" />;
}
