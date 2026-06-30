import { MediaType, Prisma, Visibility } from "@prisma/client";
import { z } from "zod";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const createAssetSchema = z.object({
  type: z.nativeEnum(MediaType),
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().positive().optional(),
  visibility: z.nativeEnum(Visibility).default(Visibility.private),
  folderId: z.string().cuid().optional(),
  jobId: z.string().cuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") as MediaType | null;
    const visibility = searchParams.get("visibility") as Visibility | null;
    const folderId = searchParams.get("folderId") ?? undefined;
    const limit = Math.min(Number(searchParams.get("limit") ?? 24), 100);
    const offset = Number(searchParams.get("offset") ?? 0);

    const where = {
      userId: session.user.id,
      ...(type && Object.values(MediaType).includes(type) ? { type } : {}),
      ...(visibility && Object.values(Visibility).includes(visibility)
        ? { visibility }
        : {}),
      ...(folderId ? { folderId } : {}),
    };

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          job: {
            select: { id: true, type: true, modelId: true },
          },
        },
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return json({ assets, total, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = createAssetSchema.parse(body);

    const asset = await prisma.mediaAsset.create({
      data: {
        userId: session.user.id,
        type: data.type,
        title: data.title,
        description: data.description,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        width: data.width,
        height: data.height,
        duration: data.duration,
        visibility: data.visibility,
        folderId: data.folderId,
        jobId: data.jobId,
        metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });

    return json({ asset }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
