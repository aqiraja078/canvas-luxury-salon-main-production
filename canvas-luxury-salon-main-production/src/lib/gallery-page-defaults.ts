import { site } from "@/lib/site";
import type { CmsGalleryPage } from "@/lib/cms-types";

export function defaultGalleryPage(): CmsGalleryPage {
  const ts = new Date().toISOString();
  return {
    kicker: "Portfolio",
    title: "Our work speaks for itself",
    subtitle:
      "Bridal glam, hair colour, facials, mehndi, and reels — real results from Jhelum, Dina, and Gujrat.",
    instagramUrl: site.social.instagram,
    tiktokUrl: site.social.tiktok,
    emptyMessage: "New portfolio work is being added. Follow us on Instagram for the latest looks.",
    updatedAt: ts,
  };
}
