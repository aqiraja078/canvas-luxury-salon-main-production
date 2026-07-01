"use client";

import { useMemo, useRef, useState } from "react";
import type { CmsBlogPage, CmsBlogPost } from "@/lib/cms-types";
import { slugifyBlogTitle } from "@/lib/blog-utils";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";
import { BlogImage } from "@/components/blog/BlogImage";

const BLOG_CATEGORIES = [
  "Bridal",
  "Makeup",
  "Hair",
  "Skincare",
  "Mehndi",
  "Tips",
  "News",
] as const;

const emptyPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Huma Beauty Team",
  category: "Tips",
  tags: "",
  readTimeMinutes: "4",
  publishedAt: new Date().toISOString().slice(0, 10),
  featured: false,
  active: true,
  sortOrder: 0,
};

export function AdminBlogClient({
  initialPosts,
  initialPage,
  sessionUser,
}: {
  initialPosts: CmsBlogPost[];
  initialPage: CmsBlogPage;
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(initialPage);
  const [tab, setTab] = useState<"posts" | "page">("posts");
  const [editing, setEditing] = useState<CmsBlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPostForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const slugPreview = useMemo(() => {
    const base = form.slug.trim() || form.title.trim();
    return base ? slugifyBlogTitle(base) : "";
  }, [form.slug, form.title]);

  function scrollToForm() {
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyPostForm,
      sortOrder: posts.reduce((max, p) => Math.max(max, p.sortOrder), -1) + 1,
    });
    setMsg("");
    setShowForm(true);
    setTab("posts");
    scrollToForm();
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(emptyPostForm);
    setMsg("");
  }

  function openEdit(post: CmsBlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      author: post.author,
      category: post.category,
      tags: post.tags.join(", "),
      readTimeMinutes: String(post.readTimeMinutes),
      publishedAt: post.publishedAt.slice(0, 10),
      featured: post.featured,
      active: post.active,
      sortOrder: post.sortOrder,
    });
    setMsg("");
    setShowForm(true);
    setTab("posts");
    scrollToForm();
  }

  async function onCoverImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setForm((f) => ({ ...f, coverImage: url }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePage() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setPage(data.page);
      setMsg("Blog page settings saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePost() {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setMsg("Title, excerpt, and content are required.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        coverImage: form.coverImage.trim() || undefined,
        author: form.author.trim(),
        category: form.category.trim(),
        tags: form.tags,
        readTimeMinutes: Number(form.readTimeMinutes) || 3,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : new Date().toISOString(),
        featured: form.featured,
        active: form.active,
        sortOrder: Number(form.sortOrder) || 0,
      };
      const res = await fetch("/api/admin/blog", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) {
        setPosts((prev) =>
          prev
            .map((p) => (p.id === data.id ? data : p))
            .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
        );
      } else {
        setPosts((prev) =>
          [data, ...prev].sort(
            (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
          )
        );
      }
      closeForm();
      setMsg("Blog post saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this blog post?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editing?.id === id) closeForm();
      setMsg("Post deleted.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Blog"
      subtitle="Write beauty tips, bridal guides, and news. Posts appear on /blog with full article pages."
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            tab === "posts" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          Posts ({posts.length})
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
        {tab === "posts" ? (
          <button
            type="button"
            onClick={openCreate}
            className="ml-auto rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
          >
            + New post
          </button>
        ) : null}
      </div>

      {tab === "page" ? (
        <div className={`${adminCardClass} mt-8 space-y-5 p-5`}>
          <h2 className="font-display text-xl text-white">Blog listing page</h2>
          <AdminField label="Kicker">
            <input
              className={adminInputClass}
              value={page.kicker}
              onChange={(e) => setPage((p) => ({ ...p, kicker: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Title">
            <input
              className={adminInputClass}
              value={page.title}
              onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Subtitle">
            <textarea
              className={`${adminInputClass} min-h-[88px]`}
              value={page.subtitle}
              onChange={(e) => setPage((p) => ({ ...p, subtitle: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Empty message (no posts)">
            <textarea
              className={`${adminInputClass} min-h-[72px]`}
              value={page.emptyMessage}
              onChange={(e) =>
                setPage((p) => ({ ...p, emptyMessage: e.target.value }))
              }
            />
          </AdminField>
          {msg ? <p className="text-sm text-gold">{msg}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={savePage}
            className="rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save page settings"}
          </button>
        </div>
      ) : (
        <div
          className={`mt-8 grid gap-8 ${showForm ? "xl:grid-cols-[1fr_400px]" : ""}`}
        >
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-sm text-white/50">
                No posts yet. Click <strong className="text-gold">+ New post</strong>.
              </p>
            ) : null}
            {posts.map((post) => (
              <div
                key={post.id}
                className={`${adminCardClass} flex gap-4 overflow-hidden p-4`}
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt=""
                    className="h-24 w-32 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-xs text-gold">
                    No image
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-wider text-gold/80">
                    {post.category}
                    {post.featured ? " · Featured" : ""}
                    {!post.active ? " · Hidden" : ""}
                  </p>
                  <h3 className="font-display text-lg text-white">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/55">
                    {post.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-white/40">/blog/{post.slug}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(post.id)}
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
                  {editing ? "Edit post" : "New post"}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <AdminField label="Title">
                  <input
                    className={adminInputClass}
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="URL slug (optional)">
                  <input
                    className={adminInputClass}
                    value={form.slug}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, slug: e.target.value }))
                    }
                    placeholder={slugPreview || "auto-from-title"}
                  />
                  {slugPreview ? (
                    <p className="mt-1.5 text-[11px] text-white/40">
                      Live URL: /blog/{slugPreview}
                    </p>
                  ) : null}
                </AdminField>
                <AdminField label="Excerpt (card summary)">
                  <textarea
                    className={`${adminInputClass} min-h-[72px]`}
                    value={form.excerpt}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, excerpt: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="Article content">
                  <textarea
                    className={`${adminInputClass} min-h-[200px] font-mono text-[13px]`}
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    placeholder="Paragraphs separated by a blank line. Use ## for bold headings, **text** for bold words, and paste an image URL on its own line."
                  />
                </AdminField>
                <div className="grid grid-cols-2 gap-3">
                  <AdminField label="Category">
                    <select
                      className={adminInputClass}
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {BLOG_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                  <AdminField label="Author">
                    <input
                      className={adminInputClass}
                      value={form.author}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, author: e.target.value }))
                      }
                    />
                  </AdminField>
                </div>
                <AdminField label="Tags (comma separated)">
                  <input
                    className={adminInputClass}
                    value={form.tags}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tags: e.target.value }))
                    }
                    placeholder="Bridal, Makeup, Tips"
                  />
                </AdminField>
                <div className="grid grid-cols-3 gap-3">
                  <AdminField label="Read time (min)">
                    <input
                      type="number"
                      min={1}
                      className={adminInputClass}
                      value={form.readTimeMinutes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, readTimeMinutes: e.target.value }))
                      }
                    />
                  </AdminField>
                  <AdminField label="Publish date">
                    <input
                      type="date"
                      className={adminInputClass}
                      value={form.publishedAt}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, publishedAt: e.target.value }))
                      }
                    />
                  </AdminField>
                  <AdminField label="Sort order">
                    <input
                      type="number"
                      className={adminInputClass}
                      value={form.sortOrder}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          sortOrder: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </AdminField>
                </div>
                <AdminField label="Cover image URL">
                  <input
                    className={adminInputClass}
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImage: e.target.value }))
                    }
                  />
                </AdminField>
                <AdminField label="Upload cover">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={(e) => onCoverImage(e.target.files?.[0] ?? null)}
                    className="text-sm text-white/70"
                  />
                  {form.coverImage ? (
                    <BlogImage
                      src={form.coverImage}
                      alt="Cover preview"
                      className="mt-3 overflow-hidden rounded-xl border border-white/10"
                    />
                  ) : null}
                </AdminField>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, featured: e.target.checked }))
                    }
                  />
                  Featured (hero on blog page)
                </label>
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, active: e.target.checked }))
                    }
                  />
                  Published on website
                </label>
                {msg ? <p className="text-sm text-gold">{msg}</p> : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={savePost}
                  className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
                >
                  {busy ? "Saving…" : editing ? "Update post" : "Publish post"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </AdminShell>
  );
}
