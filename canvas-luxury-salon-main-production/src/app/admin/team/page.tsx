import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getTeamMembers } from "@/lib/team-store";
import { AdminTeamClient } from "@/components/admin/AdminTeamClient";

export const metadata: Metadata = {
  title: "Team — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTeamPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "team.view")) redirect("/admin");

  const team = await getTeamMembers();
  return (
    <AdminTeamClient
      initial={team}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
