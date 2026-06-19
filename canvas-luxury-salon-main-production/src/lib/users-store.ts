import { randomBytes, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { readCmsJson, writeCmsJson } from "@/lib/cms-store";
import type { AdminRole, CmsAdminUser } from "@/lib/cms-types";
import {
  getAdminUsername,
  verifyAdminPassword,
  verifyAdminUsername,
} from "@/lib/admin-session";
import { hashPassword, verifyPassword } from "@/lib/password";

const KEY = "users";
const ENV_OWNER_ID = "env-owner";
const CREDENTIALS_FILE = path.resolve(process.cwd(), "data/admin-credentials.txt");

const DEFAULT_ACCOUNTS: Array<{
  username: string;
  role: AdminRole;
  name: string;
  passPrefix: string;
}> = [
  { username: "huma.owner", role: "owner", name: "Huma Owner", passPrefix: "Own" },
  {
    username: "huma.reception",
    role: "reception",
    name: "Reception Desk",
    passPrefix: "Rec",
  },
  {
    username: "huma.contact",
    role: "contact",
    name: "Contact Admin",
    passPrefix: "Cnt",
  },
];

function generateUniquePassword(prefix: string): string {
  return `${prefix}${randomBytes(9).toString("base64url")}!`;
}

async function writeCredentialsFile(
  creds: Array<{ username: string; password: string; role: AdminRole }>
) {
  const ts = new Date().toISOString();
  const body = [
    "Huma Beauty Saloon — Admin logins (keep private)",
    `Generated: ${ts}`,
    "",
    ...creds.map((c) => `${c.username} / ${c.password}  (${c.role})`),
    "",
    "Login: /admin/login",
    "",
  ].join("\n");
  await fs.mkdir(path.dirname(CREDENTIALS_FILE), { recursive: true });
  await fs.writeFile(CREDENTIALS_FILE, body, "utf-8");
}

async function ensureSeeded() {
  const list = await readCmsJson<CmsAdminUser[]>(KEY, []);
  if (list.length > 0) return;

  const ts = new Date().toISOString();
  const creds: Array<{ username: string; password: string; role: AdminRole }> =
    [];

  const seed: CmsAdminUser[] = DEFAULT_ACCOUNTS.map((account) => {
    const password = generateUniquePassword(account.passPrefix);
    creds.push({
      username: account.username,
      password,
      role: account.role,
    });
    return {
      id: randomUUID(),
      username: account.username,
      passwordHash: hashPassword(password),
      role: account.role,
      name: account.name,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    };
  });

  await writeCmsJson(KEY, seed);
  await writeCredentialsFile(creds);
}

export async function getAdminUsers(): Promise<CmsAdminUser[]> {
  await ensureSeeded();
  return readCmsJson<CmsAdminUser[]>(KEY, []);
}

export async function saveAdminUsers(users: CmsAdminUser[]): Promise<void> {
  await writeCmsJson(KEY, users);
}

export type AuthResult = {
  userId: string;
  username: string;
  role: AdminRole;
  name: string;
};

export async function authenticateAdmin(
  username: string,
  password: string
): Promise<AuthResult | null> {
  await ensureSeeded();
  const users = await getAdminUsers();
  const normalized = username.normalize("NFKC").trim();

  const dbUser = users.find(
    (u) =>
      u.active &&
      u.username.normalize("NFKC").trim() === normalized &&
      verifyPassword(password, u.passwordHash)
  );
  if (dbUser) {
    return {
      userId: dbUser.id,
      username: dbUser.username,
      role: dbUser.role,
      name: dbUser.name,
    };
  }

  if (verifyAdminUsername(username) && verifyAdminPassword(password)) {
    return {
      userId: ENV_OWNER_ID,
      username: getAdminUsername(),
      role: "owner",
      name: "Owner",
    };
  }

  return null;
}

export async function getAdminUserById(
  userId: string
): Promise<AuthResult | null> {
  if (userId === ENV_OWNER_ID) {
    return {
      userId: ENV_OWNER_ID,
      username: getAdminUsername(),
      role: "owner",
      name: "Owner",
    };
  }
  const users = await getAdminUsers();
  const user = users.find((u) => u.id === userId && u.active);
  if (!user) return null;
  return {
    userId: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
  };
}

export async function createAdminUser(input: {
  username: string;
  password: string;
  role: AdminRole;
  name: string;
  email?: string;
}): Promise<CmsAdminUser> {
  const users = await getAdminUsers();
  const exists = users.some(
    (u) =>
      u.username.normalize("NFKC").trim() ===
      input.username.normalize("NFKC").trim()
  );
  if (exists) throw new Error("Username already exists.");
  const ts = new Date().toISOString();
  const user: CmsAdminUser = {
    id: randomUUID(),
    username: input.username.trim(),
    passwordHash: hashPassword(input.password),
    role: input.role,
    name: input.name.trim(),
    email: input.email?.trim(),
    active: true,
    createdAt: ts,
    updatedAt: ts,
  };
  users.push(user);
  await saveAdminUsers(users);
  return user;
}

export async function updateAdminUser(
  id: string,
  patch: {
    username?: string;
    password?: string;
    role?: AdminRole;
    name?: string;
    email?: string;
    active?: boolean;
  }
): Promise<CmsAdminUser | null> {
  const users = await getAdminUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  if (patch.username) {
    const taken = users.some(
      (u, i) =>
        i !== idx &&
        u.username.normalize("NFKC").trim() ===
          patch.username!.normalize("NFKC").trim()
    );
    if (taken) throw new Error("Username already exists.");
    users[idx].username = patch.username.trim();
  }
  if (patch.password) {
    users[idx].passwordHash = hashPassword(patch.password);
  }
  if (patch.role) users[idx].role = patch.role;
  if (patch.name) users[idx].name = patch.name.trim();
  if (patch.email !== undefined) users[idx].email = patch.email?.trim();
  if (patch.active !== undefined) users[idx].active = patch.active;
  users[idx].updatedAt = new Date().toISOString();

  await saveAdminUsers(users);
  return users[idx];
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const users = await getAdminUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  await saveAdminUsers(next);
  return true;
}

export function sanitizeAdminUser(user: CmsAdminUser) {
  const { passwordHash: _, ...safe } = user;
  void _;
  return safe;
}
