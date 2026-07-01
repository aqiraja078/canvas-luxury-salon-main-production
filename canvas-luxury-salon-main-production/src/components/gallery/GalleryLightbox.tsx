"use client";

import { useEffect } from "react";
import type { CmsGalleryItem } from "@/lib/cms-types";
import { parseGalleryVideoUrl } from "@/lib/gallery-utils";

type Props = {
  item: CmsGalleryItem | null;
  onClose: () => void;
};

export function GalleryLightbox({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const video = item.videoUrl ? parseGalleryVideoUrl(item.videoUrl) : null;

  return (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div className="gallery-lightbox__panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="gallery-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {item.mediaType === "before-after" ? (
          <div className="gallery-lightbox__compare">
            <figure>
              <span className="gallery-lightbox__tag">Before</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.beforeImageUrl} alt={`${item.title} — before`} />
            </figure>
            <figure>
              <span className="gallery-lightbox__tag">After</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.afterImageUrl} alt={`${item.title} — after`} />
            </figure>
          </div>
        ) : null}

        {item.mediaType === "image" && item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="gallery-lightbox__image"
          />
        ) : null}

        {item.mediaType === "video" && video?.kind === "direct" && video.videoSrc ? (
          <video
            src={video.videoSrc}
            className="gallery-lightbox__video"
            controls
            autoPlay
            playsInline
          />
        ) : null}

        {item.mediaType === "video" && video && video.kind !== "direct" && video.embedUrl ? (
          <iframe
            src={video.embedUrl}
            title={item.title}
            className="gallery-lightbox__embed"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : null}

        <div className="gallery-lightbox__caption">
          <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
          {item.caption ? <p className="mt-1 text-sm text-white/70">{item.caption}</p> : null}
        </div>
      </div>
    </div>
  );
}
