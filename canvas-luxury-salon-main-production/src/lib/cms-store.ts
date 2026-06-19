import { getStore } from "@netlify/blobs";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const CMS_STORE_NAME = "cms";

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function getCmsBlobStore() {
  try {
    return await getStore(CMS_STORE_NAME);
  } catch {
    return null;
  }
}

function localFileForKey(key: string) {
  return path.join(DATA_DIR, `${key}.json`);
}

export async function readCmsJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const store = await getCmsBlobStore();
    if (store) {
      try {
        const data = await store.get(key, { type: "json" });
        if (data !== null && data !== undefined) return data as T;
      } catch (err) {
        console.error(`[cms-store] blob read failed for ${key}:`, err);
      }
    }

    await ensureDataDir();
    const raw = await fs.readFile(localFileForKey(key), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeCmsJson<T>(key: string, value: T): Promise<void> {
  const store = await getCmsBlobStore();
  const serialized = JSON.stringify(value, null, 2);

  if (store) {
    await store.set(key, serialized);
  }

  await ensureDataDir();
  await fs.writeFile(localFileForKey(key), serialized, "utf-8");
}
