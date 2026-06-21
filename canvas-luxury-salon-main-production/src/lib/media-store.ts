import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const MEDIA_STORE_NAME = "cms-media";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

async function writeLocalUpload(key: string, buffer: Buffer): Promise<void> {
  try {
    await ensureUploadsDir();
    await fs.writeFile(path.join(UPLOADS_DIR, key), buffer);
  } catch (err) {
    console.warn(`[media-store] local upload write skipped for ${key}:`, err);
  }
}

async function readPublicBundledImage(
  key: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const bundledPath = path.join(process.cwd(), "public", "cms-media", key);
    const buffer = await fs.readFile(bundledPath);
    const ext = key.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { buffer, contentType };
  } catch {
    return null;
  }
}

async function getMediaBlobStore() {
  try {
    return await getStore(MEDIA_STORE_NAME);
  } catch {
    return null;
  }
}

function extForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function saveUploadedImage(
  file: File
): Promise<{ url: string; key: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const key = `${randomUUID()}.${extForMime(file.type)}`;
  const store = await getMediaBlobStore();

  if (store) {
    await store.set(key, arrayBuffer, {
      metadata: { contentType: file.type },
    });
  } else if (process.env.NETLIFY) {
    throw new Error("Media storage is unavailable on this server.");
  }

  await writeLocalUpload(key, buffer);

  return { key, url: `/api/media/${key}` };
}

export async function readUploadedImage(
  key: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!/^[a-zA-Z0-9._-]+$/.test(key)) return null;

  const store = await getMediaBlobStore();
  if (store) {
    try {
      const data = await store.get(key, { type: "blob" });
      if (data) {
        const buffer = Buffer.from(await data.arrayBuffer());
        const meta = await store.getMetadata(key);
        const contentType =
          (meta?.metadata?.contentType as string) || "image/jpeg";
        return { buffer, contentType };
      }
    } catch {
      /* fall through */
    }
  }

  try {
    await ensureUploadsDir();
    const buffer = await fs.readFile(path.join(UPLOADS_DIR, key));
    const ext = key.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { buffer, contentType };
  } catch {
    return readPublicBundledImage(key);
  }
}
