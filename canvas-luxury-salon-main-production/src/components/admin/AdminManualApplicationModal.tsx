"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CmsCourse,
  CmsCourseApplication,
  CourseApplicationStatus,
} from "@/lib/cms-types";
import { COURSE_APPLICATION_LIMITS } from "@/lib/course-application-validation";
import { AdminField, adminInputClass } from "@/components/admin/AdminShell";

const STATUS_OPTIONS: { value: CourseApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

type FormState = {
  courseId: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  message: string;
  status: CourseApplicationStatus;
};

const emptyForm = (): FormState => ({
  courseId: "",
  name: "",
  email: "",
  phone: "",
  age: "",
  city: "",
  message: "",
  status: "pending",
});

type Props = {
  open: boolean;
  courses: CmsCourse[];
  onClose: () => void;
  onCreated: (application: CmsCourseApplication) => void;
};

export function AdminManualApplicationModal({
  open,
  courses,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const activeCourses = useMemo(
    () =>
      courses
        .filter((c) => c.active)
        .sort((a, b) => a.title.localeCompare(b.title)),
    [courses]
  );

  const selectedCourse = useMemo(
    () => activeCourses.find((c) => c.id === form.courseId),
    [activeCourses, form.courseId]
  );

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm());
    setError("");
  }, [open]);

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
      const res = await fetch("/api/admin/course-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: form.courseId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          age: form.age || undefined,
          city: form.city || undefined,
          message: form.message || undefined,
          status: form.status,
        }),
      });
      const data = (await res.json()) as CmsCourseApplication & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save application.");
      onCreated(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save application.");
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
        aria-labelledby="manual-application-title"
      >
        <div className="border-b border-gold/15 px-5 py-4 sm:px-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70">
            Manual entry
          </p>
          <h2
            id="manual-application-title"
            className="mt-1 font-display text-xl text-white sm:text-2xl"
          >
            New application
          </h2>
          <p className="mt-1 text-xs text-white/45">
            Walk-in ya phone inquiry yahan add karein.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5 sm:px-6">
          <AdminField label="Course">
            <select
              required
              value={form.courseId}
              onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
              className={adminInputClass}
            >
              <option value="">Select course…</option>
              {activeCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.fee}
                </option>
              ))}
            </select>
          </AdminField>

          {selectedCourse ? (
            <div className="rounded-xl border border-gold/20 bg-gold/[0.06] px-3 py-3 text-xs text-white/60">
              <p className="font-medium text-gold-light">{selectedCourse.fee}</p>
              <p className="mt-1">
                {[selectedCourse.duration, selectedCourse.instructor, selectedCourse.nextBatch]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          ) : null}

          <AdminField label="Student name">
            <input
              required
              maxLength={COURSE_APPLICATION_LIMITS.name}
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
                maxLength={COURSE_APPLICATION_LIMITS.phone}
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
                maxLength={COURSE_APPLICATION_LIMITS.email}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={adminInputClass}
                placeholder="email@example.com"
              />
            </AdminField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="City" hint="Optional">
              <input
                maxLength={COURSE_APPLICATION_LIMITS.city}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={adminInputClass}
                placeholder="Jhelum"
              />
            </AdminField>
            <AdminField label="Age" hint="Optional">
              <input
                maxLength={COURSE_APPLICATION_LIMITS.age}
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                className={adminInputClass}
                placeholder="22"
              />
            </AdminField>
          </div>

          <AdminField label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as CourseApplicationStatus,
                }))
              }
              className={adminInputClass}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </AdminField>

          <AdminField label="Notes" hint="Optional">
            <textarea
              maxLength={COURSE_APPLICATION_LIMITS.message}
              rows={3}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className={`${adminInputClass} resize-y`}
              placeholder="Student ne kya pocha…"
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
              {busy ? "Saving…" : "Save application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
