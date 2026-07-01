type BlogImageProps = {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

/** Uniform 16:9 blog image — same size on mobile and desktop. */
export function BlogImage({ src, alt = "", className = "", priority = false }: BlogImageProps) {
  return (
    <figure className={`blog-image ${className}`.trim()}>
      <div className="blog-image__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="blog-image__img"
        />
      </div>
    </figure>
  );
}
