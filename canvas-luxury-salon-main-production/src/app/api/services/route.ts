import { NextResponse } from "next/server";
import { getActiveServices } from "@/lib/services-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const services = await getActiveServices();
  return NextResponse.json(services);
}
