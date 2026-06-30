import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { calculateCreditCost } from "@/lib/credits/calculator";
import { prisma } from "@/lib/db/prisma";

const estimateSchema = z.object({
  modelSlug: z.string().trim().min(1),
  duration: z.number().min(0).optional(),
  resolution: z.string().optional(),
  batchSize: z.number().int().min(1).max(4).optional(),
});

export async function POST(request: Request) {
  try {
    await requireAuth();

    const body = await request.json();
    const data = estimateSchema.parse(body);

    const model = await prisma.aiModel.findUnique({
      where: { slug: data.modelSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        creditCostBase: true,
        creditCostPerSecond: true,
        enabled: true,
      },
    });

    if (!model || !model.enabled) {
      return errorResponse("Model not found or disabled", 404);
    }

    const estimatedCost = calculateCreditCost({
      model,
      durationSeconds: data.duration ?? 0,
      resolution: data.resolution,
      batchSize: data.batchSize ?? 1,
    });

    return json({
      modelSlug: model.slug,
      modelName: model.name,
      estimatedCost,
      breakdown: {
        base: model.creditCostBase,
        perSecond: model.creditCostPerSecond,
        duration: data.duration ?? 0,
        resolution: data.resolution ?? "720p",
        batchSize: data.batchSize ?? 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
