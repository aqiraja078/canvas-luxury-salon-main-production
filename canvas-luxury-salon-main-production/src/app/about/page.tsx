import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${site.name} — premium home beauty services in Jhelum, Dina, and Gujrat.`,
};

export default function AboutPage() {
  return (
    <div className="pt-[max(5.5rem,env(safe-area-inset-top))] sm:pt-28">
      <AboutPageContent />
    </div>
  );
}
