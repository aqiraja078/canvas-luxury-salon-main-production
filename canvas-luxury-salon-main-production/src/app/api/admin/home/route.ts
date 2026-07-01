import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin-auth";
import { getHomePage, saveHomePage } from "@/lib/home-page-store";
import type { CmsHomePage } from "@/lib/cms-types";

export async function GET() {
  try {
    await requirePermission("home.view");
    return NextResponse.json(await getHomePage());
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
    await requirePermission("home.manage");
    const body = (await request.json()) as CmsHomePage;
    if (!body?.hero || !body?.makeup) {
      return NextResponse.json({ error: "Invalid home page data" }, { status: 400 });
    }
    const saved = await saveHomePage(body);
    revalidatePath("/");
    revalidatePath("/admin/home");
    return NextResponse.json(saved);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
