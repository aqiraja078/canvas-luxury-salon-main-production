export type ParsedGalleryVideo = {
  kind: "instagram" | "tiktok" | "direct";
  embedUrl?: string;
  videoSrc?: string;
};

export function parseGalleryVideoUrl(url: string): ParsedGalleryVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (
    /\.(mp4|webm|mov)(\?|$)/i.test(trimmed) ||
    trimmed.startsWith("/api/media/")
  ) {
    return { kind: "direct", videoSrc: trimmed };
  }

  const igMatch = trimmed.match(
    /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/
  );
  if (igMatch) {
    return {
      kind: "instagram",
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
    };
  }

  const tiktokMatch = trimmed.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/);
  if (tiktokMatch) {
    return {
      kind: "tiktok",
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
    };
  }

  const tiktokShort = trimmed.match(/tiktok\.com\/t\/([A-Za-z0-9]+)/);
  if (tiktokShort) {
    return { kind: "tiktok", embedUrl: trimmed };
  }

  return null;
}

export function galleryItemThumbnail(item: {
  mediaType: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  videoUrl?: string;
}): string | undefined {
  if (item.imageUrl?.trim()) return item.imageUrl.trim();
  if (item.mediaType === "before-after") {
    return item.afterImageUrl?.trim() || item.beforeImageUrl?.trim();
  }
  return undefined;
}
