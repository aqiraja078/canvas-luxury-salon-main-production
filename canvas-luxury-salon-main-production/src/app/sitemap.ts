import type { MetadataRoute } from "next";
import { getPublicSiteOrigin } from "@/lib/public-site-url";
import { getActiveBlogPosts } from "@/lib/blog-store";
import { getActiveCourses } from "@/lib/courses-store";

const base = getPublicSiteOrigin().replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, blogPosts] = await Promise.all([
    getActiveCourses(),
    getActiveBlogPosts(),
  ]);
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
    "/gallery",
    "/blog",
    ...blogPosts.map((p) => `/blog/${p.slug}`),
    "/courses",
    ...courses.map((c) => `/courses/${c.slug}`),
    "/contact",
    "/book",
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/blog/") ? "monthly" : "weekly",
    priority: path === "" ? 1 : path === "/blog" ? 0.85 : 0.8,
  }));
}
