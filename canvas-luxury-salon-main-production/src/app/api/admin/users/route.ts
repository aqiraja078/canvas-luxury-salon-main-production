import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import type { AdminRole } from "@/lib/cms-types";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  sanitizeAdminUser,
  updateAdminUser,
} from "@/lib/users-store";

const ROLES: AdminRole[] = ["owner", "reception", "contact"];

export async function GET() {
  try {
    await requirePermission("users.manage");
    const users = await getAdminUsers();
    return NextResponse.json(users.map(sanitizeAdminUser));
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
    await requirePermission("users.manage");
    const body = (await request.json()) as Record<string, unknown>;
    const role = body.role as AdminRole;
    if (!ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const user = await createAdminUser({
      username: String(body.username || ""),
      password: String(body.password || ""),
      role,
      name: String(body.name || ""),
      email: body.email ? String(body.email) : undefined,
    });
    return NextResponse.json(sanitizeAdminUser(user));
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
    await requirePermission("users.manage");
    const body = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const { id, ...patch } = body;
    if (patch.role && !ROLES.includes(patch.role as AdminRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const updated = await updateAdminUser(id, {
      username: patch.username ? String(patch.username) : undefined,
      password: patch.password ? String(patch.password) : undefined,
      role: patch.role as AdminRole | undefined,
      name: patch.name ? String(patch.name) : undefined,
      email: patch.email !== undefined ? String(patch.email) : undefined,
      active:
        patch.active !== undefined ? Boolean(patch.active) : undefined,
    });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(sanitizeAdminUser(updated));
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
    await requirePermission("users.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteAdminUser(body.id);
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
