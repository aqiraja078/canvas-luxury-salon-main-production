import type { AdminRole } from "@/lib/cms-types";
import { ADMIN_PERMISSIONS, hasPermission, type AdminPermission } from "@/lib/cms-types";

export type AdminRoleTheme = {
  label: string;
  tagline: string;
  icon: string;
  bar: string;
  ring: string;
  badge: string;
  roleText: string;
  avatar: string;
  glow: string;
  border: string;
  wash: string;
};

export const ADMIN_ROLE_THEME: Record<AdminRole, AdminRoleTheme> = {
  owner: {
    label: "Owner",
    tagline: "Full salon control",
    icon: "◆",
    bar: "from-gold-light via-gold to-gold-dark",
    ring: "ring-gold/25",
    badge: "border-gold/40 bg-gold/15 text-gold-light",
    roleText: "text-gold-light",
    avatar: "border-gold/45 bg-gradient-to-br from-gold/30 to-gold/5 text-gold-light",
    glow: "shadow-[0_20px_60px_-18px_rgba(201,169,98,0.45)]",
    border: "border-gold/30",
    wash: "text-gold/[0.06]",
  },
  reception: {
    label: "Reception",
    tagline: "Bookings & day-to-day ops",
    icon: "◎",
    bar: "from-teal-300 via-emerald-500 to-teal-800/90",
    ring: "ring-emerald-400/20",
    badge: "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
    roleText: "text-emerald-100",
    avatar: "border-emerald-400/35 bg-gradient-to-br from-emerald-500/20 to-transparent text-emerald-100",
    glow: "shadow-[0_20px_60px_-20px_rgba(52,211,153,0.35)]",
    border: "border-emerald-400/25",
    wash: "text-emerald-400/[0.06]",
  },
  contact: {
    label: "Contact",
    tagline: "Inquiries & applications",
    icon: "◇",
    bar: "from-rose-300 via-rose-500 to-rose-900/85",
    ring: "ring-rose-400/18",
    badge: "border-rose-400/35 bg-rose-500/10 text-rose-100",
    roleText: "text-rose-100",
    avatar: "border-rose-400/35 bg-gradient-to-br from-rose-500/20 to-transparent text-rose-100",
    glow: "shadow-[0_18px_50px_-18px_rgba(251,113,133,0.32)]",
    border: "border-rose-400/25",
    wash: "text-rose-400/[0.06]",
  },
};

const PERMISSION_CHIP_LABELS: Partial<Record<AdminPermission, string>> = {
  "bookings.view": "Bookings",
  "bookings.update": "Update bookings",
  "bookings.delete": "Delete bookings",
  "services.view": "Services",
  "services.manage": "Manage services",
  "offers.view": "Offers",
  "offers.manage": "Manage offers",
  "team.view": "Team",
  "team.manage": "Manage team",
  "courses.view": "Courses",
  "courses.manage": "Manage courses",
  "course-applications.view": "Applications",
  "course-applications.update": "Update applications",
  "home.view": "Home page",
  "home.manage": "Manage home page",
  "about.view": "About page",
  "about.manage": "Manage about page",
  "users.manage": "Admin users",
};

export function getAdminRoleTheme(role: AdminRole): AdminRoleTheme {
  return ADMIN_ROLE_THEME[role];
}

export function getAdminInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getRolePermissionChips(role: AdminRole): string[] {
  if (role === "owner") return ["Full access"];
  return (Object.keys(ADMIN_PERMISSIONS) as AdminPermission[])
    .filter((p) => hasPermission(role, p))
    .map((p) => PERMISSION_CHIP_LABELS[p] ?? p)
    .filter((label, idx, arr) => arr.indexOf(label) === idx);
}

export function generateStrongPassword(prefix = "Huma"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let core = "";
  for (let i = 0; i < 10; i++) {
    core += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${core}!`;
}
