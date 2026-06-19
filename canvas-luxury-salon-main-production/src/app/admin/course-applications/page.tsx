import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { hasPermission } from "@/lib/cms-types";
import { getCourseApplications } from "@/lib/course-applications-store";
import { AdminCourseApplicationsClient } from "@/components/admin/AdminCourseApplicationsClient";

export const metadata: Metadata = {
  title: "Course applications — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCourseApplicationsPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "course-applications.view")) redirect("/admin");

  const applications = await getCourseApplications();
  return <AdminCourseApplicationsClient initial={applications} />;
}
