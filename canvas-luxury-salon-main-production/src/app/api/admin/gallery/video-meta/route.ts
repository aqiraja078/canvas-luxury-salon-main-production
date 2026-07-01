import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { fetchGalleryVideoMetadata } from "@/lib/gallery-video-metadata";

export async function GET(request: Request) {
  try {
    await requirePermission("gallery.view");
    const url = new URL(request.url).searchParams.get("url")?.trim();
    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const meta = await fetchGalleryVideoMetadata(url);
    if (!meta) {
      return NextResponse.json(
        { error: "Could not fetch video preview for this link." },
        { status: 404 }
      );
    }

    return NextResponse.json(meta);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
