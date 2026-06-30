import { randomUUID } from "crypto";
import path from "path";

/**
 * Sanitize user-provided filenames for storage keys.
 * Strips path segments and unsafe characters.
 */
export function sanitizeFilename(filename: string): string {
  const base = path.basename(filename).replace(/[^\w.\-]/g, "_");
  const ext = path.extname(base).slice(0, 12);
  const name = path.basename(base, ext).slice(0, 64) || "file";
  return `${name}-${randomUUID().slice(0, 8)}${ext}`;
}

/**
 * Generate a signed URL for private media access.
 * Local dev returns a time-limited token query param placeholder.
 * Production should use S3/R2 presigned URLs.
 */
export function getSignedMediaUrl(
  storageKey: string,
  expiresInSeconds = 3600
): string {
  const storage = process.env.STORAGE_PROVIDER ?? "local";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (storage === "s3" && process.env.S3_PUBLIC_URL) {
    // Real presigned URL generation would go here via AWS SDK
    const publicBase = process.env.S3_PUBLIC_URL.replace(/\/$/, "");
    return `${publicBase}/${storageKey.replace(/^\//, "")}`;
  }

  const expires = Date.now() + expiresInSeconds * 1000;
  const token = Buffer.from(`${storageKey}:${expires}`).toString("base64url");
  return `${baseUrl}/api/media/${encodeURIComponent(storageKey)}?token=${token}&expires=${expires}`;
}
