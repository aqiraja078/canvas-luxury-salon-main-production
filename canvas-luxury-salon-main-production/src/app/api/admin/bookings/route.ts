import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import { isBookingId } from "@/lib/booking-validation";
import { notifyGuestOfBookingStatus } from "@/lib/booking-status-notifications";
import { updateBookingStatus, deleteBooking } from "@/lib/bookings-store";
import type { BookingStatus } from "@/lib/bookings-types";

export async function PATCH(request: Request) {
  try {
    await requirePermission("bookings.update");
    let body: { id?: string; status?: BookingStatus };
    try {
      body = (await request.json()) as { id?: string; status?: BookingStatus };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }
    if (!isBookingId(body.id)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }
    if (!["pending", "confirmed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const result = await updateBookingStatus(body.id, body.status);
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const { booking, previousStatus } = result;

    void notifyGuestOfBookingStatus(booking, previousStatus).catch((err) =>
      console.error("[admin/bookings] Guest notify error:", err)
    );

    return NextResponse.json(booking);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission("bookings.delete");
    let body: { id?: string };
    try {
      body = (await request.json()) as { id?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (!isBookingId(body.id)) {
      return NextResponse.json({ error: "Invalid booking id" }, { status: 400 });
    }
    const deletedBooking = await deleteBooking(body.id);
    if (!deletedBooking) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Deletion failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
