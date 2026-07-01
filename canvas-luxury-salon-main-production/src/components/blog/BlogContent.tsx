import { parseBlogContent } from "@/lib/blog-utils";
import { BlogImage } from "@/components/blog/BlogImage";

function BlogInlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function BlogContent({ content }: { content: string }) {
  const blocks = parseBlogContent(content);

  return (
    <div className="blog-article__content">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          if (block.level === 2) {
            return (
              <h2 key={idx} className="blog-article__heading">
                {block.text}
              </h2>
            );
          }
          return (
            <h3 key={idx} className="blog-article__subheading">
              {block.text}
            </h3>
          );
        }

        if (block.type === "image") {
          return <BlogImage key={idx} src={block.src} alt={block.alt} />;
        }

        return (
          <p key={idx}>
            <BlogInlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export function BlogCoverImage({ src, alt = "" }: { src: string; alt?: string }) {
  return <BlogImage src={src} alt={alt} className="blog-image--cover" priority />;
}
