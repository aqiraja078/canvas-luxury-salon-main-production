import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createGalleryItem,
  deleteGalleryItem,
  getGalleryItems,
  getGalleryPage,
  updateGalleryItem,
  updateGalleryPage,
} from "@/lib/gallery-store";
import type { CmsGalleryPage, GalleryCategory, GalleryMediaType } from "@/lib/cms-types";
import { enrichGalleryVideoItem } from "@/lib/gallery-video-metadata";

function parseCategory(v: unknown): GalleryCategory {
  const s = String(v || "bridal");
  const allowed: GalleryCategory[] = [
    "before-after",
    "bridal",
    "hair",
    "facial",
    "mehndi",
    "reels",
    "instagram",
  ];
  return allowed.includes(s as GalleryCategory) ? (s as GalleryCategory) : "bridal";
}

function parseMediaType(v: unknown): GalleryMediaType {
  const s = String(v || "image");
  return s === "before-after" || s === "video" ? s : "image";
}

function itemInput(body: Record<string, unknown>) {
  return {
    category: parseCategory(body.category),
    mediaType: parseMediaType(body.mediaType),
    title: String(body.title || "").trim(),
    caption: body.caption ? String(body.caption).trim() : undefined,
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : undefined,
    beforeImageUrl: body.beforeImageUrl
      ? String(body.beforeImageUrl).trim()
      : undefined,
    afterImageUrl: body.afterImageUrl ? String(body.afterImageUrl).trim() : undefined,
    videoUrl: body.videoUrl ? String(body.videoUrl).trim() : undefined,
    sortOrder: Number(body.sortOrder) || 0,
    active: body.active !== false,
  };
}

export async function GET() {
  try {
    await requirePermission("gallery.view");
    const [items, page] = await Promise.all([getGalleryItems(), getGalleryPage()]);
    return NextResponse.json({ items, page });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("gallery.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const input = await enrichGalleryVideoItem(itemInput(body));
    if (!input.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    const item = await createGalleryItem(input);
    return NextResponse.json(item);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requirePermission("gallery.manage");
    const body = (await request.json()) as {
      id?: string;
      page?: Partial<CmsGalleryPage>;
    } & Record<string, unknown>;

    if (body.page && !body.id) {
      const updated = await updateGalleryPage(body.page);
      return NextResponse.json({ page: updated });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { id, page: _page, ...raw } = body;
    const patch = await enrichGalleryVideoItem(itemInput(raw));
    const updated = await updateGalleryItem(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission("gallery.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteGalleryItem(body.id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
