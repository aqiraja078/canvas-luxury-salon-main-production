import type { Metadata } from "next";
import { site } from "@/lib/site";

export const DEFAULT_OG_IMAGE = "/logo.svg";

type PageMetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
};

/** Shared Open Graph + Twitter metadata for public pages. */
export function buildPageMetadata(input: PageMetaInput = {}): Metadata {
  const description = input.description ?? site.description;
  const image = input.image ?? DEFAULT_OG_IMAGE;
  const ogTitle = input.title ?? site.name;

  return {
    ...(input.title ? { title: input.title } : {}),
    description,
    ...(input.path ? { alternates: { canonical: input.path } } : {}),
    openGraph: {
      title: input.title ? `${input.title} | ${site.name}` : site.name,
      description,
      type: input.type ?? "website",
      url: input.path ?? "/",
      siteName: site.name,
      locale: "en_PK",
      images: [{ url: image, alt: input.title ?? site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}
