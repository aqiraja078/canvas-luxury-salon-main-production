"use client";

import { useState } from "react";
import type { CmsTeamMember } from "@/lib/cms-types";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const emptyForm = {
  name: "",
  role: "",
  bio: "",
  specialties: "",
  experienceYears: "",
  imageUrl: "",
  instagram: "",
  sortOrder: 0,
  active: true,
};

export function AdminTeamClient({ initial }: { initial: CmsTeamMember[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<CmsTeamMember | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
  }

  function openEdit(m: CmsTeamMember) {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      specialties: m.specialties.join(", "),
      experienceYears: m.experienceYears?.toString() || "",
      imageUrl: m.imageUrl || "",
      instagram: m.instagram || "",
      sortOrder: m.sortOrder,
      active: m.active,
    });
  }

  async function onImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        imageUrl: form.imageUrl || undefined,
        instagram: form.instagram || undefined,
        sortOrder: form.sortOrder,
        active: form.active,
      };
      const res = await fetch("/api/admin/team", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) {
        setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      } else {
        setRows((prev) => [...prev, data]);
      }
      openCreate();
      setMsg("Saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove team member?")) return;
    const res = await fetch("/api/admin/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <AdminShell
      title="Team"
      subtitle="Manage team members shown on the homepage — photo, bio, and specialties."
    >
      <button type="button" onClick={openCreate} className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black">
        + Add member
      </button>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => (
            <div key={m.id} className={`${adminCardClass} p-5 text-center`}>
              {m.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.imageUrl} alt="" className="mx-auto h-28 w-28 rounded-full object-cover" />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gold/10 text-3xl text-gold">
                  {m.name.charAt(0)}
                </div>
              )}
              <h3 className="mt-4 font-display text-xl text-white">{m.name}</h3>
              <p className="text-sm text-gold">{m.role}</p>
              <p className="mt-2 line-clamp-3 text-sm text-white/60">{m.bio}</p>
              <div className="mt-4 flex justify-center gap-2">
                <button type="button" onClick={() => openEdit(m)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">Edit</button>
                <button type="button" onClick={() => remove(m.id)} className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className={`${adminCardClass} h-fit p-5 lg:sticky lg:top-28`}>
          <h2 className="font-display text-xl">{editing ? "Edit member" : "New member"}</h2>
          <div className="mt-5 space-y-4">
            <AdminField label="Name"><input className={adminInputClass} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></AdminField>
            <AdminField label="Role"><input className={adminInputClass} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} /></AdminField>
            <AdminField label="Bio"><textarea className={`${adminInputClass} min-h-[80px]`} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} /></AdminField>
            <AdminField label="Specialties (comma separated)"><input className={adminInputClass} value={form.specialties} onChange={(e) => setForm((f) => ({ ...f, specialties: e.target.value }))} /></AdminField>
            <AdminField label="Experience (years)"><input className={adminInputClass} value={form.experienceYears} onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))} /></AdminField>
            <AdminField label="Instagram URL"><input className={adminInputClass} value={form.instagram} onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))} /></AdminField>
            <AdminField label="Photo"><input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0] ?? null)} className="text-sm text-white/70" /></AdminField>
            <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />Active</label>
            {msg ? <p className="text-sm text-gold">{msg}</p> : null}
            <button type="button" disabled={busy} onClick={save} className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black">Save member</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
