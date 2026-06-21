import { NextResponse } from "next/server";
import { getActiveOffers } from "@/lib/offers-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getActiveOffers());
}
