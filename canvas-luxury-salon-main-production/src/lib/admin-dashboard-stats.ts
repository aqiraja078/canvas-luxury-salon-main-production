import type { Booking } from "@/lib/bookings-types";
import type { CmsCourseApplication } from "@/lib/cms-types";

/** Extract the first numeric amount from a menu price label. */
export function parsePriceLabelAmount(label?: string): number {
  if (!label?.trim()) return 0;
  const match = label.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  return Math.round(Number.parseFloat(match[1]));
}

export function formatPkr(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

export function isInCurrentMonth(dateStr: string, ref = new Date()): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

export function currentMonthLabel(ref = new Date()): string {
  return ref.toLocaleString("en-PK", { month: "long", year: "numeric" });
}

/** Sum list prices for confirmed bookings scheduled in the current month. */
export function computeMonthlyConfirmedSale(
  bookings: Booking[],
  ref = new Date()
): number {
  return bookings
    .filter((b) => b.status === "confirmed" && isInCurrentMonth(b.date, ref))
    .reduce((sum, b) => sum + parsePriceLabelAmount(b.priceLabel), 0);
}

export function countBookingsByStatus(bookings: Booking[]) {
  return {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };
}

export function countApplicationsByStatus(applications: CmsCourseApplication[]) {
  return {
    pending: applications.filter((a) => a.status === "pending").length,
    contacted: applications.filter((a) => a.status === "contacted").length,
    enrolled: applications.filter((a) => a.status === "enrolled").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };
}
