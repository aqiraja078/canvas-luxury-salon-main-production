export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function splitBlogParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type BlogContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string };

function isImageBlock(text: string): { src: string; alt: string } | null {
  const trimmed = text.trim();

  const markdown = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (markdown) return { alt: markdown[1], src: markdown[2] };

  // Uploaded images from admin (/api/media/uuid.jpg)
  if (/^\/api\/media\/\S+$/i.test(trimmed)) {
    return { alt: "", src: trimmed };
  }

  // Any full URL on its own line (cover images, Unsplash, etc.)
  if (/^https?:\/\/\S+$/i.test(trimmed)) {
    return { alt: "", src: trimmed };
  }

  return null;
}

export function parseBlogContent(content: string): BlogContentBlock[] {
  const blocks: BlogContentBlock[] = [];

  for (const raw of splitBlogParagraphs(content)) {
    const heading = raw.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const boldHeading = raw.match(/^\*\*(.+)\*\*$/);
    if (boldHeading) {
      blocks.push({ type: "heading", level: 2, text: boldHeading[1].trim() });
      continue;
    }

    const image = isImageBlock(raw);
    if (image) {
      blocks.push({ type: "image", ...image });
      continue;
    }

    blocks.push({ type: "paragraph", text: raw });
  }

  return blocks;
}

export function formatBlogMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PK", {
    month: "long",
    year: "numeric",
  });
}
