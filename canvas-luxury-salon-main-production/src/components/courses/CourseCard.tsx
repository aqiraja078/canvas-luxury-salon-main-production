import Link from "next/link";
import type { CmsCourse } from "@/lib/cms-types";

type CourseCardProps = {
  course: CmsCourse;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="card-premium-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/10 via-black to-black shadow-deep-gold">
      {course.imageUrl ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">
          {course.duration}
          {course.nextBatch ? ` · Next: ${course.nextBatch}` : ""}
        </p>
        <h3 className="mt-3 font-display text-xl text-white sm:text-2xl">
          {course.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">
          {course.shortDescription}
        </p>
        <p className="mt-4 text-lg font-semibold text-gold-light">{course.fee}</p>
        {course.highlights.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {course.highlights.slice(0, 3).map((h) => (
              <li
                key={h}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {h}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={`/courses/${course.slug}`}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition hover:border-gold hover:bg-gold/20 sm:w-auto sm:px-8"
        >
          View &amp; apply
        </Link>
      </div>
    </article>
  );
}
