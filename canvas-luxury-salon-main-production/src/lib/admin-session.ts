import { createHmac, timingSafeEqual } from "crypto";
import type { AdminRole } from "@/lib/cms-types";

const COOKIE = "salon_admin_session";

export type SessionPayload = {
  exp: number;
  userId: string;
  role: AdminRole;
  name: string;
  username: string;
};

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "huma-dev-secret-change-in-production";
}

function signPayload(payloadObj: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify(payloadObj), "utf-8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function createSessionToken(user?: {
  userId: string;
  role: AdminRole;
  name: string;
  username: string;
}): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  if (user) {
    return signPayload({ exp, ...user });
  }
  return signPayload({
    exp,
    userId: "legacy",
    role: "owner",
    name: "Owner",
    username: getAdminUsername(),
  });
}

export function parseSessionToken(
  token: string | undefined
): SessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as Partial<SessionPayload>;
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return null;
    return {
      exp: data.exp,
      userId: data.userId || "legacy",
      role: data.role || "owner",
      name: data.name || "Owner",
      username: data.username || getAdminUsername(),
    };
  } catch {
    return null;
  }
}

export function verifySessionToken(token: string | undefined): boolean {
  return parseSessionToken(token) !== null;
}

export function getAdminUsername(): string {
  const fromEnv = process.env.ADMIN_USERNAME?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : "huma-admin";
}

/** Usernames that may sign in (configured + legacy so .env / form mismatch does not lock you out). */
function acceptedAdminUsernames(): string[] {
  const primary = getAdminUsername();
  return Array.from(new Set([primary, "huma-admin", "canvas-admin"]));
}

export function verifyAdminUsername(username: string): boolean {
  const input = username.normalize("NFKC").trim();
  for (const candidate of acceptedAdminUsernames()) {
    const exp = candidate.normalize("NFKC");
    if (input.length !== exp.length) continue;
    try {
      if (
        timingSafeEqual(
          Buffer.from(input, "utf-8"),
          Buffer.from(exp, "utf-8")
        )
      ) {
        return true;
      }
    } catch {
      /* continue */
    }
  }
  return false;
}

/**
 * If ADMIN_PASSWORD is set in env, only that value works (use quotes in .env for @ ! #).
 * If unset, either built-in default works: HumaAdmin@123! or legacy CanvasAdmin@123!
 */
export function verifyAdminPassword(password: string): boolean {
  const fromEnv = process.env.ADMIN_PASSWORD?.replace(/^\uFEFF/, "").trim();
  const candidates =
    fromEnv && fromEnv.length > 0
      ? [fromEnv]
      : ["HumaAdmin@123!", "CanvasAdmin@123!"];

  const input = password.normalize("NFKC").trim();
  for (const raw of candidates) {
    const exp = raw.normalize("NFKC");
    if (input.length !== exp.length) continue;
    try {
      if (
        timingSafeEqual(
          Buffer.from(input, "utf-8"),
          Buffer.from(exp, "utf-8")
        )
      ) {
        return true;
      }
    } catch {
      /* continue */
    }
  }
  return false;
}

export const adminCookieName = COOKIE;

// 2FA related
export const admin2faCookieName = "salon_admin_2fa";

function get2FASecret(): string {
  return process.env.ADMIN_2FA_SECRET || "huma-2fa-secret-change-in-production";
}

export function createTwoFactorToken(): string {
  const exp = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = Buffer.from(JSON.stringify({ exp }), "utf-8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", get2FASecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyTwoFactorToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", get2FASecret())
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { exp: number };
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

// Simple OTP for demo, in production use proper OTP library
const OTP_STORE = new Map<string, { otp: string; exp: number }>();

export function generateAdminOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  const exp = Date.now() + 5 * 60 * 1000; // 5 minutes
  OTP_STORE.set("admin", { otp, exp });
  return otp;
}

export function verifyAdminOtp(otp: string): boolean {
  const entry = OTP_STORE.get("admin");
  if (!entry || entry.exp < Date.now()) return false;
  if (entry.otp === otp) {
    OTP_STORE.delete("admin");
    return true;
  }
  return false;
}
