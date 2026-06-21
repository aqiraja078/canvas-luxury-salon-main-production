"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CmsCourse,
  CmsCourseApplication,
  CourseApplicationStatus,
} from "@/lib/cms-types";
import { countApplicationsByStatus } from "@/lib/admin-dashboard-stats";
import type { AdminSessionUser } from "@/lib/admin-session-user";
import { AdminShell, adminCardClass, adminInputClass } from "@/components/admin/AdminShell";
import { AdminManualApplicationModal } from "@/components/admin/AdminManualApplicationModal";

const DISPLAY_LOCALE = "en-GB";
const PAGE_SIZE = 10;

const STATUS_OPTIONS: { value: CourseApplicationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

const TH =
  "px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-gold/60 whitespace-nowrap first:pl-6 last:pr-6";
const TD =
  "px-4 py-3 align-middle text-sm first:pl-6 last:pr-6";

type CourseDetails = {
  title: string;
  fee: string;
  duration?: string;
  instructor?: string;
  nextBatch?: string;
  shortDescription?: string;
  slug: string;
  imageUrl?: string;
};

type Props = {
  initial: CmsCourseApplication[];
  courses: CmsCourse[];
  sessionUser: AdminSessionUser | null;
  title: string;
  subtitle: string;
  monthFrom: string;
  monthTo: string;
  canUpdate: boolean;
};

function resolveCourseDetails(
  app: CmsCourseApplication,
  coursesById: Map<string, CmsCourse>
): CourseDetails {
  const live = coursesById.get(app.courseId);
  return {
    title: app.courseTitle,
    fee: app.courseFee ?? live?.fee ?? "—",
    duration: app.courseDuration ?? live?.duration,
    instructor: app.courseInstructor ?? live?.instructor,
    nextBatch: app.courseNextBatch ?? live?.nextBatch,
    shortDescription: app.courseShortDescription ?? live?.shortDescription,
    slug: app.courseSlug,
    imageUrl: live?.imageUrl,
  };
}

function createdDateKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatSubmittedAt(iso: string) {
  return new Date(iso).toLocaleString(DISPLAY_LOCALE, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function applicantInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function batchRef(id: string) {
  return `B-${id.replace(/-/g, "").slice(-4).toUpperCase()}`;
}

function statusSelectClass(status: CourseApplicationStatus) {
  switch (status) {
    case "pending":
      return "border-amber-400/45 text-amber-100 bg-amber-500/10";
    case "contacted":
      return "border-sky-400/40 text-sky-100 bg-sky-500/10";
    case "enrolled":
      return "border-gold/40 text-gold-light bg-gold/10";
    case "rejected":
      return "border-rose-400/35 text-rose-100 bg-rose-500/10";
  }
}

function applicationGrowthPercent(rows: CmsCourseApplication[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const last30 = rows.filter(
    (a) => now - new Date(a.createdAt).getTime() <= 30 * day
  ).length;
  const prev30 = rows.filter((a) => {
    const age = now - new Date(a.createdAt).getTime();
    return age > 30 * day && age <= 60 * day;
  }).length;
  if (!prev30) return last30 > 0 ? 100 : 0;
  return Math.round(((last30 - prev30) / prev30) * 100);
}

function exportApplicationsCsv(
  applications: CmsCourseApplication[],
  coursesById: Map<string, CmsCourse>
) {
  const headers = [
    "Applicant",
    "Email",
    "Phone",
    "City",
    "Age",
    "Course",
    "Fee",
    "Duration",
    "Instructor",
    "Next batch",
    "Status",
    "Submitted",
  ];
  const lines = applications.map((a) => {
    const c = resolveCourseDetails(a, coursesById);
    return [
      a.name,
      a.email,
      a.phone,
      a.city ?? "",
      a.age ?? "",
      c.title,
      c.fee,
      c.duration ?? "",
      c.instructor ?? "",
      c.nextBatch ?? "",
      a.status,
      a.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
  });
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `course-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function IconCalendar({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconSearch({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconDownload({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function IconPlus({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconMore({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function IconUsers({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14 19c.3-2 1.8-3.5 4-3.5" />
    </svg>
  );
}

function IconClock({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function IconPhone({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M8 3h3l1 4-2 1a11 11 0 0 0 5 5l1-2 4 1v3a2 2 0 0 1-2 2A15 15 0 0 1 5 5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconX({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function AdminCourseApplicationsClient({
  initial,
  courses,
  sessionUser,
  title,
  subtitle,
  monthFrom,
  monthTo,
  canUpdate,
}: Props) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"all" | CourseApplicationStatus>("all");
  const [dateFrom, setDateFrom] = useState(monthFrom);
  const [dateTo, setDateTo] = useState(monthTo);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const coursesById = useMemo(
    () => new Map(courses.map((c) => [c.id, c])),
    [courses]
  );

  useEffect(() => {
    function onDocClick() {
      setOpenMenuId(null);
    }
    if (openMenuId) {
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }
  }, [openMenuId]);

  const stats = useMemo(() => countApplicationsByStatus(rows), [rows]);
  const growth = useMemo(() => applicationGrowthPercent(rows), [rows]);
  const total = rows.length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((a) => {
        if (filter !== "all" && a.status !== filter) return false;
        const dk = createdDateKey(a.createdAt);
        if (dateFrom && dk < dateFrom) return false;
        if (dateTo && dk > dateTo) return false;
        if (q) {
          const hay = `${a.name} ${a.email} ${a.phone} ${a.city ?? ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [rows, filter, dateFrom, dateTo, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, dateFrom, dateTo, search]);

  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

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
    setBusy(id);
    setOpenMenuId(null);
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

  const headerActions = (
    <>
      <div className="flex items-center gap-2 rounded-xl border border-gold/25 bg-black/55 px-3 py-2 backdrop-blur-sm">
        <IconCalendar className="h-4 w-4 shrink-0 text-gold/70" />
        <label className="sr-only" htmlFor="applications-date-from">From</label>
        <input
          id="applications-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[7.5rem] cursor-pointer bg-transparent text-xs text-white/80 outline-none"
        />
        <span className="text-gold/30">–</span>
        <label className="sr-only" htmlFor="applications-date-to">To</label>
        <input
          id="applications-date-to"
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[7.5rem] cursor-pointer bg-transparent text-xs text-white/80 outline-none"
        />
      </div>
      {canUpdate ? (
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn-gold-premium inline-flex items-center gap-1.5 px-4 py-2 text-[10px]"
        >
          <IconPlus className="h-3.5 w-3.5" />
          New Application
        </button>
      ) : null}
    </>
  );

  return (
    <AdminShell
      sessionUser={sessionUser}
      title={title}
      subtitle={subtitle}
      actions={headerActions}
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {[
          {
            label: "Total Applications",
            value: total,
            sub:
              growth >= 0
                ? `+${growth}% vs last 30 days`
                : `${growth}% vs last 30 days`,
            subClass: growth >= 0 ? "text-gold-light/80" : "text-rose-300/80",
            icon: <IconUsers className="h-4 w-4 text-gold-light" />,
            iconBg: "border border-gold/25 bg-gold/10",
          },
          {
            label: "Pending",
            value: String(stats.pending).padStart(2, "0"),
            sub: `${pct(stats.pending)}%`,
            subClass: "text-white/40",
            icon: <IconClock className="h-4 w-4 text-amber-200" />,
            iconBg: "border border-amber-400/25 bg-amber-500/10",
          },
          {
            label: "Contacted",
            value: String(stats.contacted).padStart(2, "0"),
            sub: `${pct(stats.contacted)}%`,
            subClass: "text-white/40",
            icon: <IconPhone className="h-4 w-4 text-sky-200" />,
            iconBg: "border border-sky-400/25 bg-sky-500/10",
          },
          {
            label: "Enrolled",
            value: String(stats.enrolled).padStart(2, "0"),
            sub: `${pct(stats.enrolled)}%`,
            subClass: "text-white/40",
            icon: <IconCheck className="h-4 w-4 text-gold-light" />,
            iconBg: "border border-gold/25 bg-gold/10",
          },
          {
            label: "Rejected",
            value: String(stats.rejected).padStart(2, "0"),
            sub: `${pct(stats.rejected)}%`,
            subClass: "text-white/40",
            icon: <IconX className="h-4 w-4 text-rose-200" />,
            iconBg: "border border-rose-400/25 bg-rose-500/10",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-4 transition hover:border-gold/35 hover:shadow-[0_12px_40px_-12px_rgba(201,169,98,0.25)] sm:p-5"
          >
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                {card.icon}
              </span>
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/45">{card.label}</p>
            </div>
            <p className="mt-3 font-display text-2xl tabular-nums text-gold-light sm:text-3xl">
              {card.value}
            </p>
            <p className={`mt-1 text-[10px] tracking-wide ${card.subClass}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUS_OPTIONS.map((s) => s.value)] as const).map((s) => {
          const active = filter === s;
          const count =
            s === "all"
              ? total
              : s === "pending"
                ? stats.pending
                : s === "contacted"
                  ? stats.contacted
                  : s === "enrolled"
                    ? stats.enrolled
                    : stats.rejected;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.14em] transition ${
                active
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black shadow-md shadow-gold/20"
                  : "border border-white/10 text-white/55 hover:border-gold/25 hover:text-white"
              }`}
            >
              {s === "all" ? "All" : s}
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className={`${adminInputClass} py-2.5 pl-10`}
          />
        </div>
        <button
          type="button"
          onClick={() => exportApplicationsCsv(filtered, coursesById)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/70 transition hover:border-gold/30 hover:text-gold-light"
        >
          <IconDownload className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Table */}
      <div className={`mt-6 overflow-hidden ${adminCardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gold/15 bg-black/25">
                <th className={TH}>Applicant Details</th>
                <th className={TH}>Course Details</th>
                <th className={TH}>Duration</th>
                <th className={TH}>Instructor</th>
                <th className={TH}>Next Batch</th>
                <th className={TH}>Fees</th>
                <th className={TH}>Status</th>
                <th className={TH}>Application Date</th>
                <th className={`${TH} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-sm text-white/50">
                    No applications match these filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((a) => {
                  const course = resolveCourseDetails(a, coursesById);
                  const isMenuOpen = openMenuId === a.id;
                  const locationLine = [a.city, a.age ? `Age ${a.age}` : null]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <tr
                      key={a.id}
                      className="border-b border-white/[0.06] transition hover:bg-gold/[0.03]"
                    >
                      <td className={`${TD} min-w-[12rem]`}>
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-[11px] font-semibold text-gold-light">
                            {applicantInitials(a.name) || "?"}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-white">{a.name}</p>
                            <p className="mt-0.5 truncate text-xs text-white/50">{a.email}</p>
                            <p className="text-xs text-white/45">{a.phone}</p>
                            {locationLine ? (
                              <p className="text-[11px] text-white/35">{locationLine}</p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className={`${TD} min-w-[14rem]`}>
                        <div className="flex items-start gap-3">
                          {course.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={course.imageUrl}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-lg border border-white/10 object-cover"
                            />
                          ) : (
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/[0.08] text-[10px] font-semibold uppercase tracking-wide text-gold-light/80">
                              {course.title.slice(0, 2)}
                            </span>
                          )}
                          <div className="min-w-0">
                            <span className="inline-block rounded border border-gold/25 bg-gold/[0.08] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-gold-light/90">
                              Selected course
                            </span>
                            <p className="mt-1 font-medium text-white">{course.title}</p>
                            {course.shortDescription ? (
                              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/40">
                                {course.shortDescription}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-white/75`}>
                        {course.duration ?? "—"}
                      </td>
                      <td className={`${TD} max-w-[8rem] text-white/75`}>
                        {course.instructor ?? "—"}
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        {course.nextBatch ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-white/80">
                              <IconCalendar className="h-3.5 w-3.5 text-gold/60" />
                              <span className="text-xs">{course.nextBatch}</span>
                            </div>
                            <p className="mt-0.5 text-[10px] text-white/35">
                              Batch #{batchRef(a.id)}
                            </p>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className={`${TD} whitespace-nowrap font-display text-gold-light`}>
                        {course.fee}
                      </td>
                      <td className={`${TD} min-w-[9rem]`}>
                        <select
                          value={a.status}
                          disabled={busy === a.id || !canUpdate}
                          onChange={(e) =>
                            setStatus(a.id, e.target.value as CourseApplicationStatus)
                          }
                          className={`w-full cursor-pointer rounded-lg border px-2 py-1.5 text-[11px] capitalize outline-none transition focus:border-gold/45 disabled:cursor-not-allowed disabled:opacity-50 ${statusSelectClass(a.status)}`}
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <a
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-block text-[10px] text-gold hover:underline"
                        >
                          View course page ↗
                        </a>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-xs text-white/60`}>
                        {formatSubmittedAt(a.createdAt)}
                      </td>
                      <td className={`${TD} relative whitespace-nowrap text-right`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : a.id);
                          }}
                          disabled={busy === a.id}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-gold/10 hover:text-gold-light disabled:opacity-40"
                          aria-label={`Actions for ${a.name}`}
                        >
                          <IconMore />
                        </button>
                        {isMenuOpen ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-4 top-10 z-20 min-w-[10rem] rounded-xl border border-gold/20 bg-black/90 py-1 shadow-luxury backdrop-blur-xl"
                          >
                            {canUpdate ? (
                              <>
                                {STATUS_OPTIONS.map((o) => (
                                  <button
                                    key={o.value}
                                    type="button"
                                    disabled={a.status === o.value || busy === a.id}
                                    onClick={() => setStatus(a.id, o.value)}
                                    className="block w-full px-3 py-2 text-left text-xs capitalize text-white/75 hover:bg-gold/[0.06] hover:text-gold-light disabled:opacity-40"
                                  >
                                    Mark {o.label.toLowerCase()}
                                  </button>
                                ))}
                                <div className="my-1 border-t border-white/[0.06]" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("Delete this application?")) remove(a.id);
                                  }}
                                  className="block w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-white/[0.04]"
                                >
                                  Delete application
                                </button>
                              </>
                            ) : (
                              <a
                                href={`/courses/${course.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block px-3 py-2 text-xs text-gold hover:bg-gold/[0.06]"
                              >
                                View course page
                              </a>
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-gold/15 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">
              Showing{" "}
              <span className="text-gold-light/90">
                {pageStart + 1} to {Math.min(pageStart + PAGE_SIZE, filtered.length)}
              </span>{" "}
              of {filtered.length} applications
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-gold/30 hover:text-gold-light disabled:opacity-30"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 || n === totalPages || Math.abs(n - safePage) <= 1
                )
                .map((n, idx, arr) => {
                  const prev = arr[idx - 1];
                  const gap = prev !== undefined && n - prev > 1;
                  return (
                    <span key={n} className="flex items-center gap-1">
                      {gap ? <span className="px-1 text-xs text-white/30">…</span> : null}
                      <button
                        type="button"
                        onClick={() => setPage(n)}
                        className={`min-w-[2rem] rounded-lg px-2 py-1.5 text-xs tabular-nums transition ${
                          n === safePage
                            ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light font-medium text-black shadow-md shadow-gold/20"
                            : "border border-white/10 text-white/60 hover:border-gold/30 hover:text-gold-light"
                        }`}
                      >
                        {n}
                      </button>
                    </span>
                  );
                })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-gold/30 hover:text-gold-light disabled:opacity-30"
              >
                →
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <AdminManualApplicationModal
        open={showCreateModal}
        courses={courses}
        onClose={() => setShowCreateModal(false)}
        onCreated={(application) => setRows((r) => [application, ...r])}
      />
    </AdminShell>
  );
}
