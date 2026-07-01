import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { hasPermission } from "@/lib/cms-types";
import { saveUploadedImage } from "@/lib/media-store";

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    const canUpload =
      hasPermission(session.role, "services.manage") ||
      hasPermission(session.role, "home.manage") ||
      hasPermission(session.role, "about.manage") ||
      hasPermission(session.role, "offers.manage") ||
      hasPermission(session.role, "team.manage") ||
      hasPermission(session.role, "courses.manage") ||
      hasPermission(session.role, "gallery.manage");
    if (!canUpload) throw new Error("Forbidden");

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    const result = await saveUploadedImage(file);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    const status = msg === "Unauthorized" || msg === "Forbidden" ? 401 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}
