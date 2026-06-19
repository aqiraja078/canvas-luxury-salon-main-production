import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { CourseCard } from "@/components/courses/CourseCard";
import { getActiveCourses } from "@/lib/courses-store";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Beauty Courses & Academy",
  description: `Professional beauty courses at ${site.name} — makeup, bridal, hair & mehndi training in Jhelum region.`,
};

export default async function CoursesPage() {
  const courses = await getActiveCourses();

  return (
    <div className="pt-24 sm:pt-28">
      <section className="relative overflow-hidden px-4 pb-12 sm:px-6 md:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(201,169,98,0.12),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="text-caption-golden">Huma Academy</p>
            <h1 className="text-headline-lg mt-3 max-w-3xl">
              Learn beauty with us
            </h1>
            <p className="mt-5 max-w-2xl text-body-default text-white/70">
              Professional makeup, bridal, hair styling, and mehndi courses — small
              batches with hands-on practice. Apply online; we share fee and batch
              details with you personally (no online payment).
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Our courses
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/55">
              {courses.length} programme{courses.length === 1 ? "" : "s"} — same
              premium training, tailored to your goals.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, idx) => (
              <Reveal key={c.id} delay={idx * 0.06} scale>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
