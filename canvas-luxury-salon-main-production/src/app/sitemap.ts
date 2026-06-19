import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/lib/public-site-url";
import { getActiveCourses } from "@/lib/courses-store";

const base = getPublicSiteOrigin().replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getActiveCourses();
  const paths = [
    "",
    "/services",
    "/services/hair",
    "/services/makeup",
    "/services/facial",
    "/services/body-spa",
    "/services/nails",
    "/services/mehndi",
    "/about",
    "/offers",
    "/courses",
    ...courses.map((c) => `/courses/${c.slug}`),
    "/contact",
    "/book",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
