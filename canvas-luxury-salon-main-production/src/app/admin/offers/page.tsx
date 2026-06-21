import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { adminCookieName, parseSessionToken } from "@/lib/admin-session";
import { toAdminSessionUser } from "@/lib/admin-session-user";
import { hasPermission } from "@/lib/cms-types";
import { getOffers } from "@/lib/offers-store";
import { AdminOffersClient } from "@/components/admin/AdminOffersClient";

export const metadata: Metadata = {
  title: "Offers — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOffersPage() {
  const jar = await cookies();
  const session = parseSessionToken(jar.get(adminCookieName)?.value);
  if (!session) redirect("/admin/login");
  if (!hasPermission(session.role, "offers.view")) redirect("/admin");

  const offers = await getOffers();
  return (
    <AdminOffersClient
      initial={offers}
      sessionUser={toAdminSessionUser(session)}
    />
  );
}
