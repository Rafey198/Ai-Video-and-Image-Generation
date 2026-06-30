import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { prisma } from "@/lib/db/prisma";
import { rateLimitByIp } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  try {
    const rateLimit = rateLimitByIp(request, "models:list");
    if (!rateLimit.success) {
      return errorResponse("Too many requests", 429);
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const taskType = searchParams.get("taskType") ?? undefined;
    const enabledParam = searchParams.get("enabled");
    const featured = searchParams.get("featured");

    const enabled =
      enabledParam === null
        ? true
        : enabledParam === "true"
          ? true
          : enabledParam === "false"
            ? false
            : undefined;

    const models = await prisma.aiModel.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(taskType ? { taskType } : {}),
        ...(enabled !== undefined ? { enabled } : {}),
        ...(featured === "true" ? { featured: true } : {}),
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            healthy: true,
          },
        },
        capabilities: true,
      },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return json({ models, count: models.length });
  } catch (error) {
    return handleApiError(error);
  }
}
