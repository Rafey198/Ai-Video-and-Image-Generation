import { MediaType } from "@prisma/client";

import { FILE_LIMITS } from "@/config/site";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { generationRateLimit } from "@/lib/security/rate-limit";
import { getStorageProvider } from "@/lib/storage";
import { generationUploadSchema } from "@/lib/validation/generation";

function inferMediaType(mimeType: string): MediaType {
  if (FILE_LIMITS.allowedImageTypes.includes(mimeType)) return MediaType.image;
  if (FILE_LIMITS.allowedVideoTypes.includes(mimeType)) return MediaType.video;
  if (FILE_LIMITS.allowedAudioTypes.includes(mimeType)) return MediaType.audio;
  return MediaType.other;
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const rateLimit = generationRateLimit(`uploads:${session.user.id}`);
    if (!rateLimit.success) {
      return errorResponse("Upload rate limit exceeded", 429);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return errorResponse("No file provided", 400);
    }

    generationUploadSchema.parse({
      mimeType: file.type,
      fileSize: file.size,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageProvider();
    const { url, key } = await storage.upload(buffer, {
      contentType: file.type,
      folder: `users/${session.user.id}`,
      filename: file.name,
    });

    const mediaType = inferMediaType(file.type);

    const upload = await prisma.upload.create({
      data: {
        userId: session.user.id,
        filename: file.name,
        url,
        mimeType: file.type,
        fileSize: file.size,
        type: mediaType,
        metadata: { storageKey: key },
      },
    });

    return json({ upload, url, key }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
