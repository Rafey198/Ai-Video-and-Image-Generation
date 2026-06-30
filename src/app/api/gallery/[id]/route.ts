import { Prisma, Visibility } from "@prisma/client";
import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const updateAssetSchema = z.object({
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  visibility: z.nativeEnum(Visibility).optional(),
  folderId: z.string().cuid().nullable().optional(),
  metadata: z.record(z.unknown()).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const asset = await prisma.mediaAsset.findFirst({
      where: { id, userId: session.user.id },
      include: {
        job: {
          select: {
            id: true,
            type: true,
            prompt: true,
            model: { select: { name: true, slug: true } },
          },
        },
        folder: { select: { id: true, name: true } },
      },
    });

    if (!asset) {
      return errorResponse("Asset not found", 404);
    }

    return json({ asset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const data = updateAssetSchema.parse(body);

    const existing = await prisma.mediaAsset.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Asset not found", 404);
    }

    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
        ...(data.folderId !== undefined ? { folderId: data.folderId } : {}),
        ...(data.metadata !== undefined ? { metadata: data.metadata as Prisma.InputJsonValue } : {}),
      } as Prisma.MediaAssetUpdateInput,
    });

    return json({ asset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.mediaAsset.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Asset not found", 404);
    }

    await prisma.mediaAsset.delete({ where: { id } });
    return json({ message: "Asset deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
