import { retryJob } from "@/lib/ai/jobs";
import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;

    const job = await retryJob(id, session.user.id);
    return json({ job, message: "Job queued for retry" });
  } catch (error) {
    return handleApiError(error);
  }
}
