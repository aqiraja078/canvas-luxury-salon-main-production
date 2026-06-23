import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/admin-auth";
import {
  createBlogPost,
  deleteBlogPost,
  getBlogPage,
  getBlogPosts,
  updateBlogPage,
  updateBlogPost,
} from "@/lib/blog-store";
import { slugifyBlogTitle } from "@/lib/blog-utils";
import type { CmsBlogPage } from "@/lib/cms-types";

export async function GET() {
  try {
    await requirePermission("blog.view");
    const [posts, page] = await Promise.all([getBlogPosts(), getBlogPage()]);
    return NextResponse.json({ posts, page });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("blog.manage");
    const body = (await request.json()) as Record<string, unknown>;
    if (!String(body.title || "").trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    const post = await createBlogPost({
      title: String(body.title || "").trim(),
      excerpt: String(body.excerpt || "").trim(),
      content: String(body.content || "").trim(),
      coverImage: body.coverImage ? String(body.coverImage) : undefined,
      author: String(body.author || "Huma Beauty Team").trim(),
      category: String(body.category || "Tips").trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map(String).map((t) => t.trim()).filter(Boolean)
        : String(body.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      readTimeMinutes: Math.max(1, Number(body.readTimeMinutes) || 3),
      featured: Boolean(body.featured),
      active: body.active !== false,
      publishedAt: body.publishedAt
        ? new Date(String(body.publishedAt)).toISOString()
        : new Date().toISOString(),
      sortOrder: Number(body.sortOrder) || 0,
      slug: body.slug ? String(body.slug).trim() : undefined,
    });
    return NextResponse.json(post);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requirePermission("blog.manage");
    const body = (await request.json()) as {
      id?: string;
      page?: Partial<CmsBlogPage>;
    } & Record<string, unknown>;

    if (body.page && !body.id) {
      const updated = await updateBlogPage(body.page);
      return NextResponse.json({ page: updated });
    }

    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { id, page: _page, ...raw } = body;
    const patch: Parameters<typeof updateBlogPost>[1] = { ...raw };

    if (raw.title !== undefined) patch.title = String(raw.title).trim();
    if (raw.excerpt !== undefined) patch.excerpt = String(raw.excerpt).trim();
    if (raw.content !== undefined) patch.content = String(raw.content).trim();
    if (raw.author !== undefined) patch.author = String(raw.author).trim();
    if (raw.category !== undefined) patch.category = String(raw.category).trim();
    if (raw.coverImage !== undefined) {
      patch.coverImage = String(raw.coverImage).trim() || undefined;
    }
    if (raw.slug !== undefined) {
      patch.slug = slugifyBlogTitle(String(raw.slug).trim());
    }
    if (raw.tags !== undefined) {
      patch.tags = Array.isArray(raw.tags)
        ? raw.tags.map(String).map((t) => t.trim()).filter(Boolean)
        : String(raw.tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
    }
    if (raw.readTimeMinutes !== undefined) {
      patch.readTimeMinutes = Math.max(1, Number(raw.readTimeMinutes) || 3);
    }
    if (raw.publishedAt !== undefined) {
      patch.publishedAt = new Date(String(raw.publishedAt)).toISOString();
    }

    const updated = await updateBlogPost(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requirePermission("blog.manage");
    const body = (await request.json()) as { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ok = await deleteBlogPost(body.id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed";
    return NextResponse.json(
      { error: msg },
      { status: msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500 }
    );
  }
}
