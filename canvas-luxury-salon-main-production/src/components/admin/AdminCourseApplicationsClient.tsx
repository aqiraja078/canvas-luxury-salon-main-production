"use client";

import { useMemo, useState } from "react";
import type {
  CmsCourseApplication,
  CourseApplicationStatus,
} from "@/lib/cms-types";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
} from "@/components/admin/AdminShell";

const STATUS_OPTIONS: { value: CourseApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

export function AdminCourseApplicationsClient({
  initial,
}: {
  initial: CmsCourseApplication[];
}) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"all" | CourseApplicationStatus>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    return rows.filter((r) => r.status === filter);
  }, [rows, filter]);

  async function setStatus(id: string, status: CourseApplicationStatus) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/course-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    setBusy(id);
    try {
      const res = await fetch("/api/admin/course-applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminShell
      title="Course applications"
      subtitle="Student enroll requests — no payment online; follow up by phone or WhatsApp."
    >
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUS_OPTIONS.map((s) => s.value)] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.15em] ${
              filter === s
                ? "bg-gold/20 text-gold border border-gold/30"
                : "border border-white/10 text-white/50"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-white/50">No applications yet.</p>
        ) : (
          filtered.map((a) => (
            <div key={a.id} className={`${adminCardClass} p-5 sm:p-6`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold/80">
                    {a.courseTitle}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-white">{a.name}</h3>
                  <p className="mt-2 text-sm text-white/60">
                    {a.email} · {a.phone}
                    {a.city ? ` · ${a.city}` : ""}
                    {a.age ? ` · Age ${a.age}` : ""}
                  </p>
                  {a.message ? (
                    <p className="mt-3 text-sm text-white/70">{a.message}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-white/40">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <AdminField label="Status">
                    <select
                      className={adminInputClass}
                      value={a.status}
                      disabled={busy === a.id}
                      onChange={(e) =>
                        setStatus(a.id, e.target.value as CourseApplicationStatus)
                      }
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <a
                    href={`/courses/${a.courseSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gold hover:underline"
                  >
                    View course ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    disabled={busy === a.id}
                    className="text-xs text-rose-300 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminShell>
  );
}
