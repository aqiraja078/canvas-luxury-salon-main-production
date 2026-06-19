import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createCourse,
  deleteCourse,
  getCourses,
  slugifyCourseTitle,
  updateCourse,
} from "@/lib/courses-store";

function parseCourseBody(body: Record<string, unknown>) {
  const title = String(body.title || "").trim();
  const slugRaw = String(body.slug || "").trim();
  const slug = slugRaw || slugifyCourseTitle(title);
  return {
    slug,
    title,
    shortDescription: String(body.shortDescription || "").trim(),
    description: String(body.description || "").trim(),
    duration: String(body.duration || "").trim(),
    fee: String(body.fee || "").trim(),
    syllabus: Array.isArray(body.syllabus)
      ? body.syllabus.map(String).filter(Boolean)
      : String(body.syllabus || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    highlights: Array.isArray(body.highlights)
      ? body.highlights.map(String).filter(Boolean)
      : String(body.highlights || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    instructor: body.instructor ? String(body.instructor) : undefined,
    nextBatch: body.nextBatch ? String(body.nextBatch) : undefined,
    imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
    featured: Boolean(body.featured),
    active: body.active !== false,
    sortOrder: Number(body.sortOrder) || 0,
  };
}

export async function GET() {
  try {
    await requirePermission("courses.view");
    return NextResponse.json(await getCourses());
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
    await requirePermission("courses.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const parsed = parseCourseBody(body);
    if (!parsed.title || !parsed.slug) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    const course = await createCourse(parsed);
    return NextResponse.json(course);
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
    await requirePermission("courses.manage");
    const body = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const { id, ...rest } = body;
    const patch = parseCourseBody(rest);
    const updated = await updateCourse(id, patch);
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
    await requirePermission("courses.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteCourse(body.id);
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
