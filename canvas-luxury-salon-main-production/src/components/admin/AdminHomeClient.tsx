"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";
import type {
  CmsHomeCard,
  CmsHomeCategorySection,
  CmsHomePage,
  CmsHomeSectionMeta,
} from "@/lib/cms-types";
import { hasPermission } from "@/lib/cms-types";
import { normalizeHomePage } from "@/lib/home-page-normalize";

type Tab =
  | "hero"
  | "makeup"
  | "offers"
  | "hair"
  | "facial"
  | "nails"
  | "waxing"
  | "mehndi"
  | "why"
  | "team"
  | "steps"
  | "testimonials"
  | "cta";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "makeup", label: "Makeup" },
  { id: "offers", label: "Offers header" },
  { id: "hair", label: "Hair" },
  { id: "facial", label: "Facial" },
  { id: "nails", label: "Nails" },
  { id: "waxing", label: "Waxing" },
  { id: "mehndi", label: "Mehndi" },
  { id: "why", label: "Why us" },
  { id: "team", label: "Team header" },
  { id: "steps", label: "Steps" },
  { id: "testimonials", label: "Testimonials" },
  { id: "cta", label: "Final CTA" },
];

function newId() {
  return crypto.randomUUID();
}

function SectionMetaFields({
  value,
  onChange,
}: {
  value: CmsHomeSectionMeta;
  onChange: (next: CmsHomeSectionMeta) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Kicker">
        <input
          className={adminInputClass}
          value={value.kicker}
          onChange={(e) => onChange({ ...value, kicker: e.target.value })}
        />
      </AdminField>
      <AdminField label="Section index">
        <input
          className={adminInputClass}
          value={value.sectionIndex}
          onChange={(e) => onChange({ ...value, sectionIndex: e.target.value })}
        />
      </AdminField>
      <AdminField label="Title">
        <input
          className={adminInputClass}
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </AdminField>
      <AdminField label="Subtitle">
        <textarea
          className={`${adminInputClass} min-h-[72px]`}
          value={value.subtitle}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        />
      </AdminField>
    </div>
  );
}

function CategorySectionEditor({
  section,
  onChange,
  canManage,
}: {
  section: CmsHomeCategorySection;
  onChange: (next: CmsHomeCategorySection) => void;
  canManage: boolean;
}) {
  const [editingCard, setEditingCard] = useState<CmsHomeCard | null>(null);
  const [cardForm, setCardForm] = useState<CmsHomeCard | null>(null);
  const [busy, setBusy] = useState(false);

  function openCreateCard() {
    const card: CmsHomeCard = {
      id: newId(),
      name: "",
      price: "",
      image: "",
      active: true,
      sortOrder: section.cards.length,
    };
    setEditingCard(null);
    setCardForm(card);
  }

  function openEditCard(card: CmsHomeCard) {
    setEditingCard(card);
    setCardForm({ ...card });
  }

  function saveCard() {
    if (!cardForm || !cardForm.name.trim()) return;
    const cards = editingCard
      ? section.cards.map((c) => (c.id === editingCard.id ? cardForm : c))
      : [...section.cards, cardForm];
    onChange({ ...section, cards });
    setEditingCard(null);
    setCardForm(null);
  }

  function removeCard(id: string) {
    if (!confirm("Remove this card?")) return;
    onChange({ ...section, cards: section.cards.filter((c) => c.id !== id) });
  }

  async function onImage(file: File | null) {
    if (!file || !cardForm) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setCardForm({ ...cardForm, image: url });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionMetaFields
        value={section}
        onChange={(meta) => onChange({ ...section, ...meta })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="View all link">
          <input
            className={adminInputClass}
            value={section.viewAllHref}
            onChange={(e) => onChange({ ...section, viewAllHref: e.target.value })}
          />
        </AdminField>
        <AdminField label="View all label">
          <input
            className={adminInputClass}
            value={section.viewAllLabel}
            onChange={(e) => onChange({ ...section, viewAllLabel: e.target.value })}
          />
        </AdminField>
        <AdminField label="Style">
          <select
            className={adminInputClass}
            value={section.variant}
            onChange={(e) =>
              onChange({
                ...section,
                variant: e.target.value as CmsHomeCategorySection["variant"],
              })
            }
          >
            <option value="default">Default</option>
            <option value="alt">Alternate</option>
          </select>
        </AdminField>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg text-white">Service cards</h3>
        {canManage ? (
          <button
            type="button"
            onClick={openCreateCard}
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black"
          >
            + Add card
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {section.cards.map((card) => (
          <div
            key={card.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={card.image} alt="" className="h-28 w-full object-cover" />
            ) : (
              <div className="flex h-28 items-center justify-center bg-white/5 text-xs text-white/40">
                No image
              </div>
            )}
            <div className="p-4">
              <p className="font-medium text-white">{card.name || "Untitled"}</p>
              <p className="mt-1 text-sm text-gold">{card.price}</p>
              {!card.active ? (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                  Hidden
                </p>
              ) : null}
              {canManage ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditCard(card)}
                    className="rounded-lg border border-white/15 px-3 py-1 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {cardForm && canManage ? (
        <div className={`${adminCardClass} p-5`}>
          <h4 className="font-display text-lg">
            {editingCard ? "Edit card" : "New card"}
          </h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="Service name">
              <input
                className={adminInputClass}
                value={cardForm.name}
                onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Price">
              <input
                className={adminInputClass}
                value={cardForm.price}
                onChange={(e) => setCardForm({ ...cardForm, price: e.target.value })}
                placeholder="From Rs. 7,000"
              />
            </AdminField>
            <AdminField label="Image URL">
              <input
                className={adminInputClass}
                value={cardForm.image}
                onChange={(e) => setCardForm({ ...cardForm, image: e.target.value })}
                placeholder="https://... or upload below"
              />
            </AdminField>
            <AdminField label="Sort order">
              <input
                type="number"
                className={adminInputClass}
                value={cardForm.sortOrder}
                onChange={(e) =>
                  setCardForm({ ...cardForm, sortOrder: Number(e.target.value) || 0 })
                }
              />
            </AdminField>
            <AdminField label="Upload image">
              <input
                type="file"
                accept="image/*"
                disabled={busy}
                onChange={(e) => onImage(e.target.files?.[0] ?? null)}
                className="text-sm text-white/70"
              />
            </AdminField>
            <label className="flex items-center gap-2 self-end text-sm text-white/70">
              <input
                type="checkbox"
                checked={cardForm.active}
                onChange={(e) => setCardForm({ ...cardForm, active: e.target.checked })}
              />
              Visible on home page
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveCard}
              className="rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
            >
              Save card
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingCard(null);
                setCardForm(null);
              }}
              className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminHomeClient({
  initial,
  sessionUser,
}: {
  initial: CmsHomePage;
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [page, setPage] = useState(() => normalizeHomePage(initial));
  const [tab, setTab] = useState<Tab>("hero");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const canManage =
    sessionUser != null && hasPermission(sessionUser.role, "home.manage");

  async function onHeroImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setPage((p) => ({ ...p, hero: { ...p.hero, imageUrl: url } }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onHeroSecondaryImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setPage((p) => ({ ...p, hero: { ...p.hero, secondaryImageUrl: url } }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!canManage) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setPage(normalizeHomePage(data));
      setMsg("Home page saved — open / or refresh the homepage to see your changes.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Home page"
      subtitle="Edit hero, service cards, testimonials, and every section on the landing page."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="rounded-full border border-gold/35 px-4 py-2 text-xs uppercase tracking-wider text-gold"
        >
          Preview site ↗
        </Link>
        {canManage ? (
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save all changes"}
          </button>
        ) : (
          <p className="text-xs text-white/45">View only — owner can edit.</p>
        )}
      </div>

      {msg ? <p className="mt-4 text-sm text-gold">{msg}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-2 text-[11px] uppercase tracking-wider transition ${
              tab === t.id
                ? "bg-gold text-black"
                : "border border-white/15 text-white/70 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`${adminCardClass} mt-6 p-5 sm:p-6`}>
        {tab === "hero" ? (
          <div className="space-y-4">
            <AdminField label="Hero image URL">
              <input
                className={adminInputClass}
                value={page.hero.imageUrl}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({ ...p, hero: { ...p.hero, imageUrl: e.target.value } }))
                }
              />
            </AdminField>
            {canManage ? (
              <AdminField label="Upload hero image">
                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  onChange={(e) => onHeroImage(e.target.files?.[0] ?? null)}
                  className="text-sm text-white/70"
                />
              </AdminField>
            ) : null}
            <AdminField label="Secondary image URL (floating collage)">
              <input
                className={adminInputClass}
                value={page.hero.secondaryImageUrl ?? ""}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    hero: { ...p.hero, secondaryImageUrl: e.target.value },
                  }))
                }
              />
            </AdminField>
            {canManage ? (
              <AdminField label="Upload secondary image">
                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  onChange={(e) => onHeroSecondaryImage(e.target.files?.[0] ?? null)}
                  className="text-sm text-white/70"
                />
              </AdminField>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Badge text">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.badgeText}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, hero: { ...p.hero, badgeText: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Kicker">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.kicker}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, hero: { ...p.hero, kicker: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Title line 1">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.titleLine1}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, hero: { ...p.hero, titleLine1: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Title line 2 (accent)">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.titleLine2}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, hero: { ...p.hero, titleLine2: e.target.value } }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Script line (gold cursive under title)">
              <input
                className={adminInputClass}
                disabled={!canManage}
                value={page.hero.scriptLine ?? ""}
                onChange={(e) =>
                  setPage((p) => ({ ...p, hero: { ...p.hero, scriptLine: e.target.value } }))
                }
              />
            </AdminField>
            <AdminField label="Description">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                disabled={!canManage}
                value={page.hero.description}
                onChange={(e) =>
                  setPage((p) => ({ ...p, hero: { ...p.hero, description: e.target.value } }))
                }
              />
            </AdminField>
            <AdminField label="Footnote">
              <input
                className={adminInputClass}
                disabled={!canManage}
                value={page.hero.footnote}
                onChange={(e) =>
                  setPage((p) => ({ ...p, hero: { ...p.hero, footnote: e.target.value } }))
                }
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Primary button">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.primaryBtnLabel}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, primaryBtnLabel: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Primary link">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.primaryBtnHref}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, primaryBtnHref: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Secondary button">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.secondaryBtnLabel}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, secondaryBtnLabel: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Secondary link (WhatsApp uses wa.me if blank)">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.secondaryBtnHref}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, secondaryBtnHref: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Portfolio button label">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.portfolioBtnLabel ?? ""}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, portfolioBtnLabel: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Portfolio button link">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.hero.portfolioBtnHref ?? ""}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, portfolioBtnHref: e.target.value },
                    }))
                  }
                />
              </AdminField>
            </div>
            <p className="text-xs text-white/50">
              Trust stats: row 1 = Google floating card. Rows 2+ appear in the bottom
              stats bar on the homepage.
            </p>
            <h3 className="pt-2 font-display text-lg">Trust stats</h3>
            {page.hero.trustItems.map((item, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-3">
                <p className="text-[10px] uppercase tracking-wider text-gold/70 sm:col-span-3">
                  Stat {idx + 1}
                  {idx === 0 ? " · Google floating card" : " · Bottom bar"}
                </p>
                <AdminField label="Value">
                  <input
                    className={adminInputClass}
                    disabled={!canManage}
                    value={item.value}
                    onChange={(e) => {
                      const trustItems = [...page.hero.trustItems];
                      trustItems[idx] = { ...trustItems[idx], value: e.target.value };
                      setPage((p) => ({ ...p, hero: { ...p.hero, trustItems } }));
                    }}
                  />
                </AdminField>
                <AdminField label="Label">
                  <input
                    className={adminInputClass}
                    disabled={!canManage}
                    value={item.label}
                    onChange={(e) => {
                      const trustItems = [...page.hero.trustItems];
                      trustItems[idx] = { ...trustItems[idx], label: e.target.value };
                      setPage((p) => ({ ...p, hero: { ...p.hero, trustItems } }));
                    }}
                  />
                </AdminField>
                <AdminField label="Hint">
                  <input
                    className={adminInputClass}
                    disabled={!canManage}
                    value={item.hint}
                    onChange={(e) => {
                      const trustItems = [...page.hero.trustItems];
                      trustItems[idx] = { ...trustItems[idx], hint: e.target.value };
                      setPage((p) => ({ ...p, hero: { ...p.hero, trustItems } }));
                    }}
                  />
                </AdminField>
              </div>
            ))}
            {canManage ? (
              <button
                type="button"
                disabled={busy}
                className="rounded-full border border-gold/40 px-4 py-2 text-xs uppercase tracking-wider text-gold"
                onClick={() =>
                  setPage((p) => ({
                    ...p,
                    hero: {
                      ...p.hero,
                      trustItems: [
                        ...p.hero.trustItems,
                        { value: "", label: "", hint: "" },
                      ],
                    },
                  }))
                }
              >
                + Add stat row
              </button>
            ) : null}
          </div>
        ) : null}

        {tab === "makeup" ? (
          <CategorySectionEditor
            section={page.makeup}
            canManage={canManage}
            onChange={(makeup) => setPage((p) => ({ ...p, makeup }))}
          />
        ) : null}

        {tab === "hair" ? (
          <CategorySectionEditor
            section={page.hair}
            canManage={canManage}
            onChange={(hair) => setPage((p) => ({ ...p, hair }))}
          />
        ) : null}

        {tab === "facial" ? (
          <CategorySectionEditor
            section={page.facial}
            canManage={canManage}
            onChange={(facial) => setPage((p) => ({ ...p, facial }))}
          />
        ) : null}

        {tab === "nails" ? (
          <CategorySectionEditor
            section={page.nails}
            canManage={canManage}
            onChange={(nails) => setPage((p) => ({ ...p, nails }))}
          />
        ) : null}

        {tab === "waxing" ? (
          <CategorySectionEditor
            section={page.waxing}
            canManage={canManage}
            onChange={(waxing) => setPage((p) => ({ ...p, waxing }))}
          />
        ) : null}

        {tab === "mehndi" ? (
          <CategorySectionEditor
            section={page.mehndi}
            canManage={canManage}
            onChange={(mehndi) => setPage((p) => ({ ...p, mehndi }))}
          />
        ) : null}

        {tab === "offers" ? (
          <div className="space-y-4">
            <SectionMetaFields
              value={page.offers}
              onChange={(offers) => setPage((p) => ({ ...p, offers }))}
            />
            <p className="text-sm text-white/55">
              Offer cards are managed in{" "}
              <Link href="/admin/offers" className="text-gold underline">
                Offers
              </Link>
              . Active offers appear automatically in the home slider.
            </p>
          </div>
        ) : null}

        {tab === "team" ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/60">
            <p>
              The <strong className="text-gold">Our Team</strong> section is fully
              managed in one place — headings, stats, limits, and artist profiles.
            </p>
            <Link
              href="/admin/team"
              className="mt-4 inline-flex rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
            >
              Open Team admin
            </Link>
          </div>
        ) : null}

        {tab === "why" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.why}
              onChange={(meta) => setPage((p) => ({ ...p, why: { ...p.why, ...meta } }))}
            />
            {page.why.cards.map((card, idx) => (
              <div key={card.id} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    Card {idx + 1}
                  </p>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => ({
                          ...p,
                          why: {
                            ...p.why,
                            cards: p.why.cards.filter((c) => c.id !== card.id),
                          },
                        }))
                      }
                      className="text-xs text-rose-300"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AdminField label="Title">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={card.title}
                      onChange={(e) => {
                        const cards = page.why.cards.map((c) =>
                          c.id === card.id ? { ...c, title: e.target.value } : c
                        );
                        setPage((p) => ({ ...p, why: { ...p.why, cards } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Description">
                    <textarea
                      className={`${adminInputClass} min-h-[72px]`}
                      disabled={!canManage}
                      value={card.desc}
                      onChange={(e) => {
                        const cards = page.why.cards.map((c) =>
                          c.id === card.id ? { ...c, desc: e.target.value } : c
                        );
                        setPage((p) => ({ ...p, why: { ...p.why, cards } }));
                      }}
                    />
                  </AdminField>
                </div>
              </div>
            ))}
            {canManage ? (
              <button
                type="button"
                onClick={() =>
                  setPage((p) => ({
                    ...p,
                    why: {
                      ...p.why,
                      cards: [
                        ...p.why.cards,
                        { id: newId(), title: "New reason", desc: "" },
                      ],
                    },
                  }))
                }
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider"
              >
                + Add card
              </button>
            ) : null}
          </div>
        ) : null}

        {tab === "steps" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.steps}
              onChange={(meta) => setPage((p) => ({ ...p, steps: { ...p.steps, ...meta } }))}
            />
            {page.steps.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <AdminField label="Number">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={item.number}
                      onChange={(e) => {
                        const items = page.steps.items.map((s) =>
                          s.id === item.id ? { ...s, number: e.target.value } : s
                        );
                        setPage((p) => ({ ...p, steps: { ...p.steps, items } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Title">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={item.title}
                      onChange={(e) => {
                        const items = page.steps.items.map((s) =>
                          s.id === item.id ? { ...s, title: e.target.value } : s
                        );
                        setPage((p) => ({ ...p, steps: { ...p.steps, items } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Description">
                    <textarea
                      className={`${adminInputClass} min-h-[72px] sm:col-span-2`}
                      disabled={!canManage}
                      value={item.desc}
                      onChange={(e) => {
                        const items = page.steps.items.map((s) =>
                          s.id === item.id ? { ...s, desc: e.target.value } : s
                        );
                        setPage((p) => ({ ...p, steps: { ...p.steps, items } }));
                      }}
                    />
                  </AdminField>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "testimonials" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.testimonials}
              onChange={(meta) =>
                setPage((p) => ({ ...p, testimonials: { ...p.testimonials, ...meta } }))
              }
            />
            {page.testimonials.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-white/45">
                    {item.name || "Testimonial"}
                  </p>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => ({
                          ...p,
                          testimonials: {
                            ...p.testimonials,
                            items: p.testimonials.items.filter((t) => t.id !== item.id),
                          },
                        }))
                      }
                      className="text-xs text-rose-300"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <AdminField label="Quote">
                  <textarea
                    className={`${adminInputClass} min-h-[96px]`}
                    disabled={!canManage}
                    value={item.quote}
                    onChange={(e) => {
                      const items = page.testimonials.items.map((t) =>
                        t.id === item.id ? { ...t, quote: e.target.value } : t
                      );
                      setPage((p) => ({ ...p, testimonials: { ...p.testimonials, items } }));
                    }}
                  />
                </AdminField>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <AdminField label="Client name">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={item.name}
                      onChange={(e) => {
                        const items = page.testimonials.items.map((t) =>
                          t.id === item.id ? { ...t, name: e.target.value } : t
                        );
                        setPage((p) => ({ ...p, testimonials: { ...p.testimonials, items } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Role / service">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={item.role}
                      onChange={(e) => {
                        const items = page.testimonials.items.map((t) =>
                          t.id === item.id ? { ...t, role: e.target.value } : t
                        );
                        setPage((p) => ({ ...p, testimonials: { ...p.testimonials, items } }));
                      }}
                    />
                  </AdminField>
                </div>
              </div>
            ))}
            {canManage ? (
              <button
                type="button"
                onClick={() =>
                  setPage((p) => ({
                    ...p,
                    testimonials: {
                      ...p.testimonials,
                      items: [
                        ...p.testimonials.items,
                        { id: newId(), quote: "", name: "", role: "" },
                      ],
                    },
                  }))
                }
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-wider"
              >
                + Add testimonial
              </button>
            ) : null}
          </div>
        ) : null}

        {tab === "cta" ? (
          <div className="space-y-4">
            <AdminField label="Title">
              <input
                className={adminInputClass}
                disabled={!canManage}
                value={page.cta.title}
                onChange={(e) =>
                  setPage((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))
                }
              />
            </AdminField>
            <AdminField label="Subtitle">
              <textarea
                className={`${adminInputClass} min-h-[72px]`}
                disabled={!canManage}
                value={page.cta.subtitle}
                onChange={(e) =>
                  setPage((p) => ({ ...p, cta: { ...p.cta, subtitle: e.target.value } }))
                }
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Button label">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.cta.buttonLabel}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, cta: { ...p.cta, buttonLabel: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Button link">
                <input
                  className={adminInputClass}
                  disabled={!canManage}
                  value={page.cta.buttonHref}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, cta: { ...p.cta, buttonHref: e.target.value } }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Trust pills (one per line)">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                disabled={!canManage}
                value={page.cta.trustPoints.join("\n")}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    cta: {
                      ...p.cta,
                      trustPoints: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
            </AdminField>
            <h3 className="font-display text-lg">Mini proof cards</h3>
            {page.cta.proofCards.map((proof) => (
              <div key={proof.id} className="rounded-xl border border-white/10 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <AdminField label="Quote">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={proof.line}
                      onChange={(e) => {
                        const proofCards = page.cta.proofCards.map((c) =>
                          c.id === proof.id ? { ...c, line: e.target.value } : c
                        );
                        setPage((p) => ({ ...p, cta: { ...p.cta, proofCards } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Name">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={proof.name}
                      onChange={(e) => {
                        const proofCards = page.cta.proofCards.map((c) =>
                          c.id === proof.id ? { ...c, name: e.target.value } : c
                        );
                        setPage((p) => ({ ...p, cta: { ...p.cta, proofCards } }));
                      }}
                    />
                  </AdminField>
                  <AdminField label="Event">
                    <input
                      className={adminInputClass}
                      disabled={!canManage}
                      value={proof.event}
                      onChange={(e) => {
                        const proofCards = page.cta.proofCards.map((c) =>
                          c.id === proof.id ? { ...c, event: e.target.value } : c
                        );
                        setPage((p) => ({ ...p, cta: { ...p.cta, proofCards } }));
                      }}
                    />
                  </AdminField>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
