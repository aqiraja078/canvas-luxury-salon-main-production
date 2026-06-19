import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  computeMonthlyConfirmedSale,
  countApplicationsByStatus,
  countBookingsByStatus,
  currentMonthLabel,
  formatPkr,
} from "@/lib/admin-dashboard-stats";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { getBookings } from "@/lib/bookings-store";
import { getCourseApplications } from "@/lib/course-applications-store";
import { getCourses } from "@/lib/courses-store";
import { hasPermission } from "@/lib/cms-types";
import { getOffers } from "@/lib/offers-store";
import { getServices } from "@/lib/services-store";
import { getTeamMembers } from "@/lib/team-store";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type DashboardCard = {
  href: string;
  label: string;
  value: string;
  show: boolean;
  valueClassName?: string;
};

export default async function AdminDashboardPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");

  const [bookings, services, offers, courses, applications, team] =
    await Promise.all([
      hasPermission(session.role, "bookings.view")
        ? getBookings()
        : Promise.resolve([]),
      hasPermission(session.role, "services.view")
        ? getServices()
        : Promise.resolve([]),
      hasPermission(session.role, "offers.view")
        ? getOffers()
        : Promise.resolve([]),
      hasPermission(session.role, "courses.view")
        ? getCourses()
        : Promise.resolve([]),
      hasPermission(session.role, "course-applications.view")
        ? getCourseApplications()
        : Promise.resolve([]),
      hasPermission(session.role, "team.view")
        ? getTeamMembers()
        : Promise.resolve([]),
    ]);

  const bookingCounts = countBookingsByStatus(bookings);
  const applicationCounts = countApplicationsByStatus(applications);
  const monthSale = computeMonthlyConfirmedSale(bookings);
  const monthLabel = currentMonthLabel();

  const canViewBookings = hasPermission(session.role, "bookings.view");
  const canViewApplications = hasPermission(
    session.role,
    "course-applications.view"
  );

  const cards: DashboardCard[] = [
    {
      href: "/admin/bookings",
      label: `${monthLabel} sale`,
      value: formatPkr(monthSale),
      show: canViewBookings,
      valueClassName: "text-2xl sm:text-3xl",
    },
    {
      href: "/admin/bookings",
      label: "Pending bookings",
      value: String(bookingCounts.pending),
      show: canViewBookings,
    },
    {
      href: "/admin/bookings",
      label: "Confirmed bookings",
      value: String(bookingCounts.confirmed),
      show: canViewBookings,
    },
    {
      href: "/admin/bookings",
      label: "Cancelled bookings",
      value: String(bookingCounts.cancelled),
      show: canViewBookings,
    },
    {
      href: "/admin/services",
      label: "Active services",
      value: String(services.filter((s) => s.active).length),
      show: hasPermission(session.role, "services.view"),
    },
    {
      href: "/admin/offers",
      label: "Offers",
      value: String(offers.filter((o) => o.active).length),
      show: hasPermission(session.role, "offers.view"),
    },
    {
      href: "/admin/courses",
      label: "Active courses",
      value: String(courses.filter((c) => c.active).length),
      show: hasPermission(session.role, "courses.view"),
    },
    {
      href: "/admin/course-applications",
      label: "Pending applications",
      value: String(applicationCounts.pending),
      show: canViewApplications,
    },
    {
      href: "/admin/course-applications",
      label: "Contacted applications",
      value: String(applicationCounts.contacted),
      show: canViewApplications,
    },
    {
      href: "/admin/course-applications",
      label: "Enrolled applications",
      value: String(applicationCounts.enrolled),
      show: canViewApplications,
    },
    {
      href: "/admin/course-applications",
      label: "Rejected applications",
      value: String(applicationCounts.rejected),
      show: canViewApplications,
    },
    {
      href: "/admin/team",
      label: "Team members",
      value: String(team.filter((m) => m.active).length),
      show: hasPermission(session.role, "team.view"),
    },
  ].filter((c) => c.show);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Overview of bookings, services, offers, and team — everything at a glance."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={`${c.href}-${c.label}`}
            href={c.href}
            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 transition hover:border-gold/35 hover:shadow-[0_12px_40px_-12px_rgba(201,169,98,0.3)]"
          >
            <p
              className={`font-bold text-gold-light transition group-hover:scale-105 ${c.valueClassName ?? "text-4xl"}`}
            >
              {c.value}
            </p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/50">
              {c.label}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
