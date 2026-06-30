import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

import { isS3Configured } from "@/lib/config/env";
import { sanitizeFilename } from "./signed-url";
import type { StorageProvider, StorageUploadOptions } from "./index";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    });
  }
  return s3Client;
}

function getBucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error("S3_BUCKET is not configured");
  return bucket;
}

function resolveKey(options?: StorageUploadOptions): string {
  const folder = options?.folder?.replace(/^\/+|\/+$/g, "") ?? "media";
  const ext = extensionFromMime(options?.contentType ?? "");
  const rawName = options?.filename ?? `${randomUUID()}${ext}`;
  const filename = options?.filename ? sanitizeFilename(rawName) : rawName;
  const resolved = `${folder}/${filename}`.replace(/\/+/g, "/");
  if (resolved.includes("..")) throw new Error("Invalid storage path");
  return resolved;
}

function extensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "audio/mpeg": ".mp3",
    "application/pdf": ".pdf",
  };
  return map[mime] ?? "";
}

export class S3StorageProvider implements StorageProvider {
  async upload(
    buffer: Buffer,
    options?: StorageUploadOptions
  ): Promise<{ url: string; key: string }> {
    const key = resolveKey(options);
    const bucket = getBucket();

    await getS3Client().send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: options?.contentType ?? "application/octet-stream",
      })
    );

    return { key, url: await this.getSignedUrl(key, 3600) };
  }

  async delete(key: string): Promise<void> {
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key })
    );
  }

  getPublicUrl(key: string): string {
    const publicBase = process.env.S3_PUBLIC_URL?.replace(/\/$/, "");
    if (publicBase) {
      return `${publicBase}/${key.replace(/^\//, "")}`;
    }
    return key;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
    return getSignedUrl(getS3Client(), command, { expiresIn });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await getS3Client().send(
        new HeadObjectCommand({ Bucket: getBucket(), Key: key })
      );
      return true;
    } catch {
      return false;
    }
  }
}

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

  const storage = new S3StorageProvider();
  const result = await storage.upload(buffer, { ...options, contentType: mimeType });
  return { ...result, mimeType };
}

export async function checkS3Health(): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!isS3Configured()) {
    return { ok: false, message: "S3/R2 not configured" };
  }

  const start = Date.now();
  try {
    const provider = new S3StorageProvider();
    const testId = randomUUID();
    const { key } = await provider.upload(Buffer.from("vireomorph-healthcheck"), {
      folder: "_healthcheck",
      filename: `${testId}.txt`,
      contentType: "text/plain",
    });
    const exists = await provider.exists(key);
    await provider.delete(key);
    return {
      ok: exists,
      message: exists ? "R2 reachable" : "R2 upload check inconclusive",
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "R2 health check failed",
      latencyMs: Date.now() - start,
    };
  }
}
