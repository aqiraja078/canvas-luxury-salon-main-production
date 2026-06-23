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
  CmsAboutCity,
  CmsAboutCtaButton,
  CmsAboutKitItem,
  CmsAboutPage,
  CmsAboutPillar,
  CmsAboutStat,
  CmsAboutTimelineItem,
  CmsHomeSectionMeta,
} from "@/lib/cms-types";
import { hasPermission } from "@/lib/cms-types";
import { normalizeAboutPage } from "@/lib/about-page-normalize";

type Tab =
  | "hero"
  | "story"
  | "team"
  | "pillars"
  | "stats"
  | "coverage"
  | "homeKit"
  | "cta";

const TABS: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "story", label: "Who we are" },
  { id: "team", label: "Team header" },
  { id: "pillars", label: "Values" },
  { id: "stats", label: "Stats" },
  { id: "coverage", label: "Coverage" },
  { id: "homeKit", label: "Home kit" },
  { id: "cta", label: "CTA" },
];

function newId() {
  return crypto.randomUUID();
}

function SectionMetaFields({
  value,
  onChange,
  disabled,
}: {
  value: CmsHomeSectionMeta;
  onChange: (next: CmsHomeSectionMeta) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdminField label="Kicker">
        <input
          className={adminInputClass}
          value={value.kicker}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, kicker: e.target.value })}
        />
      </AdminField>
      <AdminField label="Section index">
        <input
          className={adminInputClass}
          value={value.sectionIndex}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, sectionIndex: e.target.value })}
        />
      </AdminField>
      <AdminField label="Title">
        <input
          className={adminInputClass}
          value={value.title}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
        />
      </AdminField>
      <AdminField label="Subtitle">
        <textarea
          className={`${adminInputClass} min-h-[72px]`}
          value={value.subtitle}
          disabled={disabled}
          onChange={(e) => onChange({ ...value, subtitle: e.target.value })}
        />
      </AdminField>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  canManage,
  busy,
  onBusy,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  canManage: boolean;
  busy: boolean;
  onBusy: (v: boolean) => void;
}) {
  async function onUpload(file: File | null) {
    if (!file) return;
    onBusy(true);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
    } finally {
      onBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <AdminField label={`${label} URL`}>
        <input
          className={adminInputClass}
          value={value}
          disabled={!canManage}
          onChange={(e) => onChange(e.target.value)}
        />
      </AdminField>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-36 w-full max-w-md rounded-xl object-cover" />
      ) : null}
      {canManage ? (
        <AdminField label={`Upload ${label.toLowerCase()}`}>
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
            className="text-sm text-white/70"
          />
        </AdminField>
      ) : null}
    </div>
  );
}

export function AdminAboutClient({
  initial,
  sessionUser,
}: {
  initial: CmsAboutPage;
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [page, setPage] = useState(() => normalizeAboutPage(initial));
  const [tab, setTab] = useState<Tab>("hero");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const canManage =
    sessionUser != null && hasPermission(sessionUser.role, "about.manage");

  async function save() {
    if (!canManage) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setPage(normalizeAboutPage(data));
      setMsg("About page saved. Refresh the public site to see changes.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function updateTimeline(item: CmsAboutTimelineItem) {
    setPage((p) => ({
      ...p,
      story: {
        ...p.story,
        timeline: p.story.timeline.map((t) => (t.id === item.id ? item : t)),
      },
    }));
  }

  function addTimeline() {
    const item: CmsAboutTimelineItem = {
      id: newId(),
      year: "",
      title: "",
      text: "",
    };
    setPage((p) => ({
      ...p,
      story: { ...p.story, timeline: [...p.story.timeline, item] },
    }));
  }

  function removeTimeline(id: string) {
    setPage((p) => ({
      ...p,
      story: {
        ...p.story,
        timeline: p.story.timeline.filter((t) => t.id !== id),
      },
    }));
  }

  function updatePillar(item: CmsAboutPillar) {
    setPage((p) => ({
      ...p,
      pillars: {
        ...p.pillars,
        items: p.pillars.items.map((x) => (x.id === item.id ? item : x)),
      },
    }));
  }

  function addPillar() {
    const item: CmsAboutPillar = {
      id: newId(),
      num: "",
      title: "",
      text: "",
    };
    setPage((p) => ({
      ...p,
      pillars: { ...p.pillars, items: [...p.pillars.items, item] },
    }));
  }

  function removePillar(id: string) {
    setPage((p) => ({
      ...p,
      pillars: {
        ...p.pillars,
        items: p.pillars.items.filter((x) => x.id !== id),
      },
    }));
  }

  function updateStat(item: CmsAboutStat) {
    setPage((p) => ({
      ...p,
      stats: p.stats.map((s) => (s.id === item.id ? item : s)),
    }));
  }

  function addStat() {
    setPage((p) => ({
      ...p,
      stats: [...p.stats, { id: newId(), value: "", label: "" }],
    }));
  }

  function removeStat(id: string) {
    setPage((p) => ({
      ...p,
      stats: p.stats.filter((s) => s.id !== id),
    }));
  }

  function updateCoverageCity(item: CmsAboutCity) {
    setPage((p) => ({
      ...p,
      coverage: {
        ...p.coverage,
        cities: p.coverage.cities.map((c) => (c.id === item.id ? item : c)),
      },
    }));
  }

  function addCoverageCity() {
    setPage((p) => ({
      ...p,
      coverage: {
        ...p.coverage,
        cities: [...p.coverage.cities, { id: newId(), name: "", note: "" }],
      },
    }));
  }

  function removeCoverageCity(id: string) {
    setPage((p) => ({
      ...p,
      coverage: {
        ...p.coverage,
        cities: p.coverage.cities.filter((c) => c.id !== id),
      },
    }));
  }

  function updateKitItem(item: CmsAboutKitItem) {
    setPage((p) => ({
      ...p,
      homeKit: {
        ...p.homeKit,
        items: p.homeKit.items.map((x) => (x.id === item.id ? item : x)),
      },
    }));
  }

  function addKitItem() {
    setPage((p) => ({
      ...p,
      homeKit: {
        ...p.homeKit,
        items: [...p.homeKit.items, { id: newId(), text: "" }],
      },
    }));
  }

  function removeKitItem(id: string) {
    setPage((p) => ({
      ...p,
      homeKit: {
        ...p.homeKit,
        items: p.homeKit.items.filter((x) => x.id !== id),
      },
    }));
  }

  function updateCtaButton(item: CmsAboutCtaButton) {
    setPage((p) => ({
      ...p,
      cta: {
        ...p.cta,
        buttons: p.cta.buttons.map((b) => (b.id === item.id ? item : b)),
      },
    }));
  }

  function addCtaButton() {
    setPage((p) => ({
      ...p,
      cta: {
        ...p.cta,
        buttons: [
          ...p.cta.buttons,
          { id: newId(), label: "", href: "", variant: "secondary" },
        ],
      },
    }));
  }

  function removeCtaButton(id: string) {
    setPage((p) => ({
      ...p,
      cta: {
        ...p.cta,
        buttons: p.cta.buttons.filter((b) => b.id !== id),
      },
    }));
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="About page"
      subtitle="Edit hero, story, values, images, and every section on the about page. Team member photos are managed under Team."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/about"
          target="_blank"
          className="rounded-full border border-gold/35 px-4 py-2 text-xs uppercase tracking-wider text-gold"
        >
          Preview about page ↗
        </Link>
        <Link
          href="/admin/team"
          className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-white/70"
        >
          Edit team members
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
            <ImageField
              label="Hero image"
              value={page.hero.imageUrl}
              onChange={(url) => setPage((p) => ({ ...p, hero: { ...p.hero, imageUrl: url } }))}
              canManage={canManage}
              busy={busy}
              onBusy={setBusy}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Kicker">
                <input
                  className={adminInputClass}
                  value={page.hero.kicker}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, hero: { ...p.hero, kicker: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Title (before accent)">
                <input
                  className={adminInputClass}
                  value={page.hero.titleBefore}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, titleBefore: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Title accent (gold)">
                <input
                  className={adminInputClass}
                  value={page.hero.titleAccent}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      hero: { ...p.hero, titleAccent: e.target.value },
                    }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Lead paragraph">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                value={page.hero.lead}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({ ...p, hero: { ...p.hero, lead: e.target.value } }))
                }
              />
            </AdminField>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg text-white">City pills</h3>
                {canManage ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          cities: [...p.hero.cities, { id: newId(), name: "" }],
                        },
                      }))
                    }
                    className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                  >
                    + Add city
                  </button>
                ) : null}
              </div>
              <div className="space-y-2">
                {page.hero.cities.map((city) => (
                  <div key={city.id} className="flex gap-2">
                    <input
                      className={adminInputClass}
                      value={city.name}
                      disabled={!canManage}
                      onChange={(e) =>
                        setPage((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            cities: p.hero.cities.map((c) =>
                              c.id === city.id ? { ...c, name: e.target.value } : c
                            ),
                          },
                        }))
                      }
                    />
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() =>
                          setPage((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              cities: p.hero.cities.filter((c) => c.id !== city.id),
                            },
                          }))
                        }
                        className="shrink-0 rounded-lg border border-rose-400/30 px-3 text-xs text-rose-200"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {tab === "story" ? (
          <div className="space-y-6">
            <ImageField
              label="Story image"
              value={page.story.imageUrl}
              onChange={(url) =>
                setPage((p) => ({ ...p, story: { ...p.story, imageUrl: url } }))
              }
              canManage={canManage}
              busy={busy}
              onBusy={setBusy}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Quote line 1">
                <input
                  className={adminInputClass}
                  value={page.story.quoteLine1}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      story: { ...p.story, quoteLine1: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Quote line 2">
                <input
                  className={adminInputClass}
                  value={page.story.quoteLine2}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      story: { ...p.story, quoteLine2: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Kicker">
                <input
                  className={adminInputClass}
                  value={page.story.kicker}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, story: { ...p.story, kicker: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Section index">
                <input
                  className={adminInputClass}
                  value={page.story.sectionIndex}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      story: { ...p.story, sectionIndex: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Title (before accent)">
                <input
                  className={adminInputClass}
                  value={page.story.titleBefore}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      story: { ...p.story, titleBefore: e.target.value },
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Title accent (gold)">
                <input
                  className={adminInputClass}
                  value={page.story.titleAccent}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      story: { ...p.story, titleAccent: e.target.value },
                    }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Subtitle">
              <textarea
                className={`${adminInputClass} min-h-[72px]`}
                value={page.story.subtitle}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({ ...p, story: { ...p.story, subtitle: e.target.value } }))
                }
              />
            </AdminField>
            <AdminField label="Paragraph 1">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                value={page.story.paragraph1}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    story: { ...p.story, paragraph1: e.target.value },
                  }))
                }
              />
            </AdminField>
            <AdminField label="Paragraph 2">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                value={page.story.paragraph2}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    story: { ...p.story, paragraph2: e.target.value },
                  }))
                }
              />
            </AdminField>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg text-white">Timeline</h3>
                {canManage ? (
                  <button
                    type="button"
                    onClick={addTimeline}
                    className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                  >
                    + Add item
                  </button>
                ) : null}
              </div>
              <div className="space-y-4">
                {page.story.timeline.map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/10 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <AdminField label="Year / label">
                        <input
                          className={adminInputClass}
                          value={item.year}
                          disabled={!canManage}
                          onChange={(e) => updateTimeline({ ...item, year: e.target.value })}
                        />
                      </AdminField>
                      <AdminField label="Title">
                        <input
                          className={adminInputClass}
                          value={item.title}
                          disabled={!canManage}
                          onChange={(e) => updateTimeline({ ...item, title: e.target.value })}
                        />
                      </AdminField>
                    </div>
                    <AdminField label="Text">
                      <textarea
                        className={`${adminInputClass} mt-3 min-h-[72px]`}
                        value={item.text}
                        disabled={!canManage}
                        onChange={(e) => updateTimeline({ ...item, text: e.target.value })}
                      />
                    </AdminField>
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() => removeTimeline(item.id)}
                        className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
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

        {tab === "pillars" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.pillars}
              disabled={!canManage}
              onChange={(meta) =>
                setPage((p) => ({ ...p, pillars: { ...p.pillars, ...meta } }))
              }
            />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Pillar cards</h3>
              {canManage ? (
                <button
                  type="button"
                  onClick={addPillar}
                  className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                >
                  + Add pillar
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              {page.pillars.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <AdminField label="Number">
                      <input
                        className={adminInputClass}
                        value={item.num}
                        disabled={!canManage}
                        onChange={(e) => updatePillar({ ...item, num: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Title">
                      <input
                        className={adminInputClass}
                        value={item.title}
                        disabled={!canManage}
                        onChange={(e) => updatePillar({ ...item, title: e.target.value })}
                      />
                    </AdminField>
                  </div>
                  <AdminField label="Text">
                    <textarea
                      className={`${adminInputClass} mt-3 min-h-[72px]`}
                      value={item.text}
                      disabled={!canManage}
                      onChange={(e) => updatePillar({ ...item, text: e.target.value })}
                    />
                  </AdminField>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removePillar(item.id)}
                      className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "stats" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Stats band</h3>
              {canManage ? (
                <button
                  type="button"
                  onClick={addStat}
                  className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                >
                  + Add stat
                </button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.stats.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-4">
                  <AdminField label="Value">
                    <input
                      className={adminInputClass}
                      value={item.value}
                      disabled={!canManage}
                      onChange={(e) => updateStat({ ...item, value: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Label">
                    <input
                      className={`${adminInputClass} mt-3`}
                      value={item.label}
                      disabled={!canManage}
                      onChange={(e) => updateStat({ ...item, label: e.target.value })}
                    />
                  </AdminField>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removeStat(item.id)}
                      className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "coverage" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.coverage}
              disabled={!canManage}
              onChange={(meta) =>
                setPage((p) => ({ ...p, coverage: { ...p.coverage, ...meta } }))
              }
            />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">City cards</h3>
              {canManage ? (
                <button
                  type="button"
                  onClick={addCoverageCity}
                  className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                >
                  + Add city
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              {page.coverage.cities.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-4">
                  <AdminField label="City name">
                    <input
                      className={adminInputClass}
                      value={item.name}
                      disabled={!canManage}
                      onChange={(e) => updateCoverageCity({ ...item, name: e.target.value })}
                    />
                  </AdminField>
                  <AdminField label="Note">
                    <textarea
                      className={`${adminInputClass} mt-3 min-h-[72px]`}
                      value={item.note}
                      disabled={!canManage}
                      onChange={(e) => updateCoverageCity({ ...item, note: e.target.value })}
                    />
                  </AdminField>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removeCoverageCity(item.id)}
                      className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "homeKit" ? (
          <div className="space-y-6">
            <SectionMetaFields
              value={page.homeKit}
              disabled={!canManage}
              onChange={(meta) =>
                setPage((p) => ({ ...p, homeKit: { ...p.homeKit, ...meta } }))
              }
            />
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Kit checklist</h3>
              {canManage ? (
                <button
                  type="button"
                  onClick={addKitItem}
                  className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                >
                  + Add item
                </button>
              ) : null}
            </div>
            <div className="space-y-2">
              {page.homeKit.items.map((item) => (
                <div key={item.id} className="flex gap-2">
                  <input
                    className={adminInputClass}
                    value={item.text}
                    disabled={!canManage}
                    onChange={(e) => updateKitItem({ ...item, text: e.target.value })}
                  />
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removeKitItem(item.id)}
                      className="shrink-0 rounded-lg border border-rose-400/30 px-3 text-xs text-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <AdminField label="Quote">
              <textarea
                className={`${adminInputClass} min-h-[96px]`}
                value={page.homeKit.quote}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    homeKit: { ...p.homeKit, quote: e.target.value },
                  }))
                }
              />
            </AdminField>
            <AdminField label="Quote attribution">
              <input
                className={adminInputClass}
                value={page.homeKit.quoteAttribution}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    homeKit: { ...p.homeKit, quoteAttribution: e.target.value },
                  }))
                }
              />
            </AdminField>
          </div>
        ) : null}

        {tab === "cta" ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Kicker">
                <input
                  className={adminInputClass}
                  value={page.cta.kicker}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, cta: { ...p.cta, kicker: e.target.value } }))
                  }
                />
              </AdminField>
              <AdminField label="Title">
                <input
                  className={adminInputClass}
                  value={page.cta.title}
                  disabled={!canManage}
                  onChange={(e) =>
                    setPage((p) => ({ ...p, cta: { ...p.cta, title: e.target.value } }))
                  }
                />
              </AdminField>
            </div>
            <AdminField label="Subtitle">
              <textarea
                className={`${adminInputClass} min-h-[72px]`}
                value={page.cta.subtitle}
                disabled={!canManage}
                onChange={(e) =>
                  setPage((p) => ({ ...p, cta: { ...p.cta, subtitle: e.target.value } }))
                }
              />
            </AdminField>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-white">Buttons</h3>
              {canManage ? (
                <button
                  type="button"
                  onClick={addCtaButton}
                  className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black"
                >
                  + Add button
                </button>
              ) : null}
            </div>
            <div className="space-y-4">
              {page.cta.buttons.map((item) => (
                <div key={item.id} className="rounded-xl border border-white/10 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <AdminField label="Label">
                      <input
                        className={adminInputClass}
                        value={item.label}
                        disabled={!canManage}
                        onChange={(e) => updateCtaButton({ ...item, label: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Link">
                      <input
                        className={adminInputClass}
                        value={item.href}
                        disabled={!canManage}
                        onChange={(e) => updateCtaButton({ ...item, href: e.target.value })}
                      />
                    </AdminField>
                    <AdminField label="Style">
                      <select
                        className={adminInputClass}
                        value={item.variant}
                        disabled={!canManage}
                        onChange={(e) =>
                          updateCtaButton({
                            ...item,
                            variant: e.target.value as CmsAboutCtaButton["variant"],
                          })
                        }
                      >
                        <option value="primary">Primary (gold)</option>
                        <option value="secondary">Secondary</option>
                        <option value="outline">Outline (gold)</option>
                      </select>
                    </AdminField>
                  </div>
                  {canManage ? (
                    <button
                      type="button"
                      onClick={() => removeCtaButton(item.id)}
                      className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-200"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
