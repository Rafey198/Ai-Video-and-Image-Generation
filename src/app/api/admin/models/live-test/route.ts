import { z } from "zod";

import { listModelsForLiveTest, testModelLive } from "@/lib/ai/model-test-runner";
import { handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { getDemoMode } from "@/lib/config/runtime";
import { isReplicateConfigured } from "@/lib/config/env";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const testBodySchema = z.object({
  modelSlug: z.string().min(1),
  prompt: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? "all";
    const demoMode = await getDemoMode();

    const models = await listModelsForLiveTest(category === "all" ? undefined : category);
    const mappedCount = models.filter((m) => m.mapped).length;

    return json({
      models,
      summary: {
        total: models.length,
        mapped: mappedCount,
        unmapped: models.length - mappedCount,
        demoMode,
        replicateConfigured: isReplicateConfigured(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = testBodySchema.parse(await request.json());

    const result = await testModelLive(session.user.id, body.modelSlug, body.prompt);
    return json({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
