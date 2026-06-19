"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminRole } from "@/lib/cms-types";
import { hasPermission } from "@/lib/cms-types";
import { AdminUserCard } from "@/components/admin/AdminUserCard";
import { HumaLogoMark } from "@/components/brand/HumaLogoMark";
import { ADMIN_NAV, isAdminNavActive } from "@/lib/admin-nav";
import { site } from "@/lib/site";

type AdminUser = {
  userId: string;
  username: string;
  role: AdminRole;
  name: string;
};

const NAV = ADMIN_NAV;

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setUser)
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const visibleNav = NAV.filter(
    (item) => !item.permission || (user && hasPermission(user.role, item.permission))
  );

  const activeItem = visibleNav.find((item) => isAdminNavActive(pathname, item.href));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_0%,rgba(201,169,98,0.09),transparent_50%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(201,169,98,0.05),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[90rem] flex-col gap-0 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-white/[0.06] lg:bg-black/40 lg:backdrop-blur-xl">
          <div className="border-b border-white/[0.06] px-5 pb-5 pt-5 lg:pt-8">
            <Link href="/admin" className="group flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/35 bg-black/50 shadow-[0_0_30px_-8px_rgba(201,169,98,0.5)]">
                <HumaLogoMark size={34} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold/90">
                  Control panel
                </p>
                <p className="text-sm font-medium text-white/90 group-hover:text-gold-light transition-colors">
                  {site.name}
                </p>
              </div>
            </Link>
            {user ? (
              <div className="mt-5">
                <AdminUserCard
                  name={user.name}
                  username={user.username}
                  role={user.role}
                />
              </div>
            ) : null}
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 py-4 lg:flex-1 lg:flex-col lg:overflow-visible">
            {visibleNav.map((item) => {
              const active = isAdminNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-xs uppercase tracking-[0.14em] transition ${
                    active
                      ? "bg-gradient-to-r from-gold/20 to-gold/5 text-gold border border-gold/25"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  }`}
                >
                  <span className="text-sm opacity-80" aria-hidden>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden border-t border-white/[0.06] p-4 lg:block">
            <Link
              href="/"
              target="_blank"
              className="mb-2 flex w-full items-center justify-center rounded-xl border border-white/10 py-2.5 text-[10px] uppercase tracking-[0.18em] text-white/50 transition hover:border-gold/30 hover:text-gold"
            >
              View live site ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl border border-rose-500/20 bg-rose-500/5 py-2.5 text-[10px] uppercase tracking-[0.18em] text-rose-200/80 transition hover:bg-rose-500/15"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 lg:pl-64">
          <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/60 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10 lg:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                  {activeItem?.label ?? "Admin"}
                </p>
                <h1 className="mt-1 font-display text-2xl text-white sm:text-3xl md:text-4xl">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-2 max-w-2xl text-sm text-white/50">{subtitle}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={logout}
                className="shrink-0 rounded-xl border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/50 lg:hidden"
              >
                Out
              </button>
            </div>
          </header>

          {/* Main tabs — same options as sidebar, always visible */}
          <nav
            className="border-b border-white/[0.06] bg-black/50 backdrop-blur-md"
            aria-label="Admin sections"
          >
            <div className="flex gap-1.5 overflow-x-auto px-4 py-3 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {visibleNav.map((item) => {
                const active = isAdminNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition ${
                      active
                        ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black shadow-[0_4px_20px_-6px_rgba(201,169,98,0.5)]"
                        : "border border-white/10 bg-white/[0.03] text-white/55 hover:border-gold/25 hover:text-white"
                    }`}
                  >
                    <span className="text-xs opacity-90" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="px-4 py-8 sm:px-6 lg:px-10 lg:pb-16">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1.5 text-xs text-white/35">{hint}</p> : null}
    </label>
  );
}

export const adminInputClass =
  "w-full rounded-xl border border-white/12 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-gold/50 focus:bg-black/55 focus:ring-1 focus:ring-gold/20";

export const adminCardClass =
  "rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-sm";

export async function uploadAdminImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json()) as { url?: string; error?: string };
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url!;
}
