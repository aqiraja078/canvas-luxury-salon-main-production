"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AdminSessionUser } from "@/lib/admin-session-user";

type AdminSessionContextValue = {
  user: AdminSessionUser | null;
  logout: () => Promise<void>;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

export function AdminSessionProvider({
  initialUser,
  children,
}: {
  initialUser: AdminSessionUser | null;
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AdminSessionUser | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setUser(null);
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <AdminSessionContext.Provider value={{ user, logout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession(): AdminSessionContextValue {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return ctx;
}

export type { AdminSessionUser };
