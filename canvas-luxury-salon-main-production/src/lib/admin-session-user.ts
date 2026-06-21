import type { AdminRole } from "@/lib/cms-types";
import type { SessionPayload } from "@/lib/admin-session";

export type AdminSessionUser = {
  userId: string;
  username: string;
  role: AdminRole;
  name: string;
};

export function toAdminSessionUser(
  session: SessionPayload | null | undefined
): AdminSessionUser | null {
  if (!session) return null;
  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
    name: session.name,
  };
}
