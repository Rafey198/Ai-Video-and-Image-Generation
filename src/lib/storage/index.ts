import { randomUUID } from "crypto";
import { mkdir, writeFile, unlink, readFile } from "fs/promises";
import path from "path";

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
    const filename = options?.filename ?? `${randomUUID()}${ext}`;
    return path.posix.join(folder, filename);
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
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
      "application/zip": ".zip",
      "image/svg+xml": ".svg",
      "application/json": ".json",
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

export class S3StorageProvider implements StorageProvider {
  constructor(
    private readonly config: {
      endpoint?: string;
      bucket: string;
      region?: string;
      publicUrl?: string;
    }
  ) {}

  async upload(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _buffer: Buffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options?: StorageUploadOptions
  ): Promise<{ url: string; key: string }> {
    throw new Error(
      "S3StorageProvider is not yet implemented. Configure STORAGE_PROVIDER=local or implement S3 upload."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_key: string): Promise<void> {
    throw new Error("S3StorageProvider delete is not yet implemented.");
  }

  getPublicUrl(key: string): string {
    const base =
      this.config.publicUrl ??
      `https://${this.config.bucket}.s3.${this.config.region ?? "us-east-1"}.amazonaws.com`;
    return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exists(_key: string): Promise<boolean> {
    throw new Error("S3StorageProvider exists check is not yet implemented.");
  }
}

let cachedProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const provider = process.env.STORAGE_PROVIDER ?? "local";

  if (provider === "s3") {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error("S3_BUCKET is required when STORAGE_PROVIDER=s3");
    }

    cachedProvider = new S3StorageProvider({
      endpoint: process.env.S3_ENDPOINT,
      bucket,
      region: process.env.S3_REGION,
      publicUrl: process.env.S3_PUBLIC_URL,
    });
    return cachedProvider;
  }

  cachedProvider = new LocalStorageProvider();
  return cachedProvider;
}
