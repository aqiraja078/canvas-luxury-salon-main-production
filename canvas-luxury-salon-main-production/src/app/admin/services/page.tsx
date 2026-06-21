import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getServices } from "@/lib/services-store";
import { AdminServicesClient } from "@/components/admin/AdminServicesClient";

export const metadata: Metadata = {
  title: "Services — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "services.view")) redirect("/admin");

  const services = await getServices();
  return (
    <AdminServicesClient
      initial={services}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
