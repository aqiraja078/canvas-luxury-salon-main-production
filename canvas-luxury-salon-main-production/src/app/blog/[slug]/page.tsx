import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import {
  getActiveBlogPosts,
  getBlogPostBySlug,
} from "@/lib/blog-store";
import { BlogContent, BlogCoverImage } from "@/components/blog/BlogContent";
import { formatBlogDate, formatBlogMonthYear } from "@/lib/blog-utils";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = (await getActiveBlogPosts())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <article className="blog-article pt-24 sm:pt-28">
      <header className="blog-article__hero px-4 pb-10 sm:px-6 md:px-8">
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <Link
              href="/blog"
              className="text-xs uppercase tracking-[0.2em] text-gold/80 transition hover:text-gold"
            >
              ← All articles
            </Link>
            <h1 className="blog-article__title mt-6">{post.title}</h1>
            <div className="blog-article__meta mt-5">
              <p>
                <span className="blog-article__meta-label">Category:</span> {post.category}
              </p>
              <p>
                <span className="blog-article__meta-label">Reading Time:</span>{" "}
                {post.readTimeMinutes} Minutes
              </p>
              <p>
                <span className="blog-article__meta-label">Published:</span>{" "}
                <time dateTime={post.publishedAt}>{formatBlogMonthYear(post.publishedAt)}</time>
              </p>
            </div>
            <hr className="blog-article__divider mt-8" />
          </Reveal>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-4xl gap-12 lg:max-w-5xl lg:grid-cols-[1fr_280px]">
          <Reveal>
            {post.coverImage ? (
              <BlogCoverImage src={post.coverImage} />
            ) : null}
            <BlogContent content={post.content} />
            {post.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.08}>
              <div className="blog-article__sidebar rounded-2xl border border-gold/20 bg-gold/[0.06] p-6">
                <p className="text-xs uppercase tracking-[0.22em] text-gold">Book a service</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Loved this guide? Let our artists bring it to life at your doorstep in
                  Jhelum, Dina, or Gujrat.
                </p>
                <Link
                  href="/book"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-gold/50 bg-gold/15 py-3 text-xs font-semibold uppercase tracking-wider text-gold-light transition hover:bg-gold/25"
                >
                  Book now
                </Link>
                <Link
                  href="/contact"
                  className="mt-3 block text-center text-xs text-white/50 transition hover:text-gold"
                >
                  Contact {site.name}
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-white/10 bg-black/40 px-4 py-16 sm:px-6 md:px-8">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2 className="font-display text-2xl text-white">More to read</h2>
            </Reveal>
            <ul className="mt-8 space-y-4">
              {related.map((item, idx) => (
                <Reveal key={item.id} delay={idx * 0.05}>
                  <li>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-gold/30 hover:bg-gold/[0.04] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wider text-gold/80">
                          {item.category}
                        </p>
                        <p className="font-display text-lg text-white group-hover:text-gold-light">
                          {item.title}
                        </p>
                      </div>
                      <span className="text-xs text-white/45">
                        {formatBlogDate(item.publishedAt)}
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
