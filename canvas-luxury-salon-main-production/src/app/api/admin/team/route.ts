import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
} from "@/lib/team-store";

export async function GET() {
  try {
    await requirePermission("team.view");
    return NextResponse.json(await getTeamMembers());
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
    await requirePermission("team.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const member = await createTeamMember({
      name: String(body.name || "").trim(),
      role: String(body.role || "").trim(),
      bio: String(body.bio || "").trim(),
      specialties: Array.isArray(body.specialties)
        ? body.specialties.map(String)
        : [],
      experienceYears: body.experienceYears
        ? Number(body.experienceYears)
        : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      instagram: body.instagram ? String(body.instagram) : undefined,
      sortOrder: Number(body.sortOrder) || 0,
      active: body.active !== false,
    });
    return NextResponse.json(member);
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
    await requirePermission("team.manage");
    const body = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const { id, ...patch } = body;
    const updated = await updateTeamMember(
      id,
      patch as Parameters<typeof updateTeamMember>[1]
    );
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
    await requirePermission("team.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteTeamMember(body.id);
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
