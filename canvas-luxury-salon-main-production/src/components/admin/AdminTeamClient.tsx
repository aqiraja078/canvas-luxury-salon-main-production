"use client";

import { useState } from "react";
import type { CmsTeamMember, CmsTeamSection, CmsTeamSkill, CmsTeamStat } from "@/lib/cms-types";
import {
  AdminField,
  AdminShell,
  adminCardClass,
  adminInputClass,
  uploadAdminImage,
} from "@/components/admin/AdminShell";

const emptyMemberForm = {
  name: "",
  role: "",
  bio: "",
  aboutText: "",
  specialties: "",
  experienceYears: "",
  imageUrl: "",
  instagram: "",
  facebook: "",
  phone: "",
  sortOrder: 0,
  active: true,
  skills: [] as CmsTeamSkill[],
};

function newStatId() {
  return crypto.randomUUID();
}

export function AdminTeamClient({
  initialMembers,
  initialSection,
  sessionUser,
}: {
  initialMembers: CmsTeamMember[];
  initialSection: CmsTeamSection;
  sessionUser: import("@/lib/admin-session-user").AdminSessionUser | null;
}) {
  const [rows, setRows] = useState(initialMembers);
  const [section, setSection] = useState(initialSection);
  const [editing, setEditing] = useState<CmsTeamMember | null>(null);
  const [form, setForm] = useState(emptyMemberForm);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<"section" | "members">("section");

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyMemberForm,
      sortOrder:
        rows.reduce((max, r) => Math.max(max, r.sortOrder), -1) + 1,
    });
    setTab("members");
  }

  function openEdit(m: CmsTeamMember) {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      aboutText: m.aboutText || "",
      specialties: m.specialties.join(", "),
      experienceYears: m.experienceYears?.toString() || "",
      imageUrl: m.imageUrl || "",
      instagram: m.instagram || "",
      facebook: m.facebook || "",
      phone: m.phone || "",
      sortOrder: m.sortOrder,
      active: m.active,
      skills: m.skills?.length ? [...m.skills] : [],
    });
    setTab("members");
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

  async function onSectionImage(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadAdminImage(file);
      setSection((s) => ({ ...s, defaultMemberImage: url }));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveSection() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSection(data.section);
      setMsg("Section settings saved.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveMember() {
    if (!form.name.trim() || !form.role.trim()) {
      setMsg("Name and role are required.");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        aboutText: form.aboutText.trim() || undefined,
        specialties: form.specialties
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experienceYears: form.experienceYears
          ? Number(form.experienceYears)
          : undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        instagram: form.instagram.trim() || undefined,
        facebook: form.facebook.trim() || undefined,
        phone: form.phone.trim() || undefined,
        skills:
          form.skills.filter((s) => s.title.trim()).length > 0
            ? form.skills
                .map((s) => ({
                  title: s.title.trim(),
                  description: s.description.trim(),
                }))
                .filter((s) => s.title)
            : undefined,
        sortOrder: Number(form.sortOrder) || 0,
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
        setRows((prev) => [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      openCreate();
      setMsg("Team member saved.");
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
    if (res.ok) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editing?.id === id) openCreate();
    }
  }

  function updateStat(idx: number, patch: Partial<CmsTeamStat>) {
    setSection((s) => ({
      ...s,
      stats: s.stats.map((stat, i) => (i === idx ? { ...stat, ...patch } : stat)),
    }));
  }

  function updateSkill(idx: number, patch: Partial<CmsTeamSkill>) {
    setForm((f) => ({
      ...f,
      skills: f.skills.map((skill, i) => (i === idx ? { ...skill, ...patch } : skill)),
    }));
  }

  function removeStat(idx: number) {
    setSection((s) => ({
      ...s,
      stats: s.stats.filter((_, i) => i !== idx),
    }));
  }

  return (
    <AdminShell
      sessionUser={sessionUser}
      title="Our Team"
      subtitle="Edit the full team section — headings, stats, limits, and every artist profile for home & about pages."
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("section")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            tab === "section" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          Section settings
        </button>
        <button
          type="button"
          onClick={() => setTab("members")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${
            tab === "members" ? "bg-gold/15 text-gold" : "bg-white/5 text-white/60"
          }`}
        >
          Team members ({rows.length})
        </button>
        {tab === "members" ? (
          <button
            type="button"
            onClick={openCreate}
            className="ml-auto rounded-full bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black"
          >
            + Add member
          </button>
        ) : null}
      </div>

      {tab === "section" ? (
        <div className={`${adminCardClass} mt-8 space-y-6 p-5`}>
          <h2 className="font-display text-xl text-white">Section header</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Kicker (small label)">
              <input
                className={adminInputClass}
                value={section.kicker}
                onChange={(e) =>
                  setSection((s) => ({ ...s, kicker: e.target.value }))
                }
              />
            </AdminField>
            <AdminField label="Section index">
              <input
                className={adminInputClass}
                value={section.sectionIndex}
                onChange={(e) =>
                  setSection((s) => ({ ...s, sectionIndex: e.target.value }))
                }
              />
            </AdminField>
            <AdminField label="Title">
              <input
                className={adminInputClass}
                value={section.title}
                onChange={(e) =>
                  setSection((s) => ({ ...s, title: e.target.value }))
                }
              />
            </AdminField>
            <AdminField label="Subtitle">
              <input
                className={adminInputClass}
                value={section.subtitle}
                onChange={(e) =>
                  setSection((s) => ({ ...s, subtitle: e.target.value }))
                }
              />
            </AdminField>
          </div>

          <AdminField label="Empty message (when no active members)">
            <textarea
              className={`${adminInputClass} min-h-[72px]`}
              value={section.emptyMessage}
              onChange={(e) =>
                setSection((s) => ({ ...s, emptyMessage: e.target.value }))
              }
            />
          </AdminField>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Members on home page">
              <input
                type="number"
                min={1}
                max={10}
                className={adminInputClass}
                value={section.homeMemberLimit}
                onChange={(e) =>
                  setSection((s) => ({
                    ...s,
                    homeMemberLimit: Number(e.target.value) || 3,
                  }))
                }
              />
            </AdminField>
            <AdminField label="Members on about page">
              <input
                type="number"
                min={1}
                max={10}
                className={adminInputClass}
                value={section.aboutMemberLimit}
                onChange={(e) =>
                  setSection((s) => ({
                    ...s,
                    aboutMemberLimit: Number(e.target.value) || 3,
                  }))
                }
              />
            </AdminField>
          </div>

          <h2 className="font-display text-xl text-white">Detail panel copy</h2>
          <AdminField label='About heading (use {"{name}"} for artist name)'>
            <input
              className={adminInputClass}
              value={section.aboutHeadingTemplate}
              onChange={(e) =>
                setSection((s) => ({
                  ...s,
                  aboutHeadingTemplate: e.target.value,
                }))
              }
            />
          </AdminField>
          <AdminField label='About lead text (use {"{name}"} and {"{years}"})'>
            <textarea
              className={`${adminInputClass} min-h-[88px]`}
              value={section.aboutLeadTemplate}
              onChange={(e) =>
                setSection((s) => ({
                  ...s,
                  aboutLeadTemplate: e.target.value,
                }))
              }
            />
          </AdminField>

          <AdminField label="Default photo (when member has no image)">
            <input
              className={adminInputClass}
              value={section.defaultMemberImage}
              onChange={(e) =>
                setSection((s) => ({
                  ...s,
                  defaultMemberImage: e.target.value,
                }))
              }
            />
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => onSectionImage(e.target.files?.[0] ?? null)}
              className="mt-2 text-sm text-white/70"
            />
            {section.defaultMemberImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.defaultMemberImage}
                alt="Default preview"
                className="mt-3 h-28 w-28 rounded-full object-cover"
              />
            ) : null}
          </AdminField>

          <h2 className="font-display text-xl text-white">Stats row</h2>
          <p className="text-xs text-white/45">
            Use {"{years}"} in the first stat value to show each member&apos;s experience.
          </p>
          <div className="space-y-3">
            {section.stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="grid gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-[1fr_1fr_auto]"
              >
                <AdminField label={`Stat ${idx + 1} value`}>
                  <input
                    className={adminInputClass}
                    value={stat.value}
                    onChange={(e) => updateStat(idx, { value: e.target.value })}
                  />
                </AdminField>
                <AdminField label={`Stat ${idx + 1} label`}>
                  <input
                    className={adminInputClass}
                    value={stat.label}
                    onChange={(e) => updateStat(idx, { label: e.target.value })}
                  />
                </AdminField>
                <div className="flex items-end pb-1">
                  <button
                    type="button"
                    onClick={() => removeStat(idx)}
                    disabled={section.stats.length <= 1}
                    className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setSection((s) => ({
                ...s,
                stats: [
                  ...s.stats,
                  { id: newStatId(), value: "", label: "" },
                ],
              }))
            }
            className="rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70"
          >
            + Add stat
          </button>

          {msg ? <p className="text-sm text-gold">{msg}</p> : null}
          <button
            type="button"
            disabled={busy}
            onClick={saveSection}
            className="rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save section settings"}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[1fr_380px]">
          <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((m) => (
              <div key={m.id} className={`${adminCardClass} h-fit p-5 text-center`}>
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.imageUrl}
                    alt=""
                    className="mx-auto h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gold/10 text-3xl text-gold">
                    {m.name.charAt(0)}
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl text-white">{m.name}</h3>
                <p className="text-sm text-gold">{m.role}</p>
                <p className="mt-2 line-clamp-3 text-sm text-white/60">{m.bio}</p>
                {!m.active ? (
                  <p className="mt-2 text-xs uppercase tracking-wider text-rose-300">
                    Hidden
                  </p>
                ) : null}
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(m)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={`${adminCardClass} h-fit p-5 lg:sticky lg:top-28`}>
            <h2 className="font-display text-xl">
              {editing ? "Edit member" : "New member"}
            </h2>
            <div className="mt-5 space-y-4">
              <AdminField label="Name">
                <input
                  className={adminInputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Role / title">
                <input
                  className={adminInputClass}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Short bio (card)">
                <textarea
                  className={`${adminInputClass} min-h-[72px]`}
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Long about text (detail panel — optional)">
                <textarea
                  className={`${adminInputClass} min-h-[88px]`}
                  value={form.aboutText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, aboutText: e.target.value }))
                  }
                  placeholder="Leave empty to auto-generate from experience + bio"
                />
              </AdminField>
              <AdminField label="Specialties (comma separated)">
                <input
                  className={adminInputClass}
                  value={form.specialties}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialties: e.target.value }))
                  }
                  placeholder="Bridal Makeup, Mehndi, Hair"
                />
              </AdminField>

              <div className="space-y-3 rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Skill cards (optional)
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        skills: [...f.skills, { title: "", description: "" }],
                      }))
                    }
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70"
                  >
                    + Add skill
                  </button>
                </div>
                <p className="text-[11px] text-white/40">
                  Leave empty to auto-build skill cards from specialties. Add custom
                  cards to override what visitors see in the detail panel.
                </p>
                {form.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="grid gap-3 rounded-lg border border-white/8 p-3 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <AdminField label="Skill title">
                      <input
                        className={adminInputClass}
                        value={skill.title}
                        onChange={(e) => updateSkill(idx, { title: e.target.value })}
                        placeholder="Bridal Makeup Expert"
                      />
                    </AdminField>
                    <AdminField label="Skill description">
                      <input
                        className={adminInputClass}
                        value={skill.description}
                        onChange={(e) =>
                          updateSkill(idx, { description: e.target.value })
                        }
                        placeholder="Flawless, long-lasting looks..."
                      />
                    </AdminField>
                    <div className="flex items-end pb-1">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            skills: f.skills.filter((_, i) => i !== idx),
                          }))
                        }
                        className="rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AdminField label="Experience (years)">
                  <input
                    type="number"
                    min={0}
                    className={adminInputClass}
                    value={form.experienceYears}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, experienceYears: e.target.value }))
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
              <AdminField label="Instagram URL">
                <input
                  className={adminInputClass}
                  value={form.instagram}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instagram: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Facebook URL (optional)">
                <input
                  className={adminInputClass}
                  value={form.facebook}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, facebook: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Phone (optional)">
                <input
                  className={adminInputClass}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+92 300 1234567"
                />
              </AdminField>
              <AdminField label="Photo URL">
                <input
                  className={adminInputClass}
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Upload photo">
                <input
                  type="file"
                  accept="image/*"
                  disabled={busy}
                  onChange={(e) => onImage(e.target.files?.[0] ?? null)}
                  className="text-sm text-white/70"
                />
              </AdminField>
              {form.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mx-auto h-36 w-36 rounded-full border border-gold/30 object-cover"
                />
              ) : null}
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                />
                Show on website
              </label>
              {msg ? <p className="text-sm text-gold">{msg}</p> : null}
              <button
                type="button"
                disabled={busy}
                onClick={saveMember}
                className="w-full rounded-full bg-white py-3 text-xs font-semibold uppercase tracking-wider text-black disabled:opacity-50"
              >
                {busy ? "Saving…" : editing ? "Update member" : "Add member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
