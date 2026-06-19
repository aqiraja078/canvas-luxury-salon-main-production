export const COURSE_APPLICATION_LIMITS = {
  name: 120,
  email: 254,
  phone: 32,
  age: 8,
  city: 80,
  message: 2000,
} as const;

type ValidBody = {
  courseId: string;
  name: string;
  email: string;
  phone: string;
  age?: string;
  city?: string;
  message?: string;
};

function trimField(value: unknown, max: number): string {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCourseApplicationBody(
  parsed: unknown
):
  | { ok: true; data: ValidBody }
  | { ok: false; error: string; status: number } {
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "Invalid request body.", status: 400 };
  }

  const body = parsed as Record<string, unknown>;
  const courseId = trimField(body.courseId, 64);
  const name = trimField(body.name, COURSE_APPLICATION_LIMITS.name);
  const email = trimField(body.email, COURSE_APPLICATION_LIMITS.email);
  const phone = trimField(body.phone, COURSE_APPLICATION_LIMITS.phone);
  const age = trimField(body.age, COURSE_APPLICATION_LIMITS.age);
  const city = trimField(body.city, COURSE_APPLICATION_LIMITS.city);
  const message = trimField(body.message, COURSE_APPLICATION_LIMITS.message);

  if (!courseId) {
    return { ok: false, error: "Please select a course.", status: 400 };
  }
  if (!name) {
    return { ok: false, error: "Name is required.", status: 400 };
  }
  if (!email || !isValidEmail(email)) {
    return { ok: false, error: "A valid email is required.", status: 400 };
  }
  if (!phone || phone.length < 7) {
    return { ok: false, error: "A valid phone number is required.", status: 400 };
  }

  return {
    ok: true,
    data: {
      courseId,
      name,
      email,
      phone,
      age: age || undefined,
      city: city || undefined,
      message: message || undefined,
    },
  };
}
