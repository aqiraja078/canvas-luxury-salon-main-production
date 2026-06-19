import { cookies } from "next/headers";
import {
  adminCookieName,
  parseSessionToken,
  type SessionPayload,
} from "@/lib/admin-session";
import type { AdminPermission } from "@/lib/cms-types";
import { hasPermission } from "@/lib/cms-types";

export async function getAdminSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  return parseSessionToken(jar.get(adminCookieName)?.value);
}

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requirePermission(
  permission: AdminPermission
): Promise<SessionPayload> {
  const session = await requireAdminSession();
  if (!hasPermission(session.role, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}
