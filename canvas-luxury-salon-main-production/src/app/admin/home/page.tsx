import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getHomePage } from "@/lib/home-page-store";
import { AdminHomeClient } from "@/components/admin/AdminHomeClient";

export const metadata: Metadata = {
  title: "Home page — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "home.view")) redirect("/admin");

  const home = await getHomePage();
  return (
    <AdminHomeClient
      initial={home}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
