import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { hasPermission } from "@/lib/cms-types";
import { getBookings, type Booking } from "@/lib/bookings-store";
import { AdminBookingsClient } from "../AdminBookingsClient";

export const metadata: Metadata = {
  title: "Bookings — Admin",
  robots: { index: false, follow: false },
};

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

  return <AdminBookingsClient initial={bookings} />;
}
