import { NextResponse } from "next/server";
import { addCourseApplication } from "@/lib/course-applications-store";
import { validateCourseApplicationBody } from "@/lib/course-application-validation";
import { getCourses } from "@/lib/courses-store";
import { clientIpFromRequest, rateLimitBooking } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request);
  const limited = rateLimitBooking(`course-apply:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let parsed: unknown;
  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const checked = validateCourseApplicationBody(parsed);
  if (!checked.ok) {
    return NextResponse.json(
      { error: checked.error },
      { status: checked.status }
    );
  }

  const courses = await getCourses();
  const course = courses.find(
    (c) => c.id === checked.data.courseId && c.active
  );
  if (!course) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  try {
    const application = await addCourseApplication({
      courseId: course.id,
      courseSlug: course.slug,
      courseTitle: course.title,
      courseFee: course.fee,
      courseDuration: course.duration,
      courseInstructor: course.instructor,
      courseNextBatch: course.nextBatch,
      courseShortDescription: course.shortDescription,
      name: checked.data.name,
      email: checked.data.email,
      phone: checked.data.phone,
      age: checked.data.age,
      city: checked.data.city,
      message: checked.data.message,
    });
    return NextResponse.json({ ok: true, id: application.id });
  } catch (err) {
    console.error(
      "Course application save failed:",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      { error: "Could not save application." },
      { status: 500 }
    );
  }
}
