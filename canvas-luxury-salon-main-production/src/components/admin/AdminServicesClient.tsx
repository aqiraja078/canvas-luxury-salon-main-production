"use client";

import { useRef, useState } from "react";
import type { CmsService, ServiceCategorySlug } from "@/lib/cms-types";
import { WAX_SECTION_IDS } from "@/lib/waxing-services-data";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const CATEGORIES: { slug: ServiceCategorySlug; label: string }[] = [
  { slug: "hair", label: "Hair" },
  { slug: "makeup", label: "Makeup" },
  { slug: "facial", label: "Facial" },
  { slug: "body-spa", label: "Wax" },
  { slug: "nails", label: "Nails" },
  { slug: "mehndi", label: "Mehndi" },
];

const emptyForm = {
  categorySlug: "hair" as ServiceCategorySlug,
  sectionId: "",
  sectionEmoji: "✨",
  sectionTitle: "",
  name: "",
  description: "",
  price: "",
  duration: "",
  imageUrl: "",
  featured: false,
  active: true,
  sortOrder: 0,
};

export function AdminServicesClient({
  initial,
  sessionUser,
}: {
  initial: CmsService[];
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"all" | ServiceCategorySlug>("all");
  const [editing, setEditing] = useState<CmsService | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "all"
      ? rows
      : rows.filter((r) => {
          if (r.categorySlug !== filter) return false;
          if (filter === "body-spa") {
            return WAX_SECTION_IDS.has(r.sectionId);
          }
          return true;
        });

  function scrollToForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setMsg("");
    setShowForm(true);
    scrollToForm();
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setMsg("");
  }

  function openEdit(s: CmsService) {
    setEditing(s);
    setForm({
      categorySlug: s.categorySlug,
      sectionId: s.sectionId,
      sectionEmoji: s.sectionEmoji,
      sectionTitle: s.sectionTitle,
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration || "",
      imageUrl: s.imageUrl || "",
      featured: s.featured,
      active: s.active,
      sortOrder: s.sortOrder,
    });
    setMsg("");
    setShowForm(true);
    scrollToForm();
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
        ...form,
        duration: form.duration || undefined,
        imageUrl: form.imageUrl || undefined,
      };
      const res = await fetch("/api/admin/services", {
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
      setEditing(null);
      setForm(emptyForm);
      setShowForm(false);
      setMsg("Saved successfully.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editing?.id === id) closeForm();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Services"
      subtitle="Add, edit, or hide services. Cards on the website show name, price & description — no images on service pages."
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            filter === "all" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          All ({rows.length})
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setFilter(c.slug)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
              filter === c.slug ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
            }`}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          onClick={openCreate}
          className="ml-auto rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
        >
          + Add service
        </button>
      </div>

      <div className={`mt-8 grid gap-8 ${showForm ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        <div className="space-y-3">
          {!showForm && filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-sm text-white/50">
              No services yet. Click <strong className="text-gold">+ Add service</strong> to
              create one.
            </p>
          ) : null}
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`${adminCardClass} flex gap-4 p-4`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-2xl">
                {s.sectionEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-gold/80">
                  {s.categorySlug} · {s.sectionTitle}
                </p>
                <h3 className="font-display text-lg text-white">{s.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/60">
                  {s.description}
                </p>
                <p className="mt-2 text-sm text-gold-light">
                  {s.price}
                  {s.duration ? ` · ${s.duration}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm ? (
        <div
          ref={formRef}
          className={`${adminCardClass} h-fit scroll-mt-28 p-5 lg:sticky lg:top-28`}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-xl text-white">
              {editing ? "Edit service" : "Add new service"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white"
            >
              Cancel
            </button>
          </div>
          <p className="mt-2 text-xs text-white/45">
            Fill in the details below, then click Add service to save.
          </p>
          <div className="mt-5 space-y-4">
            <AdminField label="Category">
              <select
                className={adminInputClass}
                value={form.categorySlug}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    categorySlug: e.target.value as ServiceCategorySlug,
                  }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Section title">
              <input
                className={adminInputClass}
                value={form.sectionTitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sectionTitle: e.target.value }))
                }
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Section ID">
                <input
                  className={adminInputClass}
                  value={form.sectionId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sectionId: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Emoji">
                <input
                  className={adminInputClass}
                  value={form.sectionEmoji}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sectionEmoji: e.target.value }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Service name">
              <input
                className={adminInputClass}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                className={`${adminInputClass} min-h-[88px]`}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Price">
                <input
                  className={adminInputClass}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Duration">
                <input
                  className={adminInputClass}
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImage(e.target.files?.[0] ?? null)}
                className="text-sm text-white/70"
              />
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt=""
                  className="mt-2 h-24 w-full rounded-xl object-cover"
                />
              ) : null}
            </AdminField>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm((f) => ({ ...f, active: e.target.checked }))
                }
              />
              Active on website
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
              />
              Featured
            </label>
            {msg ? <p className="text-sm text-gold">{msg}</p> : null}
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Update service" : "Add service"}
            </button>
          </div>
        </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
