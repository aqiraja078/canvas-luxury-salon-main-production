import type { AdminPermission } from "@/lib/cms-types";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  permission?: AdminPermission;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/bookings", label: "Bookings", icon: "◎", permission: "bookings.view" },
  { href: "/admin/services", label: "Services", icon: "✦", permission: "services.view" },
  { href: "/admin/home", label: "Home page", icon: "⌂", permission: "home.view" },
  { href: "/admin/about", label: "About page", icon: "◫", permission: "about.view" },
  { href: "/admin/offers", label: "Offers", icon: "◇", permission: "offers.view" },
  { href: "/admin/blog", label: "Blog", icon: "✎", permission: "blog.view" },
  { href: "/admin/courses", label: "Courses", icon: "◐", permission: "courses.view" },
  {
    href: "/admin/course-applications",
    label: "Applications",
    icon: "◑",
    permission: "course-applications.view",
  },
  { href: "/admin/team", label: "Team", icon: "◈", permission: "team.view" },
  { href: "/admin/users", label: "Users", icon: "◉", permission: "users.manage" },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
