import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/blog/BlogCard";
import { getActiveBlogPosts, getBlogPage } from "@/lib/blog-store";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Beauty Blog",
  description: `Beauty tips, bridal guides, and expert advice from ${site.name}.`,
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, page] = await Promise.all([getActiveBlogPosts(), getBlogPage()]);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = featured
    ? posts.filter((p) => p.id !== featured.id)
    : posts.slice(1);

  return (
    <div className="blog-page pt-24 sm:pt-28">
      <section className="blog-page__hero px-4 pb-12 sm:px-6 md:px-8">
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="blog-page__kicker">{page.kicker}</p>
            <h1 className="blog-page__title">{page.title}</h1>
            <p className="blog-page__subtitle">{page.subtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-white/55">
              {page.emptyMessage}
            </p>
          ) : (
            <>
              {featured ? (
                <Reveal scale>
                  <div className="mb-8 md:mb-10">
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold">
                      Featured story
                    </p>
                    <BlogCard post={featured} variant="featured" />
                  </div>
                </Reveal>
              ) : null}

              {rest.length > 0 ? (
                <>
                  <Reveal>
                    <h2 className="font-display text-2xl text-white sm:text-3xl">
                      Latest articles
                    </h2>
                    <p className="mt-2 text-sm text-white/50">
                      {rest.length} more article{rest.length === 1 ? "" : "s"}
                    </p>
                  </Reveal>
                  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post, idx) => (
                      <Reveal key={post.id} delay={idx * 0.05} scale>
                        <BlogCard post={post} />
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
