import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink, readFile } from "fs/promises";
import path from "path";

import { isS3Configured } from "@/lib/config/env";
import { S3StorageProvider } from "./s3";
import { sanitizeFilename } from "./signed-url";

export interface StorageUploadOptions {
  contentType?: string;
  folder?: string;
  filename?: string;
}

export interface StorageProvider {
  upload(
    buffer: Buffer,
    options?: StorageUploadOptions
  ): Promise<{ url: string; key: string }>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  exists(key: string): Promise<boolean>;
}

const LOCAL_UPLOAD_DIR =
  process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");

export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly baseUrl = "/uploads") {}

  private resolveKey(options?: StorageUploadOptions): string {
    const folder = options?.folder?.replace(/^\/+|\/+$/g, "") ?? "media";
    const ext = options?.contentType
      ? this.extensionFromMime(options.contentType)
      : "";
    const rawName = options?.filename ?? `${randomUUID()}${ext}`;
    const filename = options?.filename ? sanitizeFilename(rawName) : rawName;
    const resolved = path.posix.join(folder, filename);
    if (resolved.includes("..")) {
      throw new Error("Invalid storage path");
    }
    return resolved;
  }

  private extensionFromMime(mime: string): string {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "audio/mpeg": ".mp3",
      "audio/wav": ".wav",
      "application/pdf": ".pdf",
      "image/svg+xml": ".svg",
    };
    return map[mime] ?? "";
  }

  async upload(
    buffer: Buffer,
    options?: StorageUploadOptions
  ): Promise<{ url: string; key: string }> {
    const key = this.resolveKey(options);
    const absolutePath = path.join(LOCAL_UPLOAD_DIR, ...key.split("/"));
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, buffer);
    return { key, url: this.getPublicUrl(key) };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = path.join(LOCAL_UPLOAD_DIR, ...key.split("/"));
    try {
      await unlink(absolutePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  getPublicUrl(key: string): string {
    const normalized = key.replace(/^\/+/, "");
    return `${this.baseUrl}/${normalized}`;
  }

  async exists(key: string): Promise<boolean> {
    const absolutePath = path.join(LOCAL_UPLOAD_DIR, ...key.split("/"));
    try {
      await readFile(absolutePath);
      return true;
    } catch {
      return false;
    }
  }
}

let cachedProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "s3") {
    if (!isS3Configured()) {
      throw new Error("S3 storage selected but required S3_* environment variables are missing");
    }
    cachedProvider = new S3StorageProvider();
    return cachedProvider;
  }

  cachedProvider = new LocalStorageProvider();
  return cachedProvider;
}

export { S3StorageProvider } from "./s3";

/** Download a provider URL and persist to storage; falls back to the remote URL when S3 is unavailable. */
export async function uploadRemoteUrlToStorage(
  remoteUrl: string,
  options: StorageUploadOptions & { folder: string }
): Promise<{ url: string; key: string; mimeType: string }> {
  const response = await fetch(remoteUrl);
  if (!response.ok) {
    throw new Error(`Failed to download remote asset: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const mimeType =
    response.headers.get("content-type") ??
    options.contentType ??
    "application/octet-stream";

  if (!isS3Configured()) {
    return {
      url: remoteUrl,
      key: `${options.folder}/${randomUUID()}`,
      mimeType,
    };
  }

  try {
    const storage = getStorageProvider();
    const result = await storage.upload(buffer, { ...options, contentType: mimeType });
    return { ...result, mimeType };
  } catch (error) {
    console.warn("[storage] Persist failed, using provider URL:", error);
    return {
      url: remoteUrl,
      key: `${options.folder}/${randomUUID()}`,
      mimeType,
    };
  }
}
