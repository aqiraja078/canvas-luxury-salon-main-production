import { randomUUID } from "crypto";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type {
  CmsCourseApplication,
  CourseApplicationStatus,
} from "@/lib/cms-types";

const KEY = "course-applications";

export async function getCourseApplications(): Promise<CmsCourseApplication[]> {
  const list = await readCmsJson<CmsCourseApplication[]>(KEY, []);
  return list.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export async function addCourseApplication(
  input: Omit<CmsCourseApplication, "id" | "createdAt" | "status"> & {
    status?: CourseApplicationStatus;
  }
): Promise<CmsCourseApplication> {
  const list = await readCmsJson<CmsCourseApplication[]>(KEY, []);
  const application: CmsCourseApplication = {
    ...input,
    id: randomUUID(),
    status: input.status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  list.unshift(application);
  await writeCmsJson(KEY, list);
  return application;
}

export async function updateCourseApplicationStatus(
  id: string,
  status: CourseApplicationStatus
): Promise<CmsCourseApplication | null> {
  const list = await readCmsJson<CmsCourseApplication[]>(KEY, []);
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status };
  await writeCmsJson(KEY, list);
  return list[idx];
}

export async function deleteCourseApplication(
  id: string
): Promise<boolean> {
  const list = await readCmsJson<CmsCourseApplication[]>(KEY, []);
  const next = list.filter((a) => a.id !== id);
  if (next.length === list.length) return false;
  await writeCmsJson(KEY, next);
  return true;
}
