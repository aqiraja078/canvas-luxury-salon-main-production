export type GalleryVideoMetadata = {
  thumbnailUrl?: string;
  title?: string;
  caption?: string;
};

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; HumaBeautySaloon/1.0; +https://humasalon.com.pk)",
  Accept: "application/json,text/html",
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanMetaText(value?: string): string | undefined {
  const text = value?.trim();
  return text || undefined;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchTikTokMetadata(url: string): Promise<GalleryVideoMetadata | null> {
  const data = await fetchJson<{
    thumbnail_url?: string;
    title?: string;
    author_name?: string;
  }>(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);

  if (!data) return null;

  return {
    thumbnailUrl: cleanMetaText(data.thumbnail_url),
    title: cleanMetaText(data.title),
    caption: cleanMetaText(
      data.author_name ? `by ${data.author_name}` : undefined
    ),
  };
}

async function fetchInstagramOembed(url: string): Promise<GalleryVideoMetadata | null> {
  const normalized = url.split("?")[0].replace(/\/$/, "") + "/";
  const data = await fetchJson<{
    thumbnail_url?: string;
    title?: string;
    author_name?: string;
  }>(
    `https://api.instagram.com/oembed?url=${encodeURIComponent(normalized)}&omitscript=true`
  );

  if (!data) return null;

  return {
    thumbnailUrl: cleanMetaText(data.thumbnail_url),
    title: cleanMetaText(data.title),
    caption: cleanMetaText(
      data.author_name ? `by ${data.author_name}` : undefined
    ),
  };
}

async function fetchNoembed(url: string): Promise<GalleryVideoMetadata | null> {
  const data = await fetchJson<{
    thumbnail_url?: string;
    title?: string;
    author_name?: string;
  }>(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);

  if (!data) return null;

  return {
    thumbnailUrl: cleanMetaText(data.thumbnail_url),
    title: cleanMetaText(data.title),
    caption: cleanMetaText(
      data.author_name ? `by ${data.author_name}` : undefined
    ),
  };
}

async function fetchOpenGraph(url: string): Promise<GalleryVideoMetadata | null> {
  try {
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(12_000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();

    const ogImage =
      html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i)?.[1];
    const ogTitle =
      html.match(/property=["']og:title["']\s+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:title["']/i)?.[1];
    const ogDescription =
      html.match(
        /property=["']og:description["']\s+content=["']([^"']+)["']/i
      )?.[1] ||
      html.match(
        /content=["']([^"']+)["']\s+property=["']og:description["']/i
      )?.[1];

    if (!ogImage && !ogTitle && !ogDescription) return null;

    return {
      thumbnailUrl: ogImage ? decodeHtmlEntities(ogImage) : undefined,
      title: ogTitle ? decodeHtmlEntities(ogTitle) : undefined,
      caption: ogDescription ? decodeHtmlEntities(ogDescription) : undefined,
    };
  } catch {
    return null;
  }
}

function mergeMetadata(
  ...sources: Array<GalleryVideoMetadata | null>
): GalleryVideoMetadata | null {
  const merged: GalleryVideoMetadata = {};
  for (const source of sources) {
    if (!source) continue;
    if (!merged.thumbnailUrl && source.thumbnailUrl) {
      merged.thumbnailUrl = source.thumbnailUrl;
    }
    if (!merged.title && source.title) merged.title = source.title;
    if (!merged.caption && source.caption) merged.caption = source.caption;
  }
  return merged.thumbnailUrl || merged.title || merged.caption ? merged : null;
}

/** Pull thumbnail, title, and caption from Instagram / TikTok / video URLs. */
export async function fetchGalleryVideoMetadata(
  url: string
): Promise<GalleryVideoMetadata | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/tiktok\.com/i.test(trimmed)) {
    return mergeMetadata(
      await fetchTikTokMetadata(trimmed),
      await fetchNoembed(trimmed),
      await fetchOpenGraph(trimmed)
    );
  }

  if (/instagram\.com/i.test(trimmed)) {
    return mergeMetadata(
      await fetchInstagramOembed(trimmed),
      await fetchNoembed(trimmed),
      await fetchOpenGraph(trimmed)
    );
  }

  return mergeMetadata(await fetchNoembed(trimmed), await fetchOpenGraph(trimmed));
}

export type GalleryItemInput = {
  category: string;
  mediaType: string;
  title: string;
  caption?: string;
  imageUrl?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  videoUrl?: string;
  sortOrder: number;
  active: boolean;
};

export async function enrichGalleryVideoItem<T extends GalleryItemInput>(
  input: T
): Promise<T> {
  if (input.mediaType !== "video" || !input.videoUrl?.trim()) return input;

  const meta = await fetchGalleryVideoMetadata(input.videoUrl);
  if (!meta) return input;

  return {
    ...input,
    imageUrl: meta.thumbnailUrl || input.imageUrl?.trim(),
    title: input.title.trim() || meta.title || "Video",
    caption: input.caption?.trim() || meta.caption,
  };
}
