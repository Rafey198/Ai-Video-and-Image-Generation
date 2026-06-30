import { cancelJob } from "@/lib/ai/jobs";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const job = await prisma.generationJob.findFirst({
      where: { id, userId: session.user.id },
      include: {
        model: {
          select: { id: true, name: true, slug: true, category: true, taskType: true },
        },
        mediaAssets: true,
        generationSettings: true,
      },
    });

    if (!job) {
      return errorResponse("Job not found", 404);
    }

    return json({ job });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const job = await cancelJob(id, session.user.id);
    return json({ job, message: "Job canceled" });
  } catch (error) {
    return handleApiError(error);
  }
}
