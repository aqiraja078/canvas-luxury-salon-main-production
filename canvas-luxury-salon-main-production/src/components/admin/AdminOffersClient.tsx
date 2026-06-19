"use client";

import { useRef, useState } from "react";
import type { CmsOffer } from "@/lib/cms-types";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const emptyForm = {
  title: "",
  description: "",
  discountLabel: "",
  originalPrice: "",
  offerPrice: "",
  imageUrl: "",
  includedServices: "",
  promoCode: "",
  startsAt: "",
  endsAt: "",
  featured: true,
  active: true,
  sortOrder: 0,
};

export function AdminOffersClient({ initial }: { initial: CmsOffer[] }) {
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState<CmsOffer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

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

  function openEdit(o: CmsOffer) {
    setEditing(o);
    setForm({
      title: o.title,
      description: o.description,
      discountLabel: o.discountLabel,
      originalPrice: o.originalPrice || "",
      offerPrice: o.offerPrice || "",
      imageUrl: o.imageUrl || "",
      includedServices: o.includedServices.join(", "),
      promoCode: o.promoCode || "",
      startsAt: o.startsAt?.slice(0, 10) || "",
      endsAt: o.endsAt?.slice(0, 10) || "",
      featured: o.featured,
      active: o.active,
      sortOrder: o.sortOrder,
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
        originalPrice: form.originalPrice || undefined,
        offerPrice: form.offerPrice || undefined,
        imageUrl: form.imageUrl || undefined,
        promoCode: form.promoCode || undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        includedServices: form.includedServices
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/offers", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (editing) {
        setRows((prev) => prev.map((r) => (r.id === data.id ? data : r)));
        closeForm();
        setMsg("Offer updated successfully.");
      } else {
        setRows((prev) => [...prev, data]);
        closeForm();
        setMsg("Offer added successfully.");
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this offer?")) return;
    const res = await fetch("/api/admin/offers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <AdminShell
      title="Offers"
      subtitle="Create seasonal deals and packages — they appear on /offers and the homepage banner."
    >
      <button
        type="button"
        onClick={openCreate}
        className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
      >
        + Add offer
      </button>

      <div className={`mt-8 grid gap-8 ${showForm ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          {!showForm && rows.length === 0 ? (
            <p className="col-span-full rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center text-sm text-white/50">
              No offers yet. Click <strong className="text-gold">+ Add offer</strong> to create
              one.
            </p>
          ) : null}
          {rows.map((o) => (
            <div
              key={o.id}
              className="overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-black"
            >
              {o.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.imageUrl} alt="" className="h-36 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <p className="text-2xl font-bold text-gold-light">{o.discountLabel}</p>
                <h3 className="mt-2 font-display text-xl text-white">{o.title}</h3>
                <p className="mt-2 text-sm text-white/65">{o.description}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(o)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(o.id)}
                    className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
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
            <h2 className="font-display text-xl">
              {editing ? "Edit offer" : "Add new offer"}
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
            Fill in the details below, then click Add offer to save.
          </p>
          <div className="mt-5 space-y-4">
            <AdminField label="Title">
              <input className={adminInputClass} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </AdminField>
            <AdminField label="Description">
              <textarea className={`${adminInputClass} min-h-[80px]`} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </AdminField>
            <AdminField label="Discount label">
              <input className={adminInputClass} value={form.discountLabel} onChange={(e) => setForm((f) => ({ ...f, discountLabel: e.target.value }))} placeholder="20% OFF" />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Original price">
                <input className={adminInputClass} value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} />
              </AdminField>
              <AdminField label="Offer price">
                <input className={adminInputClass} value={form.offerPrice} onChange={(e) => setForm((f) => ({ ...f, offerPrice: e.target.value }))} />
              </AdminField>
            </div>
            <AdminField label="Included services (comma separated)">
              <input className={adminInputClass} value={form.includedServices} onChange={(e) => setForm((f) => ({ ...f, includedServices: e.target.value }))} />
            </AdminField>
            <AdminField label="Promo code">
              <input className={adminInputClass} value={form.promoCode} onChange={(e) => setForm((f) => ({ ...f, promoCode: e.target.value }))} />
            </AdminField>
            <div className="grid grid-cols-2 gap-3">
              <AdminField label="Starts">
                <input type="date" className={adminInputClass} value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
              </AdminField>
              <AdminField label="Ends">
                <input type="date" className={adminInputClass} value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
              </AdminField>
            </div>
            <AdminField label="Banner image">
              <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0] ?? null)} className="text-sm text-white/70" />
            </AdminField>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              Active
            </label>
            {msg ? <p className="text-sm text-gold">{msg}</p> : null}
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
            >
              {busy ? "Saving…" : editing ? "Update offer" : "Add offer"}
            </button>
          </div>
        </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
