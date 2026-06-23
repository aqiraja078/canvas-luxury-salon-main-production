import { NextResponse } from "next/server";
import { getActiveBlogPosts, getBlogPage } from "@/lib/blog-store";

export async function GET() {
  const [posts, page] = await Promise.all([getActiveBlogPosts(), getBlogPage()]);
  return NextResponse.json({ posts, page });
}
