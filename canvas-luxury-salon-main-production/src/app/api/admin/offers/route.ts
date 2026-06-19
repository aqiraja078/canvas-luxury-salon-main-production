import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createOffer,
  deleteOffer,
  getOffers,
  updateOffer,
} from "@/lib/offers-store";

export async function GET() {
  try {
    await requirePermission("offers.view");
    return NextResponse.json(await getOffers());
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
    await requirePermission("offers.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const offer = await createOffer({
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      discountLabel: String(body.discountLabel || "").trim(),
      originalPrice: body.originalPrice ? String(body.originalPrice) : undefined,
      offerPrice: body.offerPrice ? String(body.offerPrice) : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      includedServices: Array.isArray(body.includedServices)
        ? body.includedServices.map(String)
        : [],
      promoCode: body.promoCode ? String(body.promoCode) : undefined,
      startsAt: body.startsAt ? String(body.startsAt) : undefined,
      endsAt: body.endsAt ? String(body.endsAt) : undefined,
      featured: Boolean(body.featured),
      active: body.active !== false,
      sortOrder: Number(body.sortOrder) || 0,
    });
    return NextResponse.json(offer);
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
    await requirePermission("offers.manage");
    const body = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const { id, ...patch } = body;
    const updated = await updateOffer(id, patch as Parameters<typeof updateOffer>[1]);
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
    await requirePermission("offers.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteOffer(body.id);
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
