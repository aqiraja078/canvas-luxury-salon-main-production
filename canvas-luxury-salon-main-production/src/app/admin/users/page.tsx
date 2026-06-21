import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getAdminUsers, sanitizeAdminUser } from "@/lib/users-store";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";

export const metadata: Metadata = {
  title: "Users — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "users.manage")) redirect("/admin");

  const users = (await getAdminUsers()).map(sanitizeAdminUser);
  return (
    <AdminUsersClient
      initial={users}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
