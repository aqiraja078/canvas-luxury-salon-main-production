import { GalleryPageView } from "@/components/gallery/GalleryPageView";
import { getActiveGalleryItems, getGalleryPage } from "@/lib/gallery-store";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Gallery & Portfolio",
  description: `Before & after, bridal, hair, facial, mehndi, and video reels from ${site.name}.`,
  path: "/gallery",
});

export default async function GalleryPage() {
  const [page, items] = await Promise.all([
    getGalleryPage(),
    getActiveGalleryItems(),
  ]);

  return (
    <div className="gallery-page">
      <GalleryPageView page={page} items={items} />
    </div>
  );
}
