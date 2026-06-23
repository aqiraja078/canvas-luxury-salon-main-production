import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  getTeamSection,
  updateTeamMember,
  updateTeamSection,
} from "@/lib/team-store";
import type { CmsTeamSection } from "@/lib/cms-types";

export async function GET() {
  try {
    await requirePermission("team.view");
    const [members, section] = await Promise.all([
      getTeamMembers(),
      getTeamSection(),
    ]);
    return NextResponse.json({ members, section });
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
      aboutText: body.aboutText ? String(body.aboutText).trim() : undefined,
      specialties: Array.isArray(body.specialties)
        ? body.specialties.map(String)
        : [],
      skills: Array.isArray(body.skills)
        ? body.skills
            .map((s) => {
              const row = s as Record<string, unknown>;
              const title = String(row.title || "").trim();
              const description = String(row.description || "").trim();
              if (!title) return null;
              return { title, description };
            })
            .filter((s): s is { title: string; description: string } => s != null)
        : undefined,
      experienceYears: body.experienceYears
        ? Number(body.experienceYears)
        : undefined,
      imageUrl: body.imageUrl ? String(body.imageUrl) : undefined,
      instagram: body.instagram ? String(body.instagram) : undefined,
      facebook: body.facebook ? String(body.facebook) : undefined,
      phone: body.phone ? String(body.phone) : undefined,
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
    const body = (await request.json()) as { id?: string; section?: Partial<CmsTeamSection> } & Record<string, unknown>;

    if (body.section && !body.id) {
      const updated = await updateTeamSection(body.section);
      return NextResponse.json({ section: updated });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { id, section: _section, ...patch } = body;
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
