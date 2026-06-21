"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { AdminRole, CmsAdminUser } from "@/lib/cms-types";
import {
  generateStrongPassword,
  getAdminInitials,
  getAdminRoleTheme,
  getRolePermissionChips,
} from "@/lib/admin-role-ui";
import type { AdminSessionUser } from "@/lib/admin-session-user";
import { AdminField, AdminShell, adminCardClass, adminInputClass } from "@/components/admin/AdminShell";

type SafeUser = Omit<CmsAdminUser, "passwordHash">;

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "reception", label: "Reception" },
  { value: "contact", label: "Contact Admin" },
];

const emptyForm = {
  username: "",
  password: "",
  name: "",
  email: "",
  role: "reception" as AdminRole,
  active: true,
};

function UserAccountCard({
  user,
  index,
  onEdit,
  onRemove,
}: {
  user: SafeUser;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const theme = getAdminRoleTheme(user.role);
  const chips = getRolePermissionChips(user.role);
  const shapes = [
    "rounded-[1.75rem] rounded-tl-sm",
    "rounded-[1.75rem] rounded-br-sm",
    "rounded-[1.75rem] rounded-tr-sm",
  ];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`group relative overflow-hidden ${shapes[index % shapes.length]} border bg-gradient-to-br from-white/[0.05] to-black/60 p-5 transition duration-300 hover:-translate-y-0.5 ${theme.border} ${theme.glow} ${theme.ring} ring-1`}
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-6 text-[7rem] font-display leading-none ${theme.wash}`}
        aria-hidden
      >
        {theme.icon}
      </div>
      <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${theme.bar}`} />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border font-display text-lg ${theme.avatar}`}
          >
            {getAdminInitials(user.name)}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl text-white">{user.name}</h3>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${theme.badge}`}
              >
                {theme.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                  user.active
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                    : "border-white/15 bg-white/5 text-white/45"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${user.active ? "bg-emerald-400" : "bg-white/30"}`}
                />
                {user.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-1 font-mono text-sm text-white/55">@{user.username}</p>
            {user.email ? (
              <p className="mt-1 text-xs text-white/40">{user.email}</p>
            ) : null}
            <p className="mt-2 text-xs text-white/35">{theme.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 text-[10px] text-white/65"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-white/80 transition hover:border-gold/35 hover:text-gold"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-rose-400/25 bg-rose-500/5 px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-rose-200 transition hover:bg-rose-500/15"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function AdminUsersClient({
  initial,
  sessionUser,
}: {
  initial: SafeUser[];
  sessionUser: AdminSessionUser | null;
}) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<SafeUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");

  const formTheme = getAdminRoleTheme(form.role);
  const formChips = useMemo(() => getRolePermissionChips(form.role), [form.role]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowPassword(false);
  }

  function openEdit(u: SafeUser) {
    setEditing(u);
    setForm({
      username: u.username,
      password: "",
      name: u.name,
      email: u.email || "",
      role: u.role,
      active: u.active,
    });
    setShowPassword(false);
  }

  async function save() {
    setMsg("");
    try {
      const payload: Record<string, unknown> = {
        username: form.username,
        name: form.name,
        email: form.email || undefined,
        role: form.role,
        active: form.active,
      };
      if (form.password) payload.password = form.password;
      const res = await fetch("/api/admin/users", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { id: editing.id, ...payload } : { ...payload, password: form.password }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) {
        setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      } else {
        setRows((prev) => [...prev, data]);
      }
      openCreate();
      setMsg("Account saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this admin account?")) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const sortedRows = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const order: AdminRole[] = ["owner", "reception", "contact"];
        return order.indexOf(a.role) - order.indexOf(b.role);
      }),
    [rows]
  );

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Team access"
      subtitle="Each role has its own look and permissions — owner, reception, and contact."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {(["owner", "reception", "contact"] as AdminRole[]).map((role) => {
          const theme = getAdminRoleTheme(role);
          const count = rows.filter((r) => r.role === role && r.active).length;
          return (
            <div
              key={role}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white/[0.04] to-transparent p-4 ${theme.border}`}
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${theme.bar}`} />
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{theme.label}</p>
              <p className="mt-2 font-display text-3xl text-white">{count}</p>
              <p className="mt-1 text-xs text-white/45">{theme.tagline}</p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={openCreate}
        className="mt-6 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:shadow-[0_8px_24px_-8px_rgba(201,169,98,0.55)]"
      >
        + New account
      </button>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_400px]">
        <div className="grid gap-4">
          {sortedRows.map((u, idx) => (
            <UserAccountCard
              key={u.id}
              user={u}
              index={idx}
              onEdit={() => openEdit(u)}
              onRemove={() => remove(u.id)}
            />
          ))}
        </div>

        <div className={`${adminCardClass} relative h-fit overflow-hidden p-5 lg:sticky lg:top-28`}>
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${formTheme.bar}`} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl border font-display ${formTheme.avatar}`}
              >
                {form.name ? getAdminInitials(form.name) : formTheme.icon}
              </span>
              <div>
                <h2 className="font-display text-xl text-white">
                  {editing ? "Edit account" : "New account"}
                </h2>
                <p className="text-xs text-white/45">{formTheme.tagline}</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <AdminField label="Display name">
                <input
                  className={adminInputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Huma Owner"
                />
              </AdminField>
              <AdminField label="Username">
                <input
                  className={adminInputClass}
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="huma.reception"
                />
              </AdminField>
              <AdminField label={editing ? "New password (optional)" : "Password"}>
                <div className="flex gap-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={adminInputClass}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 rounded-xl border border-white/12 px-3 text-[10px] uppercase tracking-wider text-white/50 hover:border-gold/30 hover:text-gold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, password: generateStrongPassword() }))
                  }
                  className="mt-2 text-[10px] uppercase tracking-[0.15em] text-gold/80 hover:text-gold"
                >
                  Generate strong password
                </button>
              </AdminField>
              <AdminField label="Role">
                <select
                  className={adminInputClass}
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value as AdminRole }))
                  }
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </AdminField>

              <div className="rounded-xl border border-white/10 bg-black/30 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  This role can
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {formChips.map((chip) => (
                    <span
                      key={chip}
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] ${formTheme.badge}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <AdminField label="Email (optional)">
                <input
                  type="email"
                  className={adminInputClass}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </AdminField>
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                />
                Account active
              </label>
              {msg ? (
                <p className="rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 text-sm text-gold-light">
                  {msg}
                </p>
              ) : null}
              <button
                type="button"
                onClick={save}
                className="w-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3 text-xs font-semibold uppercase tracking-wider text-black"
              >
                Save account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
