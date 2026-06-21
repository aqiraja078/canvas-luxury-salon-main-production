"use client";

import { useEffect, useMemo, useState } from "react";
import type { Booking, BookingStatus } from "@/lib/bookings-types";
import type { AdminSessionUser } from "@/lib/admin-session-user";
import { AdminShell, adminCardClass, adminInputClass } from "@/components/admin/AdminShell";
import { AdminManualBookingModal } from "@/components/admin/AdminManualBookingModal";

const DISPLAY_LOCALE = "en-GB";

type Props = {
  initial: Booking[];
  sessionUser: AdminSessionUser | null;
  title: string;
  subtitle: string;
  monthFrom: string;
  monthTo: string;
  todayDate: string;
  canCreate: boolean;
};

const PAGE_SIZE = 8;
const UNPRICED = "__unpriced__";

const STATUS_FILTERS: { value: "all" | BookingStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

function bookingRef(id: string) {
  const compact = id.replace(/-/g, "");
  return compact.slice(-8).toUpperCase();
}

function parseService(service: string) {
  const parts = service.split("·").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return { name: parts[0], detail: parts.slice(1).join(" · ") };
  }
  if (parts.length === 2) {
    return { name: parts[0], detail: parts[1] };
  }
  return { name: service, detail: "" };
}

function formatDateRangeDisplay(from: string, to: string) {
  const fmt = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(DISPLAY_LOCALE, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return `From ${fmt(from)}`;
  if (to) return `Until ${fmt(to)}`;
  return "All dates";
}

function weekdayLabel(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString(DISPLAY_LOCALE, {
    weekday: "long",
  });
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

function statusBadgeClass(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "border-gold/40 text-gold-light bg-gold/10";
    case "pending":
      return "border-amber-400/40 text-amber-100 bg-amber-500/10";
    case "cancelled":
      return "border-rose-400/35 text-rose-100 bg-rose-500/10";
  }
}

function bookingGrowthPercent(rows: Booking[]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const last30 = rows.filter(
    (b) => now - new Date(b.createdAt).getTime() <= 30 * day
  ).length;
  const prev30 = rows.filter((b) => {
    const age = now - new Date(b.createdAt).getTime();
    return age > 30 * day && age <= 60 * day;
  }).length;
  if (!prev30) return last30 > 0 ? 100 : 0;
  return Math.round(((last30 - prev30) / prev30) * 100);
}

function exportBookingsCsv(bookings: Booking[]) {
  const headers = [
    "Ref",
    "Customer",
    "Phone",
    "Email",
    "Service",
    "Date",
    "Time",
    "Amount",
    "Status",
    "Submitted",
  ];
  const lines = bookings.map((b) =>
    [
      bookingRef(b.id),
      b.name,
      b.phone,
      b.email,
      b.service,
      b.date,
      b.time,
      b.priceLabel ?? "",
      b.status,
      b.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
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

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
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

function IconX({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
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

function IconFilter({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" />
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

const TH =
  "px-4 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-gold/60 whitespace-nowrap first:pl-6 last:pr-6";
const TD =
  "px-4 py-3.5 align-middle text-sm first:pl-6 last:pr-6";

export function AdminBookingsClient({
  initial,
  sessionUser,
  title,
  subtitle,
  monthFrom,
  monthTo,
  todayDate,
  canCreate,
}: Props) {
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [dateFrom, setDateFrom] = useState(monthFrom);
  const [dateTo, setDateTo] = useState(monthTo);
  const [priceFilter, setPriceFilter] = useState<string>("all");

  useEffect(() => {
    function onDocClick() {
      setOpenMenuId(null);
      setDeleteConfirm(null);
    }
    if (openMenuId) {
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }
  }, [openMenuId]);

  const stats = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((b) => b.status === "pending").length,
      confirmed: rows.filter((b) => b.status === "confirmed").length,
      cancelled: rows.filter((b) => b.status === "cancelled").length,
    }),
    [rows]
  );

  const growth = useMemo(() => bookingGrowthPercent(rows), [rows]);

  const priceOptions = useMemo(() => {
    const set = new Set<string>();
    for (const b of rows) {
      const p = (b.priceLabel ?? "").trim();
      if (p) set.add(p);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const hasUnpriced = useMemo(
    () => rows.some((b) => !(b.priceLabel ?? "").trim()),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rows.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (dateFrom && b.date < dateFrom) return false;
      if (dateTo && b.date > dateTo) return false;
      if (priceFilter !== "all") {
        const pl = (b.priceLabel ?? "").trim();
        if (priceFilter === UNPRICED) return !pl;
        return pl === priceFilter;
      }
      if (q) {
        const hay = `${b.name} ${b.email} ${b.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [rows, statusFilter, dateFrom, dateTo, priceFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFrom, dateTo, priceFilter, search]);

  const filtersActive =
    statusFilter !== "all" ||
    priceFilter !== "all" ||
    Boolean(search.trim());

  function clearFilters() {
    setStatusFilter("all");
    setDateFrom(monthFrom);
    setDateTo(monthTo);
    setPriceFilter("all");
    setSearch("");
  }

  async function setStatus(id: string, status: BookingStatus) {
    setBusy(id);
    setOpenMenuId(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = (await res.json()) as Booking;
      setRows((r) => r.map((b) => (b.id === id ? updated : b)));
    } finally {
      setBusy(null);
    }
  }

  async function deleteBooking(id: string) {
    setBusy(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Deletion failed");
      setRows((r) => r.filter((b) => b.id !== id));
      setDeleteConfirm(null);
      setOpenMenuId(null);
    } finally {
      setBusy(null);
    }
  }

  const pct = (n: number) => (stats.all ? Math.round((n / stats.all) * 100) : 0);

  const headerActions = (
    <>
      <div className="flex items-center gap-2 rounded-xl border border-gold/25 bg-black/55 px-3 py-2 backdrop-blur-sm">
        <IconCalendar className="h-4 w-4 shrink-0 text-gold/70" />
        <label className="sr-only" htmlFor="bookings-date-from">
          From date
        </label>
        <input
          id="bookings-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-[7.5rem] cursor-pointer bg-transparent text-xs text-white/80 outline-none focus:text-gold-light"
        />
        <span className="text-gold/30">–</span>
        <label className="sr-only" htmlFor="bookings-date-to">
          To date
        </label>
        <input
          id="bookings-date-to"
          type="date"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-[7.5rem] cursor-pointer bg-transparent text-xs text-white/80 outline-none focus:text-gold-light"
        />
      </div>
      {canCreate ? (
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn-gold-premium inline-flex items-center gap-1.5 px-4 py-2 text-[10px]"
        >
          <IconPlus className="h-3.5 w-3.5" />
          New Booking
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
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Bookings",
            value: stats.all,
            sub:
              growth >= 0
                ? `+${growth}% vs last 30 days`
                : `${growth}% vs last 30 days`,
            subClass: growth >= 0 ? "text-gold-light/80" : "text-rose-300/80",
            icon: <IconCalendar className="h-4 w-4 text-gold-light" />,
            iconBg: "border border-gold/25 bg-gold/10",
            cardBorder: "border-white/10 hover:border-gold/35",
          },
          {
            label: "Confirmed",
            value: stats.confirmed,
            sub: `${pct(stats.confirmed)}% of total bookings`,
            subClass: "text-white/40",
            icon: <IconCheck className="h-4 w-4 text-gold-light" />,
            iconBg: "border border-gold/25 bg-gold/10",
            cardBorder: "border-emerald-400/15 hover:border-gold/30",
          },
          {
            label: "Pending",
            value: String(stats.pending).padStart(2, "0"),
            sub: `${pct(stats.pending)}% awaiting confirmation`,
            subClass: "text-white/40",
            icon: <IconClock className="h-4 w-4 text-amber-200" />,
            iconBg: "border border-amber-400/25 bg-amber-500/10",
            cardBorder: "border-amber-400/15 hover:border-gold/30",
          },
          {
            label: "Cancelled",
            value: String(stats.cancelled).padStart(2, "0"),
            sub: `${pct(stats.cancelled)}% of total bookings`,
            subClass: "text-white/40",
            icon: <IconX className="h-4 w-4 text-rose-200" />,
            iconBg: "border border-rose-400/25 bg-rose-500/10",
            cardBorder: "border-rose-400/15 hover:border-gold/30",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border bg-gradient-to-br from-white/[0.05] to-transparent p-4 transition hover:shadow-[0_12px_40px_-12px_rgba(201,169,98,0.25)] sm:p-5 ${card.cardBorder}`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}
              >
                {card.icon}
              </span>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                {card.label}
              </p>
            </div>
            <p className="mt-3 font-display text-2xl tabular-nums text-gold-light sm:text-3xl">
              {card.value}
            </p>
            <p className={`mt-1 text-[10px] tracking-wide ${card.subClass}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition ${
              showFilters || filtersActive
                ? "border-gold/40 bg-gold/10 text-gold-light"
                : "border-white/10 bg-black/40 text-white/70 hover:border-gold/30 hover:text-white"
            }`}
          >
            <IconFilter className="h-4 w-4" />
            Filter
            {filtersActive ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] text-black">
                !
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => exportBookingsCsv(filtered)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/70 transition hover:border-gold/30 hover:text-gold-light"
          >
            <IconDownload className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters ? (
        <div className={`mt-4 p-4 sm:p-5 ${adminCardClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gold/70">
              Filters
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-wider text-gold-light transition hover:text-gold"
              >
                Clear all
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_FILTERS.map(({ value, label }) => {
              const active = statusFilter === value;
              const count =
                value === "all"
                  ? stats.all
                  : value === "pending"
                    ? stats.pending
                    : value === "confirmed"
                      ? stats.confirmed
                      : stats.cancelled;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] transition ${
                    active
                      ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black shadow-md shadow-gold/20"
                      : "border border-white/10 text-white/55 hover:border-gold/25 hover:text-white"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                Price label
              </span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className={adminInputClass}
              >
                <option value="all">All prices</option>
                {hasUnpriced ? (
                  <option value={UNPRICED}>No price label</option>
                ) : null}
                {priceOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.2em] text-white/35">
                Date range
              </p>
              <p className={`${adminInputClass} text-white/70`}>
                {formatDateRangeDisplay(dateFrom, dateTo)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Table */}
      <div className={`mt-6 overflow-hidden ${adminCardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gold/15 bg-black/25">
                <th className={TH}>Ref ID</th>
                <th className={TH}>Customer</th>
                <th className={TH}>Phone</th>
                <th className={TH}>Email</th>
                <th className={TH}>Service</th>
                <th className={TH}>Date</th>
                <th className={TH}>Time</th>
                <th className={TH}>Amount</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-right`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center">
                    <p className="text-sm text-white/60">
                      {rows.length === 0
                        ? "Abhi koi booking nahi."
                        : "In filters se koi match nahi."}
                    </p>
                    {filtersActive ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-xs text-gold-light hover:text-gold"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : (
                pageRows.map((b) => {
                  const ref = bookingRef(b.id);
                  const svc = parseService(b.service);
                  const isMenuOpen = openMenuId === b.id;
                  const submitted = formatSubmittedAt(b.createdAt);
                  const serviceDetail = svc.detail || b.priceLabel?.trim() || "";

                  return (
                    <tr
                      key={b.id}
                      className="border-b border-white/[0.06] transition hover:bg-gold/[0.03]"
                    >
                      <td className={`${TD} whitespace-nowrap`}>
                        <span className="font-mono font-semibold text-gold-light">{ref}</span>
                        <span className="mx-1.5 text-gold/20">·</span>
                        <span className="text-[11px] text-white/40">Submitted {submitted}</span>
                      </td>
                      <td className={`${TD} max-w-[9rem] truncate whitespace-nowrap font-medium text-white`}>
                        {b.name}
                      </td>
                      <td className={`${TD} whitespace-nowrap text-white/70`}>
                        <a
                          href={`tel:${b.phone.replace(/\s/g, "")}`}
                          className="hover:text-gold-light"
                        >
                          {b.phone}
                        </a>
                      </td>
                      <td className={`${TD} max-w-[11rem] truncate whitespace-nowrap text-white/70`}>
                        <a
                          href={`mailto:${encodeURIComponent(b.email)}`}
                          className="hover:text-gold-light"
                          title={b.email}
                        >
                          {b.email}
                        </a>
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-2">
                          <span className="rounded border border-gold/25 bg-gold/[0.06] px-2 py-0.5 text-[11px] text-gold-light">
                            {svc.name}
                          </span>
                          {serviceDetail ? (
                            <span className="text-[11px] text-white/40">{serviceDetail}</span>
                          ) : null}
                        </span>
                      </td>
                      <td className={`${TD} whitespace-nowrap text-white/80`}>
                        <span>{b.date}</span>
                        <span className="mx-1.5 text-gold/20">·</span>
                        <span className="text-white/40">{weekdayLabel(b.date)}</span>
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <span className="inline-block rounded border border-gold/20 bg-black/40 px-2 py-0.5 font-mono text-[11px] text-gold-light/90">
                          {b.time}
                        </span>
                      </td>
                      <td className={`${TD} whitespace-nowrap tabular-nums text-gold-light/95`}>
                        {b.priceLabel?.trim() || "—"}
                      </td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] capitalize ${statusBadgeClass(b.status)}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className={`${TD} relative whitespace-nowrap text-right`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(isMenuOpen ? null : b.id);
                            setDeleteConfirm(null);
                          }}
                          disabled={busy === b.id}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-white/45 transition hover:bg-gold/10 hover:text-gold-light disabled:opacity-40"
                          aria-label={`Actions for ${b.name}`}
                        >
                          <IconMore />
                        </button>
                        {isMenuOpen ? (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-4 top-10 z-20 min-w-[10rem] rounded-xl border border-gold/20 bg-black/90 py-1 shadow-luxury backdrop-blur-xl"
                          >
                            {deleteConfirm === b.id ? (
                              <>
                                <p className="px-3 py-2 text-[11px] text-rose-300">
                                  Delete this booking?
                                </p>
                                <button
                                  type="button"
                                  onClick={() => deleteBooking(b.id)}
                                  className="block w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-white/[0.04]"
                                >
                                  Confirm delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm(null)}
                                  className="block w-full px-3 py-2 text-left text-xs text-white/60 hover:bg-white/[0.04]"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/30">
                                  Update status
                                </p>
                                {(["pending", "confirmed", "cancelled"] as const).map(
                                  (s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      disabled={b.status === s || busy === b.id}
                                      onClick={() => setStatus(b.id, s)}
                                      className="block w-full px-3 py-2 text-left text-xs capitalize text-white/75 hover:bg-gold/[0.06] hover:text-gold-light disabled:opacity-40"
                                    >
                                      {s}
                                    </button>
                                  )
                                )}
                                <div className="my-1 border-t border-white/[0.06]" />
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm(b.id)}
                                  className="block w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-white/[0.04]"
                                >
                                  Delete booking
                                </button>
                              </>
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

        {/* Pagination */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-gold/15 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">
              Showing{" "}
              <span className="text-gold-light/90">
                {pageStart + 1} to {Math.min(pageStart + PAGE_SIZE, filtered.length)}
              </span>{" "}
              of {filtered.length} bookings
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
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - safePage) <= 1
                )
                .map((n, idx, arr) => {
                  const prev = arr[idx - 1];
                  const gap = prev !== undefined && n - prev > 1;
                  return (
                    <span key={n} className="flex items-center gap-1">
                      {gap ? (
                        <span className="px-1 text-xs text-white/30">…</span>
                      ) : null}
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

      <AdminManualBookingModal
        open={showCreateModal}
        defaultDate={todayDate}
        onClose={() => setShowCreateModal(false)}
        onCreated={(booking) => setRows((r) => [booking, ...r])}
      />
    </AdminShell>
  );
}
