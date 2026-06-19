import { randomUUID } from "crypto";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsCourse } from "@/lib/cms-types";

const KEY = "courses";

export function slugifyCourseTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureSeeded() {
  const list = await readCmsJson<CmsCourse[]>(KEY, []);
  if (list.length > 0) return;
  const ts = new Date().toISOString();
  const seed: CmsCourse[] = [
    {
      id: randomUUID(),
      slug: "professional-makeup",
      title: "Professional Makeup Course",
      shortDescription:
        "Everyday glam se bridal tak — hands-on training with professional techniques.",
      description:
        "Yeh course un students ke liye hai jo makeup ko professionally seekhna chahte hain. Skin prep, colour theory, day and party looks, aur bridal base techniques cover hoti hain. Har session practical hai — theory kam, practice zyada.",
      duration: "8 weeks",
      fee: "Rs. 45,000",
      syllabus: [
        "Skin prep & colour theory",
        "Day & party makeup",
        "Bridal base techniques",
        "Eye & lip artistry",
        "HD & photography-ready looks",
        "Client consultation & kit care",
      ],
      highlights: [
        "Practice kit included",
        "Certificate on completion",
        "Small batch (max 8 students)",
        "Live model practice",
      ],
      instructor: "Senior Huma team artist",
      nextBatch: "March 2026",
      featured: true,
      active: true,
      sortOrder: 0,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      slug: "bridal-makeup-masterclass",
      title: "Bridal Makeup Masterclass",
      shortDescription:
        "Walima, mehndi aur barat looks — complete bridal prep in one intensive course.",
      description:
        "Bridal makeup ki poori journey — trial se le kar barat day tak. Long-wear techniques, touch-up tips, aur real wedding scenarios par focus. Ideal for artists jo bridal market mein grow karna chahte hain.",
      duration: "4 weeks",
      fee: "Rs. 28,000",
      syllabus: [
        "Bridal skin prep",
        "Mehndi & walima looks",
        "Barat & reception glam",
        "Touch-up & longevity",
        "Trial session workflow",
      ],
      highlights: [
        "Bridal kit guidance",
        "Portfolio shoot tips",
        "Industry mentor sessions",
      ],
      instructor: "Lead bridal artist",
      nextBatch: "April 2026",
      featured: true,
      active: true,
      sortOrder: 1,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      slug: "hair-styling-basics",
      title: "Hair Styling Basics",
      shortDescription:
        "Blow-dry, curls, updos aur party styles — salon-ready hair skills.",
      description:
        "Hair styling ki fundamentals seekhein: tools, sectioning, blow-dry, curling, aur simple updos. Party aur bridal hair ke liye strong base banayein.",
      duration: "6 weeks",
      fee: "Rs. 22,000",
      syllabus: [
        "Tools & product knowledge",
        "Blow-dry & volume",
        "Curls & waves",
        "Party updos",
        "Bridal hair basics",
      ],
      highlights: [
        "Hands-on daily practice",
        "Product recommendations",
        "Certificate included",
      ],
      nextBatch: "May 2026",
      featured: false,
      active: true,
      sortOrder: 2,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      slug: "mehndi-art-course",
      title: "Mehndi Art Course",
      shortDescription:
        "Arabic, traditional aur bridal mehndi designs — step-by-step mastery.",
      description:
        "Mehndi art from basics to bridal — cone control, design flow, Arabic patterns, aur full-hand bridal layouts. Eid aur wedding season ke liye perfect skill set.",
      duration: "5 weeks",
      fee: "Rs. 15,000",
      syllabus: [
        "Cone control & basics",
        "Arabic patterns",
        "Traditional motifs",
        "Bridal full-hand design",
        "Speed & consistency",
      ],
      highlights: [
        "Design workbook included",
        "Practice cones provided",
        "Small group coaching",
      ],
      nextBatch: "March 2026",
      featured: false,
      active: true,
      sortOrder: 3,
      createdAt: ts,
      updatedAt: ts,
    },
  ];
  await writeCmsJson(KEY, seed);
}

export async function getCourses(): Promise<CmsCourse[]> {
  await ensureSeeded();
  return (await readCmsJson<CmsCourse[]>(KEY, [])).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}

export async function getActiveCourses(): Promise<CmsCourse[]> {
  return (await getCourses()).filter((c) => c.active);
}

export async function getFeaturedCourses(): Promise<CmsCourse[]> {
  return (await getActiveCourses()).filter((c) => c.featured);
}

export async function getCourseBySlug(slug: string): Promise<CmsCourse | null> {
  const list = await getCourses();
  return list.find((c) => c.slug === slug && c.active) ?? null;
}

export async function saveCourses(courses: CmsCourse[]): Promise<void> {
  await writeCmsJson(KEY, courses);
}

export async function createCourse(
  input: Omit<CmsCourse, "id" | "createdAt" | "updatedAt">
): Promise<CmsCourse> {
  const list = await getCourses();
  const ts = new Date().toISOString();
  const course: CmsCourse = {
    ...input,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(course);
  await saveCourses(list);
  return course;
}

export async function updateCourse(
  id: string,
  patch: Partial<Omit<CmsCourse, "id" | "createdAt">>
): Promise<CmsCourse | null> {
  const list = await getCourses();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  list[idx] = {
    ...list[idx],
    ...patch,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await saveCourses(list);
  return list[idx];
}

export async function deleteCourse(id: string): Promise<boolean> {
  const list = await getCourses();
  const next = list.filter((c) => c.id !== id);
  if (next.length === list.length) return false;
  await saveCourses(next);
  return true;
}
