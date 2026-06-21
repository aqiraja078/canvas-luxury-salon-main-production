import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getAboutPage } from "@/lib/about-page-store";
import { AdminAboutClient } from "@/components/admin/AdminAboutClient";

export const metadata: Metadata = {
  title: "About page — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAboutPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "about.view")) redirect("/admin");

  const about = await getAboutPage();
  return (
    <AdminAboutClient
      initial={about}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
