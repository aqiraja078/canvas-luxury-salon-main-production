import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getMonthRange, localDateKey } from "@/lib/admin-dashboard-stats";
import { getBookings, type Booking } from "@/lib/bookings-store";
import { AdminBookingsClient } from "../AdminBookingsClient";

export const metadata: Metadata = {
  title: "Bookings — Admin",
  robots: { index: false, follow: false },
};

const PAGE_COPY = {
  title: "Bookings",
  subtitle: "Har booking ek jagah — ref code, filters aur status se turant pehchano.",
} as const;

export default async function AdminBookingsPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "bookings.view")) redirect("/admin");

  let bookings: Booking[] = [];
  try {
    bookings = await getBookings();
  } catch {
    bookings = [];
  }

  const month = getMonthRange();

  return (
    <AdminBookingsClient
      initial={bookings}
      sessionUser={toAdminSessionUser(session)}
      title={PAGE_COPY.title}
      subtitle={PAGE_COPY.subtitle}
      monthFrom={month.from}
      monthTo={month.to}
      todayDate={localDateKey()}
      canCreate={hasPermission(session.role, "bookings.update")}
    />
  );
}
