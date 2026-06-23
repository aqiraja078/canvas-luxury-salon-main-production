import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { CmsBlogPage, CmsBlogPost } from "@/lib/cms-types";
import { defaultBlogPage } from "@/lib/blog-page-defaults";
import { slugifyBlogTitle } from "@/lib/blog-utils";

const POSTS_KEY = "blog-posts";
const PAGE_KEY = "blog-page";

async function ensurePageSeeded() {
  const existing = await readCmsJson<CmsBlogPage | null>(PAGE_KEY, null);
  if (existing) return;
  await writeCmsJson(PAGE_KEY, defaultBlogPage());
}

async function ensurePostsSeeded() {
  const list = await readCmsJson<CmsBlogPost[] | null>(POSTS_KEY, null);
  if (list !== null) return;

  const ts = new Date().toISOString();
  const published = "2026-03-15T10:00:00.000Z";

  const seed: CmsBlogPost[] = [
    {
      id: randomUUID(),
      slug: "bridal-makeup-timeline-pakistan",
      title: "Bridal Makeup Timeline: When to Book Each Step",
      excerpt:
        "From engagement glow to barat glam — a week-by-week plan so your bridal look stays fresh, not rushed.",
      content: [
        "Your wedding week moves fast. The artists who look effortless on barat day usually started planning their beauty timeline months earlier — not because they are anxious, but because great makeup needs the right prep window.",
        "Six to eight weeks before the wedding, book your bridal trial. This is when we match foundation to your skin under real light, test longevity with your dupatta and jewellery, and decide whether you want soft glam or full HD coverage.",
        "Two weeks out, schedule a deep-cleansing or brightening facial. Avoid brand-new active ingredients this close to the date — we want calm, hydrated skin, not a surprise reaction.",
        "Three days before mehndi, get your hands and feet ready with gentle exfoliation and rich moisturiser. Mehndi stains best on clean, nourished skin.",
        "On barat morning, allow at least three hours for hair and makeup at home. Rushing the base is the fastest way to lose longevity. We build in setting time, touch-up kit guidance, and photos with natural light before you leave.",
        "Book your home service early for peak wedding season in Jhelum, Dina, and Gujrat — the best artists fill up fast.",
      ].join("\n\n"),
      coverImage:
        "https://images.unsplash.com/photo-1522337360788-8b13dee2a3a0?w=1200&q=85",
      author: "Huma Beauty Team",
      category: "Bridal",
      tags: ["Bridal", "Makeup", "Planning"],
      readTimeMinutes: 5,
      featured: true,
      active: true,
      publishedAt: published,
      sortOrder: 0,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      slug: "hair-colour-aftercare-monsoon",
      title: "Hair Colour Aftercare in Humid Weather",
      excerpt:
        "Keep balayage and global colour vibrant through Punjab heat and monsoon humidity with salon-approved habits.",
      content: [
        "Colour fade in humid weather is rarely about the shade itself — it is about moisture, sun, and how you wash in the first ten days.",
        "Wait 48 hours after colour before your first wash. Use sulphate-free shampoo and lukewarm water. Hot water opens the cuticle and pulls pigment faster.",
        "If you swim or sweat often, rinse hair with clean water before shampooing. Chlorine and salt strip tone quickly.",
        "At home, a weekly mask keeps bleached or highlighted hair soft. Dry ends make colour look dull even when the root tone is perfect.",
        "For balayage grown out gracefully, book a gloss or toner refresh every eight to ten weeks instead of waiting until the contrast feels harsh.",
        "Our stylists match aftercare to your exact service — keratin, global colour, and fashion vivids each need a slightly different routine.",
      ].join("\n\n"),
      coverImage:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=85",
      author: "Huma Beauty Team",
      category: "Hair",
      tags: ["Hair Color", "Aftercare", "Tips"],
      readTimeMinutes: 4,
      featured: false,
      active: true,
      publishedAt: "2026-03-01T10:00:00.000Z",
      sortOrder: 1,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: randomUUID(),
      slug: "pre-bridal-facial-guide",
      title: "Which Facial Should You Book Before Your Wedding?",
      excerpt:
        "Glow, brightening, acne care, or sensitive skin — how to pick the right facial without last-minute surprises.",
      content: [
        "Not every bride needs the same facial. Skin goals, climate, and how your skin reacts to new products should guide the choice — not whatever is trending on social media.",
        "For dull or uneven tone, a brightening facial with gentle enzymes can add radiance without heavy peeling. Ideal four to six weeks before major events.",
        "Acne-prone or congested skin benefits from a deep-cleansing protocol with extractions done professionally — never at home the night before an event.",
        "Sensitive or reactive skin does best with calming hydration facials. We patch-test and avoid aggressive actives close to wedding dates.",
        "If you have never had a professional facial, book one trial at least six weeks ahead. That gives time to repeat or adjust if your skin loves the protocol.",
        "Pair your facial with realistic home care: SPF in the day, gentle cleanser at night, and no experimental DIY masks in the final week.",
      ].join("\n\n"),
      coverImage:
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=85",
      author: "Huma Beauty Team",
      category: "Skincare",
      tags: ["Facial", "Bridal", "Skincare"],
      readTimeMinutes: 4,
      featured: false,
      active: true,
      publishedAt: "2026-02-18T10:00:00.000Z",
      sortOrder: 2,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  await writeCmsJson(POSTS_KEY, seed);
}

export async function getBlogPosts(): Promise<CmsBlogPost[]> {
  noStore();
  await ensurePageSeeded();
  await ensurePostsSeeded();
  return (await readCmsJson<CmsBlogPost[]>(POSTS_KEY, [])).sort((a, b) => {
    const dateDiff = Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
    return dateDiff !== 0 ? dateDiff : a.sortOrder - b.sortOrder;
  });
}

export async function getActiveBlogPosts(): Promise<CmsBlogPost[]> {
  return (await getBlogPosts()).filter((p) => p.active);
}

export async function getBlogPostBySlug(slug: string): Promise<CmsBlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug && p.active) ?? null;
}

export async function getBlogPage(): Promise<CmsBlogPage> {
  noStore();
  await ensurePageSeeded();
  return await readCmsJson<CmsBlogPage>(PAGE_KEY, defaultBlogPage());
}

export async function updateBlogPage(
  patch: Partial<Omit<CmsBlogPage, "updatedAt">>
): Promise<CmsBlogPage> {
  const current = await getBlogPage();
  const next: CmsBlogPage = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(PAGE_KEY, next);
  return next;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const posts = await getBlogPosts();
  let slug = base || "post";
  let n = 2;
  while (posts.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function createBlogPost(
  input: Omit<CmsBlogPost, "id" | "slug" | "createdAt" | "updatedAt"> & {
    slug?: string;
  }
): Promise<CmsBlogPost> {
  const list = await getBlogPosts();
  const ts = new Date().toISOString();
  const base = slugifyBlogTitle(input.slug?.trim() || input.title);
  const slug = await uniqueSlug(base);
  const post: CmsBlogPost = {
    ...input,
    slug,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(post);
  await writeCmsJson(POSTS_KEY, list);
  return post;
}

export async function updateBlogPost(
  id: string,
  patch: Partial<Omit<CmsBlogPost, "id" | "createdAt">> & { slug?: string }
): Promise<CmsBlogPost | null> {
  const list = await getBlogPosts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  let slug = list[idx].slug;
  if (patch.slug !== undefined || patch.title !== undefined) {
    const base = slugifyBlogTitle(
      patch.slug?.trim() || patch.title?.trim() || list[idx].title
    );
    slug = await uniqueSlug(base, id);
  }

  list[idx] = {
    ...list[idx],
    ...patch,
    slug,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await writeCmsJson(POSTS_KEY, list);
  return list[idx];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const list = await getBlogPosts();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await writeCmsJson(POSTS_KEY, next);
  return true;
}
