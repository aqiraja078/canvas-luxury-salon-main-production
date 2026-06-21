import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { getAboutPage } from "@/lib/about-page-store";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — premium home beauty services in Jhelum, Dina, and Gujrat.`,
};

export default async function AboutPage() {
  const about = await getAboutPage();

  return (
    <AboutPageContent about={about} />
  );
}
