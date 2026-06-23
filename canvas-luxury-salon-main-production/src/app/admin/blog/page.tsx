import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getBlogPage, getBlogPosts } from "@/lib/blog-store";
import { AdminBlogClient } from "@/components/admin/AdminBlogClient";

export const metadata: Metadata = {
  title: "Blog — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "blog.view")) redirect("/admin");

  const [posts, page] = await Promise.all([getBlogPosts(), getBlogPage()]);
  return (
    <AdminBlogClient
      initialPosts={posts}
      initialPage={page}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
