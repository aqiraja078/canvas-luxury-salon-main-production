import { NextResponse } from "next/server";
import {
  adminCookieName,
  createSessionToken,
} from "@/lib/admin-session";
import { authenticateAdmin } from "@/lib/users-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const auth = await authenticateAdmin(
      body.username ?? "",
      body.password ?? ""
    );
    if (!auth) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    const token = createSessionToken(auth);
    const res = NextResponse.json({ ok: true, user: auth });
    const url = new URL(request.url);
    const forwarded = request.headers.get("x-forwarded-proto");
    const forceInsecure =
      process.env.ADMIN_COOKIE_INSECURE === "1" ||
      process.env.ADMIN_COOKIE_INSECURE === "true";
    const secureCookie =
      !forceInsecure &&
      (forwarded === "https" || url.protocol === "https:");
    res.cookies.set(adminCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
