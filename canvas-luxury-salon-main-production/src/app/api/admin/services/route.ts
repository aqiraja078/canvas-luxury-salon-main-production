import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import type { ServiceCategorySlug } from "@/lib/cms-types";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "@/lib/services-store";

const CATEGORIES: ServiceCategorySlug[] = [
  "hair",
  "facial",
  "body-spa",
  "nails",
  "mehndi",
  "makeup",
];

export async function GET() {
  try {
    await requirePermission("services.view");
    const services = await getServices();
    return NextResponse.json(services);
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
    await requirePermission("services.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const categorySlug = body.categorySlug as ServiceCategorySlug;
    if (!CATEGORIES.includes(categorySlug)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
    if (!String(body.name || "").trim() || !String(body.price || "").trim()) {
      return NextResponse.json({ error: "Name and price required" }, { status: 400 });
    }
    const service = await createService({
      categorySlug,
      sectionId: String(body.sectionId || "general"),
      sectionEmoji: String(body.sectionEmoji || "✨"),
      sectionTitle: String(body.sectionTitle || "General"),
      name: String(body.name || "").trim(),
      description: String(body.description || "").trim(),
      price: String(body.price || "").trim(),
      duration: body.duration ? String(body.duration) : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      featured: Boolean(body.featured),
      sortOrder: Number(body.sortOrder) || 0,
      active: body.active !== false,
    });
    return NextResponse.json(service);
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
    await requirePermission("services.manage");
    const body = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const { id, ...patch } = body;
    const updated = await updateService(id, patch as Parameters<typeof updateService>[1]);
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
    await requirePermission("services.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteService(body.id);
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
