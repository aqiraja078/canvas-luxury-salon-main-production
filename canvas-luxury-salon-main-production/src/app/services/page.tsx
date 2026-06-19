import type { Metadata } from "next";
import { AllServicesPage } from "@/components/services/AllServicesPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Services",
  description: `Browse every beauty service by ${site.name} — hair, makeup, facial, spa, nails, and mehndi at home in Jhelum, Dina, and Gujrat.`,
};

export default function ServicesPage() {
  return <AllServicesPage />;
}
