"use client";

import { useMemo, useState } from "react";
import type { CmsGalleryItem, CmsGalleryPage } from "@/lib/cms-types";
import { GALLERY_CATEGORIES } from "@/lib/gallery-constants";
import { galleryItemThumbnail } from "@/lib/gallery-utils";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

type Props = {
  page: CmsGalleryPage;
  items: CmsGalleryItem[];
};

function GalleryTile({
  item,
  onOpen,
}: {
  item: CmsGalleryItem;
  onOpen: (item: CmsGalleryItem) => void;
}) {
  const thumb = galleryItemThumbnail(item);
  const isVideo = item.mediaType === "video";

  if (item.mediaType === "before-after") {
    return (
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="gallery-tile gallery-tile--compare group"
      >
        <div className="gallery-tile__compare-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.beforeImageUrl} alt="" className="gallery-tile__img" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.afterImageUrl} alt="" className="gallery-tile__img" loading="lazy" />
        </div>
        <span className="gallery-tile__label">Before / After</span>
        <p className="gallery-tile__title">{item.title}</p>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="gallery-tile group"
    >
      <div className="gallery-tile__media">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt={item.title} className="gallery-tile__img" loading="lazy" />
        ) : (
          <div className="gallery-tile__placeholder" />
        )}
        {isVideo ? (
          <span className="gallery-tile__play" aria-hidden>
            ▶
          </span>
        ) : null}
      </div>
      <p className="gallery-tile__title">{item.title}</p>
      {item.caption ? <p className="gallery-tile__caption">{item.caption}</p> : null}
    </button>
  );
}

export function GalleryPageView({ page, items }: Props) {
  const [active, setActive] = useState<CmsGalleryItem | null>(null);

  const byCategory = useMemo(() => {
    const map = new Map<string, CmsGalleryItem[]>();
    for (const cat of GALLERY_CATEGORIES) {
      map.set(
        cat.id,
        items.filter((i) => i.category === cat.id)
      );
    }
    return map;
  }, [items]);

  return (
    <>
      <section className="gallery-page__hero px-4 pb-10 pt-24 sm:px-6 sm:pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-caption-golden">{page.kicker}</p>
          <h1 className="text-headline-lg mt-3 max-w-3xl">{page.title}</h1>
          <p className="mt-5 max-w-2xl text-body-default text-white/70">{page.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={page.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:border-gold/40 hover:text-gold-light"
            >
              Instagram
            </a>
            <a
              href={page.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:border-gold/40 hover:text-gold-light"
            >
              TikTok
            </a>
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 px-4 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {GALLERY_CATEGORIES.map((cat) => {
            const catItems = byCategory.get(cat.id) ?? [];
            return (
              <section key={cat.id} id={cat.id} className="gallery-section scroll-mt-28">
                <div className="gallery-section__head">
                  <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {cat.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/55">{cat.description}</p>
                </div>

                {catItems.length === 0 ? (
                  <p className="mt-8 rounded-2xl border border-dashed border-white/12 px-6 py-10 text-center text-sm text-white/45">
                    {page.emptyMessage}
                  </p>
                ) : (
                  <div className="gallery-grid mt-8">
                    {catItems.map((item) => (
                      <GalleryTile key={item.id} item={item} onOpen={setActive} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <GalleryLightbox item={active} onClose={() => setActive(null)} />
    </>
  );
}
