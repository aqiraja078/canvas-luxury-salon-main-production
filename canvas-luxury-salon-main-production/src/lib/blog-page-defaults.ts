import type { CmsBlogPage } from "@/lib/cms-types";

export function defaultBlogPage(): CmsBlogPage {
  return {
    kicker: "Beauty journal",
    title: "Tips, trends & bridal wisdom",
    subtitle:
      "Expert advice on makeup, hair, skin, and self-care — from the Huma Beauty team serving Jhelum, Dina, and Gujrat.",
    emptyMessage: "New articles are on the way. Check back soon for beauty tips and bridal guides.",
    updatedAt: new Date().toISOString(),
  };
}
