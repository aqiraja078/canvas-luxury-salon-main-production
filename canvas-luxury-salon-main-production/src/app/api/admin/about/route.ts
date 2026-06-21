import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { getAboutPage, saveAboutPage } from "@/lib/about-page-store";
import type { CmsAboutPage } from "@/lib/cms-types";

export async function GET() {
  try {
    await requirePermission("about.view");
    return NextResponse.json(await getAboutPage());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await requirePermission("about.manage");
    const body = (await request.json()) as CmsAboutPage;
    if (!body?.hero || !body?.story) {
      return NextResponse.json({ error: "Invalid about page data" }, { status: 400 });
    }
    const saved = await saveAboutPage(body);
    return NextResponse.json(saved);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
