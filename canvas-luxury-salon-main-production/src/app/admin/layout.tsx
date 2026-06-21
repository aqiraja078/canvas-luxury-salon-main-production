import type { Metadata } from "next";
import { AdminSessionProvider } from "@/components/admin/AdminSessionProvider";
import { getAdminSession } from "@/lib/admin-auth";
import { toAdminSessionUser } from "@/lib/admin-session-user";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const initialUser = toAdminSessionUser(session);

  return (
    <div className="admin-app min-h-screen bg-[#050505]">
      <AdminSessionProvider initialUser={initialUser}>
        {children}
      </AdminSessionProvider>
    </div>
  );
}
