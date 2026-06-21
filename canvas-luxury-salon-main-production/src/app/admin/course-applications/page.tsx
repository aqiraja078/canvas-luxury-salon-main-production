import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getMonthRange } from "@/lib/admin-dashboard-stats";
import { getCourseApplications } from "@/lib/course-applications-store";
import { getCourses } from "@/lib/courses-store";
import { AdminCourseApplicationsClient } from "@/components/admin/AdminCourseApplicationsClient";

export const metadata: Metadata = {
  title: "Course applications — Admin",
  robots: { index: false, follow: false },
};

const PAGE_COPY = {
  title: "Course applications",
  subtitle: "Student enroll requests — course detail aur fee yahan dikhti hai.",
} as const;

export default async function AdminCourseApplicationsPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "course-applications.view")) redirect("/admin");

  const month = getMonthRange();
  const [applications, courses] = await Promise.all([
    getCourseApplications(),
    getCourses(),
  ]);
  return (
    <AdminCourseApplicationsClient
      initial={applications}
      courses={courses}
      sessionUser={toAdminSessionUser(session)}
      title={PAGE_COPY.title}
      subtitle={PAGE_COPY.subtitle}
      monthFrom={month.from}
      monthTo={month.to}
      canUpdate={hasPermission(session.role, "course-applications.update")}
    />
  );
}
