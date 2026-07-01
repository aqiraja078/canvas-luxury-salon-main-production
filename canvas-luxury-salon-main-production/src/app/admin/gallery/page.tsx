import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getGalleryItems, getGalleryPage } from "@/lib/gallery-store";
import { AdminGalleryClient } from "@/components/admin/AdminGalleryClient";

export const metadata: Metadata = {
  title: "Gallery — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "gallery.view")) redirect("/admin");

  const [items, page] = await Promise.all([getGalleryItems(), getGalleryPage()]);

  return (
    <AdminGalleryClient
      initialItems={items}
      initialPage={page}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
