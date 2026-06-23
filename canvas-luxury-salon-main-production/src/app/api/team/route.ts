import { NextResponse } from "next/server";
import type { CmsTeamSection } from "@/lib/cms-types";
import { getActiveTeamMembers, getTeamSection } from "@/lib/team-store";

export async function GET() {
  const [members, section] = await Promise.all([
    getActiveTeamMembers(),
    getTeamSection(),
  ]);
  return NextResponse.json({ members, section } satisfies {
    members: Awaited<ReturnType<typeof getActiveTeamMembers>>;
    section: CmsTeamSection;
  });
}
