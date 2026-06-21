"use client";

import { useEffect, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/bookings-types";
import { BOOKING_FIELD_LIMITS } from "@/lib/booking-validation";
import { bookingServices } from "@/lib/site";
import { AdminField, adminInputClass } from "@/components/admin/AdminShell";

const TIMES = Array.from({ length: 15 }, (_, i) =>
  String(8 + i).padStart(2, "0") + ":00"
);

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  priceLabel: string;
  status: BookingStatus;
  message: string;
};

const emptyForm = (defaultDate: string): FormState => ({
  name: "",
  email: "",
  phone: "",
  service: "",
  date: defaultDate,
  time: "10:00",
  priceLabel: "",
  status: "confirmed",
  message: "",
});

type Props = {
  open: boolean;
  defaultDate: string;
  onClose: () => void;
  onCreated: (booking: Booking) => void;
};

export function AdminManualBookingModal({
  open,
  defaultDate,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>(() => emptyForm(defaultDate));
  const [serviceOptions, setServiceOptions] = useState<string[]>(bookingServices);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm(defaultDate));
    setError("");
    let cancelled = false;
    fetch("/api/services")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Array<{ name: string; active?: boolean }>) => {
        if (cancelled) return;
        const names = Array.from(
          new Set(
            data.filter((s) => s.active !== false).map((s) => s.name.trim())
          )
        ).sort((a, b) => a.localeCompare(b));
        if (names.length > 0) setServiceOptions(names);
      })
      .catch(() => {
        /* keep fallback list */
      });
    return () => {
      cancelled = true;
    };
  }, [open, defaultDate]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          date: form.date,
          time: form.time,
          message: form.message || undefined,
          status: form.status,
          priceLabel: form.priceLabel || undefined,
        }),
      });
      const data = (await res.json()) as Booking & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save booking.");
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/25 bg-gradient-to-b from-white/[0.06] to-black shadow-luxury"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-booking-title"
      >
        <div className="border-b border-gold/15 px-5 py-4 sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70">
            Manual entry
          </p>
          <h2
            id="manual-booking-title"
            className="mt-1 font-display text-xl text-white sm:text-2xl"
          >
            New booking
          </h2>
          <p className="mt-1 text-xs text-white/45">
            Walk-in ya phone booking yahan add karein.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5 sm:px-6">
          <AdminField label="Customer name">
            <input
              required
              maxLength={BOOKING_FIELD_LIMITS.name}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={adminInputClass}
              placeholder="Full name"
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Phone">
              <input
                required
                maxLength={BOOKING_FIELD_LIMITS.phone}
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={adminInputClass}
                placeholder="03xx xxxxxxx"
              />
            </AdminField>
            <AdminField label="Email">
              <input
                required
                type="email"
                maxLength={BOOKING_FIELD_LIMITS.email}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={adminInputClass}
                placeholder="email@example.com"
              />
            </AdminField>
          </div>

          <AdminField label="Service">
            <select
              required
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              className={adminInputClass}
            >
              <option value="">Select service…</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Date">
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={adminInputClass}
              />
            </AdminField>
            <AdminField label="Time">
              <select
                required
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className={adminInputClass}
              >
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Amount / price label" hint="Optional — auto-filled if blank">
              <input
                maxLength={80}
                value={form.priceLabel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceLabel: e.target.value }))
                }
                className={adminInputClass}
                placeholder="Rs. 1,000"
              />
            </AdminField>
            <AdminField label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as BookingStatus,
                  }))
                }
                className={adminInputClass}
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </AdminField>
          </div>

          <AdminField label="Notes" hint="Optional">
            <textarea
              maxLength={BOOKING_FIELD_LIMITS.message}
              rows={3}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`${adminInputClass} resize-y`}
              placeholder="Special requests…"
            />
          </AdminField>

          {error ? (
            <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="btn-gold-premium px-6 py-2.5 text-[10px] disabled:opacity-50"
            >
              {busy ? "Saving…" : "Save booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
