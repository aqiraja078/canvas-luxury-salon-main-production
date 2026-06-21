import { randomUUID } from "crypto";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsTeamMember } from "@/lib/cms-types";

const KEY = "team";

async function ensureSeeded() {
  const list = await readCmsJson<CmsTeamMember[] | null>(KEY, null);
  if (list && list.length > 0) return;
  const ts = new Date().toISOString();
  const seed: CmsTeamMember[] = [
    {
      id: randomUUID(),
      name: "Huma",
      role: "Owner & Lead Artist",
      bio: "Specialist in bridal makeup, mehndi, and luxury home beauty services across Jhelum, Dina, and Gujrat.",
      specialties: ["Bridal Makeup", "Mehndi", "Facial"],
      experienceYears: 8,
      instagram: "https://www.instagram.com/huma_beauty.saloon/",
      sortOrder: 0,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    },
  ];
  await writeCmsJson(KEY, seed);
}

export async function getTeamMembers(): Promise<CmsTeamMember[]> {
  await ensureSeeded();
  return (await readCmsJson<CmsTeamMember[]>(KEY, [])).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getActiveTeamMembers(): Promise<CmsTeamMember[]> {
  return (await getTeamMembers()).filter((m) => m.active);
}

export async function saveTeamMembers(members: CmsTeamMember[]): Promise<void> {
  await writeCmsJson(KEY, members);
}

export async function createTeamMember(
  input: Omit<CmsTeamMember, "id" | "createdAt" | "updatedAt">
): Promise<CmsTeamMember> {
  const list = await getTeamMembers();
  const ts = new Date().toISOString();
  const member: CmsTeamMember = {
    ...input,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(member);
  await saveTeamMembers(list);
  return member;
}

export async function updateTeamMember(
  id: string,
  patch: Partial<Omit<CmsTeamMember, "id" | "createdAt">>
): Promise<CmsTeamMember | null> {
  const list = await getTeamMembers();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await saveTeamMembers(list);
  return list[idx];
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const list = await getTeamMembers();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;
  await saveTeamMembers(next);
  return true;
}
