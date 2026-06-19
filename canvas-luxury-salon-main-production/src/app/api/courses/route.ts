import { NextResponse } from "next/server";
import { getActiveCourses } from "@/lib/courses-store";

export async function GET() {
  const courses = await getActiveCourses();
  return NextResponse.json(courses);
}
