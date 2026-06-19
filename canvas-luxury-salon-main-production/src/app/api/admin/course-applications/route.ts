import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  deleteCourseApplication,
  getCourseApplications,
  updateCourseApplicationStatus,
} from "@/lib/course-applications-store";
import type { CourseApplicationStatus } from "@/lib/cms-types";

const STATUSES: CourseApplicationStatus[] = [
  "pending",
  "contacted",
  "enrolled",
  "rejected",
];

export async function GET() {
  try {
    await requirePermission("course-applications.view");
    return NextResponse.json(await getCourseApplications());
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
    await requirePermission("course-applications.update");
    const body = (await request.json()) as {
      id?: string;
      status?: CourseApplicationStatus;
    };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const updated = await updateCourseApplicationStatus(body.id, body.status);
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
    await requirePermission("course-applications.update");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteCourseApplication(body.id);
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
