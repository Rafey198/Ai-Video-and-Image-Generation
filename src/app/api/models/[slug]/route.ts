import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { prisma } from "@/lib/db/prisma";
import { rateLimitByIp } from "@/lib/security/rate-limit";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const rateLimit = rateLimitByIp(request, "models:detail");
    if (!rateLimit.success) {
      return errorResponse("Too many requests", 429);
    }

    const { slug } = await context.params;

    const model = await prisma.aiModel.findUnique({
      where: { slug },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            healthy: true,
            enabled: true,
          },
        },
        capabilities: true,
      },
    });

    if (!model || !model.enabled) {
      return errorResponse("Model not found", 404);
    }

    return json({ model });
  } catch (error) {
    return handleApiError(error);
  }
}
