import { NextResponse } from "next/server";
import { getActiveServices } from "@/lib/services-store";

export async function GET() {
  const services = await getActiveServices();
  return NextResponse.json(services);
}
