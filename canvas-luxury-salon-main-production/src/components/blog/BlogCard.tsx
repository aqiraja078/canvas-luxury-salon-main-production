import Link from "next/link";
import type { CmsBlogPost } from "@/lib/cms-types";
import { formatBlogDate } from "@/lib/blog-utils";

type Props = {
  post: CmsBlogPost;
  variant?: "default" | "featured";
};

export function BlogCard({ post, variant = "default" }: Props) {
  const featured = variant === "featured";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`blog-card group block h-full ${featured ? "blog-card--featured" : ""}`}
    >
      <div className="blog-card__media">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="blog-card__image"
          />
        ) : (
          <div className="blog-card__image blog-card__image--placeholder" />
        )}
        <span className="blog-card__category">{post.category}</span>
      </div>
      <div className="blog-card__body">
        <p className="blog-card__meta">
          <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTimeMinutes} min read</span>
        </p>
        <h3 className={`blog-card__title ${featured ? "blog-card__title--lg" : ""}`}>
          {post.title}
        </h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>
        <span className="blog-card__cta">
          Read article
          <span aria-hidden className="blog-card__cta-arrow">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
