"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CmsGalleryItem, CmsGalleryPage, GalleryCategory, GalleryMediaType } from "@/lib/cms-types";
import {
  GALLERY_CATEGORIES,
  GALLERY_MEDIA_TYPES,
} from "@/lib/gallery-constants";
import { galleryItemThumbnail } from "@/lib/gallery-utils";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const emptyForm = {
  title: "",
  caption: "",
  category: "bridal" as GalleryCategory,
  mediaType: "image" as GalleryMediaType,
  imageUrl: "",
  beforeImageUrl: "",
  afterImageUrl: "",
  videoUrl: "",
  sortOrder: 0,
  active: true,
};

export function AdminGalleryClient({
  initialItems,
  initialPage,
  sessionUser,
}: {
  initialItems: CmsGalleryItem[];
  initialPage: CmsGalleryPage;
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [tab, setTab] = useState<"items" | "page">("items");
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [editing, setEditing] = useState<CmsGalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [metaBusy, setMetaBusy] = useState(false);
  const [metaHint, setMetaHint] = useState("");
  const [msg, setMsg] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const lastFetchedVideoUrl = useRef("");

  useEffect(() => {
    if (form.mediaType !== "video") return;
    const url = form.videoUrl.trim();
    if (!url || url.length < 12) {
      setMetaHint("");
      return;
    }
    if (url === lastFetchedVideoUrl.current) return;

    const timer = window.setTimeout(() => {
      void (async () => {
        setMetaBusy(true);
        setMetaHint("Fetching thumbnail and caption from video link…");
        try {
          const res = await fetch(
            `/api/admin/gallery/video-meta?url=${encodeURIComponent(url)}`
          );
          const data = (await res.json()) as {
            thumbnailUrl?: string;
            title?: string;
            caption?: string;
            error?: string;
          };
          if (!res.ok) {
            setMetaHint(data.error || "Could not load video preview.");
            return;
          }

          lastFetchedVideoUrl.current = url;
          setForm((f) => ({
            ...f,
            imageUrl: data.thumbnailUrl || f.imageUrl,
            title: f.title.trim() ? f.title : data.title || f.title,
            caption: f.caption.trim() ? f.caption : data.caption || f.caption,
          }));
          setMetaHint("Thumbnail and caption added from video link.");
        } catch {
          setMetaHint("Could not load video preview. Check the link and try again.");
        } finally {
          setMetaBusy(false);
        }
      })();
    }, 700);

    return () => window.clearTimeout(timer);
  }, [form.mediaType, form.videoUrl]);

  const filtered = useMemo(
    () =>
      filter === "all" ? items : items.filter((i) => i.category === filter),
    [items, filter]
  );

  function scrollToForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openCreate(category?: GalleryCategory) {
    setEditing(null);
    lastFetchedVideoUrl.current = "";
    setMetaHint("");
    setForm({
      ...emptyForm,
      category: category ?? "bridal",
      mediaType: category === "before-after" ? "before-after" : category === "reels" || category === "instagram" ? "video" : "image",
      sortOrder: items.reduce((max, i) => Math.max(max, i.sortOrder), -1) + 1,
    });
    setShowForm(true);
    setTab("items");
    scrollToForm();
  }

  function openEdit(item: CmsGalleryItem) {
    setEditing(item);
    lastFetchedVideoUrl.current = item.videoUrl?.trim() || "";
    setMetaHint("");
    setForm({
      title: item.title,
      caption: item.caption || "",
      category: item.category,
      mediaType: item.mediaType,
      imageUrl: item.imageUrl || "",
      beforeImageUrl: item.beforeImageUrl || "",
      afterImageUrl: item.afterImageUrl || "",
      videoUrl: item.videoUrl || "",
      sortOrder: item.sortOrder,
      active: item.active,
    });
    setShowForm(true);
    setTab("items");
    scrollToForm();
  }

  async function uploadField(
    file: File | null,
    field: "imageUrl" | "beforeImageUrl" | "afterImageUrl"
  ) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setForm((f) => ({ ...f, [field]: url }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveItem() {
    setBusy(true);
    setMsg("");
    try {
      const payload = { ...form, id: editing?.id };
      const res = await fetch("/api/admin/gallery", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as CmsGalleryItem & { error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) {
        setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)));
      } else {
        setItems((prev) => [...prev, data]);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      setMsg("Gallery item saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editing?.id === id) {
        setShowForm(false);
        setEditing(null);
      }
      setMsg("Item deleted.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePage() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page }),
      });
      const data = (await res.json()) as { page?: CmsGalleryPage; error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (data.page) setPage(data.page);
      setMsg("Page settings saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Gallery"
      subtitle="Add photos, before/after sets, and Instagram or TikTok video links. Videos play on the gallery page when visitors tap them."
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("items")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            tab === "items" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          Items ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("page")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            tab === "page" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          Page settings
        </button>
        {tab === "items" ? (
          <button
            type="button"
            onClick={() => openCreate()}
            className="ml-auto rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
          >
            + Add item
          </button>
        ) : null}
      </div>

      {msg ? <p className="mt-4 text-sm text-gold">{msg}</p> : null}

      {tab === "page" ? (
        <div className={`${adminCardClass} mt-8 space-y-5 p-5`}>
          <h2 className="font-display text-xl text-white">Gallery page</h2>
          <AdminField label="Kicker">
            <input className={adminInputClass} value={page.kicker} onChange={(e) => setPage((p) => ({ ...p, kicker: e.target.value }))} />
          </AdminField>
          <AdminField label="Title">
            <input className={adminInputClass} value={page.title} onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))} />
          </AdminField>
          <AdminField label="Subtitle">
            <textarea className={`${adminInputClass} min-h-[88px]`} value={page.subtitle} onChange={(e) => setPage((p) => ({ ...p, subtitle: e.target.value }))} />
          </AdminField>
          <AdminField label="Instagram profile URL">
            <input className={adminInputClass} value={page.instagramUrl} onChange={(e) => setPage((p) => ({ ...p, instagramUrl: e.target.value }))} />
          </AdminField>
          <AdminField label="TikTok profile URL">
            <input className={adminInputClass} value={page.tiktokUrl} onChange={(e) => setPage((p) => ({ ...p, tiktokUrl: e.target.value }))} />
          </AdminField>
          <AdminField label="Empty section message">
            <textarea className={`${adminInputClass} min-h-[72px]`} value={page.emptyMessage} onChange={(e) => setPage((p) => ({ ...p, emptyMessage: e.target.value }))} />
          </AdminField>
          <button type="button" disabled={busy} onClick={savePage} className="rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50">
            {busy ? "Saving…" : "Save page settings"}
          </button>
        </div>
      ) : (
        <div className={`mt-8 grid gap-8 ${showForm ? "xl:grid-cols-[1fr_380px]" : ""}`}>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider ${filter === "all" ? "bg-gold/15 text-gold" : "border border-white/10 text-white/55"}`}>
                All
              </button>
              {GALLERY_CATEGORIES.map((c) => (
                <button key={c.id} type="button" onClick={() => setFilter(c.id)} className={`rounded-full px-3 py-1.5 text-[10px] uppercase tracking-wider ${filter === c.id ? "bg-gold/15 text-gold" : "border border-white/10 text-white/55"}`}>
                  {c.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-sm text-white/50">
                No items yet. Click <strong className="text-gold">+ Add item</strong>.
              </p>
            ) : null}

            {filtered.map((item) => {
              const thumb = galleryItemThumbnail(item);
              return (
                <div key={item.id} className={`${adminCardClass} flex gap-4 p-4`}>
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-black/40">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gold">Video</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-gold/80">
                      {GALLERY_CATEGORIES.find((c) => c.id === item.category)?.label}
                      {!item.active ? " · Hidden" : ""}
                    </p>
                    <h3 className="font-display text-lg text-white">{item.title}</h3>
                    <p className="text-xs text-white/45">{item.mediaType}{item.videoUrl ? ` · ${item.videoUrl}` : ""}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">Edit</button>
                    <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>

          {showForm ? (
            <div ref={formRef} className={`${adminCardClass} h-fit scroll-mt-28 p-5 lg:sticky lg:top-28`}>
              <h2 className="font-display text-xl text-white">{editing ? "Edit item" : "New item"}</h2>
              <div className="mt-5 space-y-4">
                <AdminField label="Section">
                  <select className={adminInputClass} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GalleryCategory }))}>
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </AdminField>
                <AdminField label="Type">
                  <select className={adminInputClass} value={form.mediaType} onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value as GalleryMediaType }))}>
                    {GALLERY_MEDIA_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </AdminField>

                {form.mediaType === "video" ? (
                  <>
                    <AdminField label="Instagram / TikTok / video URL">
                      <input
                        className={adminInputClass}
                        value={form.videoUrl}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next.trim() !== lastFetchedVideoUrl.current) {
                            setMetaHint("");
                          }
                          setForm((f) => ({ ...f, videoUrl: next }));
                        }}
                        placeholder="https://www.instagram.com/reel/… or https://www.tiktok.com/@…/video/…"
                      />
                    </AdminField>
                    {metaBusy ? (
                      <p className="text-xs text-gold/80">Loading video thumbnail…</p>
                    ) : metaHint ? (
                      <p className="text-xs text-white/50">{metaHint}</p>
                    ) : null}
                    {form.imageUrl ? (
                      <div className="overflow-hidden rounded-xl border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.imageUrl}
                          alt="Video thumbnail preview"
                          className="aspect-video w-full object-cover"
                        />
                        <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-gold/70">
                          Auto thumbnail from video
                        </p>
                      </div>
                    ) : null}
                  </>
                ) : null}

                <AdminField label="Title">
                  <input className={adminInputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={form.mediaType === "video" ? "Auto-filled from video link" : undefined} />
                </AdminField>
                <AdminField label="Caption">
                  <textarea className={`${adminInputClass} min-h-[64px]`} value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} placeholder={form.mediaType === "video" ? "Auto-filled from video link" : "Optional"} />
                </AdminField>

                {form.mediaType === "video" ? (
                  <>
                    <AdminField label="Thumbnail URL (auto or manual)">
                      <input className={adminInputClass} value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
                    </AdminField>
                    <AdminField label="Upload custom thumbnail (optional)">
                      <input type="file" accept="image/*" disabled={busy} onChange={(e) => uploadField(e.target.files?.[0] ?? null, "imageUrl")} className="text-sm text-white/70" />
                    </AdminField>
                  </>
                ) : null}

                {form.mediaType === "image" ? (
                  <>
                    <AdminField label="Image URL">
                      <input className={adminInputClass} value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} />
                    </AdminField>
                    <AdminField label="Upload image">
                      <input type="file" accept="image/*" disabled={busy} onChange={(e) => uploadField(e.target.files?.[0] ?? null, "imageUrl")} className="text-sm text-white/70" />
                    </AdminField>
                  </>
                ) : null}

                {form.mediaType === "before-after" ? (
                  <>
                    <AdminField label="Before image URL">
                      <input className={adminInputClass} value={form.beforeImageUrl} onChange={(e) => setForm((f) => ({ ...f, beforeImageUrl: e.target.value }))} />
                    </AdminField>
                    <input type="file" accept="image/*" disabled={busy} onChange={(e) => uploadField(e.target.files?.[0] ?? null, "beforeImageUrl")} className="text-sm text-white/70" />
                    <AdminField label="After image URL">
                      <input className={adminInputClass} value={form.afterImageUrl} onChange={(e) => setForm((f) => ({ ...f, afterImageUrl: e.target.value }))} />
                    </AdminField>
                    <input type="file" accept="image/*" disabled={busy} onChange={(e) => uploadField(e.target.files?.[0] ?? null, "afterImageUrl")} className="text-sm text-white/70" />
                  </>
                ) : null}

                <AdminField label="Sort order">
                  <input type="number" className={adminInputClass} value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))} />
                </AdminField>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
                  Visible on gallery page
                </label>
                <button type="button" disabled={busy} onClick={saveItem} className="w-full rounded-full bg-gold py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50">
                  {busy ? "Saving…" : editing ? "Update item" : "Add item"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </AdminShell>
  );
}
