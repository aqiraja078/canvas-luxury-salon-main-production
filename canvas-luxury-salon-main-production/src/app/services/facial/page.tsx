import type { Metadata } from "next";
import {
  categoryMetadata,
  DynamicCategoryPage,
} from "@/components/services/DynamicCategoryPage";

export const metadata: Metadata = categoryMetadata("facial", "Facial");

export default function FacialServicesPage() {
  return <DynamicCategoryPage slug="facial" />;
}
