import { processJob } from "@/lib/ai/jobs";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.generationJob.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Job not found", 404);
    }

    const job = await processJob(id);

    const mediaAssets = await prisma.mediaAsset.findMany({
      where: { jobId: id },
      select: {
        id: true,
        type: true,
        url: true,
        thumbnailUrl: true,
        mimeType: true,
        width: true,
        height: true,
        duration: true,
      },
    });

    return json({
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        errorMessage: job.errorMessage,
        completedAt: job.completedAt,
        startedAt: job.startedAt,
      },
      mediaAssets,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
