import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getCourses } from "@/lib/courses-store";
import { AdminCoursesClient } from "@/components/admin/AdminCoursesClient";

export const metadata: Metadata = {
  title: "Courses — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCoursesPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "courses.view")) redirect("/admin");

  const courses = await getCourses();
  return (
    <AdminCoursesClient
      initial={courses}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
