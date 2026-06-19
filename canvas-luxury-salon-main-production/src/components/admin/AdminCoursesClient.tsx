"use client";

import { useState } from "react";
import type { CmsCourse } from "@/lib/cms-types";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const emptyForm = {
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  duration: "",
  fee: "",
  syllabus: "",
  highlights: "",
  instructor: "",
  nextBatch: "",
  imageUrl: "",
  featured: false,
  active: true,
  sortOrder: 0,
};

export function AdminCoursesClient({ initial }: { initial: CmsCourse[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<CmsCourse | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
  }

  function openEdit(c: CmsCourse) {
    setEditing(c);
    setForm({
      slug: c.slug,
      title: c.title,
      shortDescription: c.shortDescription,
      description: c.description,
      duration: c.duration,
      fee: c.fee,
      syllabus: c.syllabus.join(", "),
      highlights: c.highlights.join(", "),
      instructor: c.instructor || "",
      nextBatch: c.nextBatch || "",
      imageUrl: c.imageUrl || "",
      featured: c.featured,
      active: c.active,
      sortOrder: c.sortOrder,
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
        ...form,
        slug: form.slug || undefined,
        instructor: form.instructor || undefined,
        nextBatch: form.nextBatch || undefined,
        imageUrl: form.imageUrl || undefined,
        syllabus: form.syllabus
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        highlights: form.highlights
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/courses", {
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
    if (!confirm("Delete this course?")) return;
    const res = await fetch("/api/admin/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <AdminShell
      title="Courses"
      subtitle="Manage academy courses — they appear on /courses. Students apply without online payment."
    >
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
        >
          + Add course
        </button>
        <a
          href="/admin/course-applications"
          className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:border-gold/30 hover:text-gold"
        >
          View applications
        </a>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_400px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-black"
            >
              {c.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.imageUrl} alt="" className="h-32 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-gold/80">
                  {c.duration} · {c.active ? "Active" : "Hidden"}
                </p>
                <h3 className="mt-2 font-display text-xl text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-white/60">/{c.slug}</p>
                <p className="mt-2 text-sm font-semibold text-gold-light">{c.fee}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(c)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <a
                    href={`/courses/${c.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${adminCardClass} h-fit p-5 lg:sticky lg:top-28`}>
          <h2 className="font-display text-xl">{editing ? "Edit course" : "New course"}</h2>
          <div className="mt-5 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <AdminField label="Title">
              <input
                className={adminInputClass}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="URL slug" hint="Leave blank to auto-generate from title">
              <input
                className={adminInputClass}
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="professional-makeup"
              />
            </AdminField>
            <AdminField label="Short description">
              <textarea
                className={`${adminInputClass} min-h-[60px]`}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
              />
            </AdminField>
            <AdminField label="Full description">
              <textarea
                className={`${adminInputClass} min-h-[100px]`}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Duration">
                <input
                  className={adminInputClass}
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="8 weeks"
                />
              </AdminField>
              <AdminField label="Fee (display only)">
                <input
                  className={adminInputClass}
                  value={form.fee}
                  onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
                  placeholder="Rs. 45,000"
                />
              </AdminField>
            </div>
            <AdminField label="Syllabus (comma separated)">
              <textarea
                className={`${adminInputClass} min-h-[70px]`}
                value={form.syllabus}
                onChange={(e) => setForm((f) => ({ ...f, syllabus: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Highlights (comma separated)">
              <input
                className={adminInputClass}
                value={form.highlights}
                onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
              />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Instructor">
                <input
                  className={adminInputClass}
                  value={form.instructor}
                  onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Next batch">
                <input
                  className={adminInputClass}
                  value={form.nextBatch}
                  onChange={(e) => setForm((f) => ({ ...f, nextBatch: e.target.value }))}
                  placeholder="March 2026"
                />
              </AdminField>
            </div>
            <AdminField label="Cover image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImage(e.target.files?.[0] ?? null)}
                className="text-sm text-white/70"
              />
            </AdminField>
            <AdminField label="Sort order">
              <input
                type="number"
                className={adminInputClass}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                }
              />
            </AdminField>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
              Featured on /courses
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              />
              Active (visible on site)
            </label>
            {msg ? <p className="text-sm text-gold">{msg}</p> : null}
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black"
            >
              Save course
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
