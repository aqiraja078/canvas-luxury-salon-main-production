import { NextResponse } from "next/server";
import { getActiveTeamMembers } from "@/lib/team-store";

export async function GET() {
  return NextResponse.json(await getActiveTeamMembers());
}
