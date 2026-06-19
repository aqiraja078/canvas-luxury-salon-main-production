import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { CourseApplyForm } from "@/components/courses/CourseApplyForm";
import {
  getActiveCourses,
  getCourseBySlug,
} from "@/lib/courses-store";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const courses = await getActiveCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — Academy`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden px-4 pb-10 sm:px-6 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_0%,rgba(201,169,98,0.14),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <Link
              href="/courses"
              className="text-xs uppercase tracking-[0.2em] text-gold/80 hover:text-gold"
            >
              ← All courses
            </Link>
            <p className="mt-6 text-caption-golden">{course.duration}</p>
            <h1 className="text-headline-lg mt-3 max-w-3xl">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-body-default text-white/70">
              {course.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-semibold text-gold-light">
                {course.fee}
              </span>
              {course.nextBatch ? (
                <span className="rounded-full border border-white/15 px-4 py-2">
                  Next batch: {course.nextBatch}
                </span>
              ) : null}
              {course.instructor ? (
                <span className="rounded-full border border-white/15 px-4 py-2">
                  Instructor: {course.instructor}
                </span>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      {course.imageUrl ? (
        <section className="px-4 pb-12 sm:px-6 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal scale>
              <div className="overflow-hidden rounded-3xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.imageUrl}
                  alt=""
                  className="aspect-[21/9] w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl text-white">About this course</h2>
              <p className="mt-4 text-white/70 leading-relaxed">{course.description}</p>
            </Reveal>

            {course.syllabus.length > 0 ? (
              <Reveal delay={0.08}>
                <h3 className="mt-10 font-display text-xl text-white">Syllabus</h3>
                <ul className="mt-4 space-y-2">
                  {course.syllabus.map((item, i) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-white/75"
                    >
                      <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {course.highlights.length > 0 ? (
              <Reveal delay={0.12}>
                <h3 className="mt-10 font-display text-xl text-white">
                  What&apos;s included
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {course.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs text-gold-light"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <div id="apply" className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <CourseApplyForm courseId={course.id} courseTitle={course.title} />
            </Reveal>
            <p className="mt-4 text-center text-xs text-white/45">
              Questions?{" "}
              <Link href="/contact" className="text-gold hover:underline">
                Contact {site.name}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
