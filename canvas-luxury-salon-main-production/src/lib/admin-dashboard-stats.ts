import type { Booking } from "@/lib/bookings-types";
import type { CmsCourse, CmsCourseApplication } from "@/lib/cms-types";

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

export function localDateKey(ref = new Date()): string {
  const y = ref.getFullYear();
  const m = String(ref.getMonth() + 1).padStart(2, "0");
  const day = String(ref.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(dateStr: string, ref = new Date()): boolean {
  return dateStr === localDateKey(ref);
}

function startOfWeek(ref = new Date()): Date {
  const start = new Date(ref);
  start.setHours(0, 0, 0, 0);
  const weekday = start.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  start.setDate(start.getDate() + diff);
  return start;
}

function endOfWeek(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function isInCurrentWeek(dateStr: string, ref = new Date()): boolean {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const start = startOfWeek(ref);
  const end = endOfWeek(start);
  return d >= start && d <= end;
}

export function getWeekRange(ref = new Date()): { from: string; to: string } {
  const start = startOfWeek(ref);
  const end = endOfWeek(start);
  return { from: localDateKey(start), to: localDateKey(end) };
}

export function getMonthRange(ref = new Date()): { from: string; to: string } {
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { from: localDateKey(start), to: localDateKey(end) };
}

/** First/last day of a calendar month (month is 1–12). */
export function getMonthRangeFor(year: number, month: number): {
  from: string;
  to: string;
} {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { from: localDateKey(start), to: localDateKey(end) };
}

/** `YYYY-MM` for &lt;input type="month"&gt; from a range start date. */
export function monthInputFromDate(from: string): string {
  if (!from || from.length < 7) return "";
  return from.slice(0, 7);
}

export function isInDateRange(
  dateStr: string,
  from: string,
  to: string
): boolean {
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

export function formatPeriodLabel(from: string, to: string): string {
  if (!from && !to) return "All dates";
  if (from && to && from.slice(0, 7) === to.slice(0, 7)) {
    return new Date(`${from}T12:00:00`).toLocaleDateString("en-PK", {
      month: "long",
      year: "numeric",
    });
  }
  const fmt = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString("en-PK", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return `From ${fmt(from)}`;
  return `Until ${fmt(to)}`;
}

export function computeConfirmedSale(
  bookings: Booking[],
  predicate: (booking: Booking) => boolean
): number {
  return bookings
    .filter((b) => b.status === "confirmed" && predicate(b))
    .reduce((sum, b) => sum + parsePriceLabelAmount(b.priceLabel), 0);
}

/** Confirmed booking revenue within an appointment date range (inclusive). */
export function computeConfirmedSaleInRange(
  bookings: Booking[],
  from: string,
  to: string
): number {
  return computeConfirmedSale(bookings, (b) =>
    isInDateRange(b.date, from, to)
  );
}

export type BookingPeriodStats = {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  todaySale: number;
  monthSale: number;
};

export function computeBookingPeriodStats(
  bookings: Booking[],
  ref = new Date()
): BookingPeriodStats {
  return {
    todayBookings: bookings.filter((b) => isSameDay(b.date, ref)).length,
    weekBookings: bookings.filter((b) => isInCurrentWeek(b.date, ref)).length,
    monthBookings: bookings.filter((b) => isInCurrentMonth(b.date, ref)).length,
    todaySale: computeConfirmedSale(bookings, (b) => isSameDay(b.date, ref)),
    monthSale: computeMonthlyConfirmedSale(bookings, ref),
  };
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

function isCreatedInCurrentMonth(iso: string, ref = new Date()): boolean {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
  );
}

/** Sum course fees for enrolled applications submitted in the current month. */
export function computeMonthlyEnrolledCourseRevenue(
  applications: CmsCourseApplication[],
  courses: CmsCourse[],
  ref = new Date()
): number {
  const feeByCourseId = new Map(
    courses.map((c) => [c.id, parsePriceLabelAmount(c.fee)])
  );
  return applications
    .filter(
      (a) => a.status === "enrolled" && isCreatedInCurrentMonth(a.createdAt, ref)
    )
    .reduce((sum, a) => sum + (feeByCourseId.get(a.courseId) ?? 0), 0);
}
