import { checkComfyUiHealth } from "@/lib/ai/providers/comfyui";
import { checkCustomWorkerHealth } from "@/lib/ai/providers/custom-worker";
import { checkHuggingFaceHealth } from "@/lib/ai/providers/huggingface";
import { checkReplicateHealth } from "@/lib/ai/providers/replicate";
import { checkOpenAiHealth } from "@/lib/ai/openai";
import { handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { getDemoMode } from "@/lib/config/runtime";
import {
  isGoogleOAuthConfigured,
  isRedisConfigured,
  isStripeConfigured,
} from "@/lib/config/env";
import { isDatabaseConfigured } from "@/lib/db/safe-query";
import { prisma } from "@/lib/db/prisma";
import { getQueueStatus } from "@/lib/queue";
import { checkS3Health } from "@/lib/storage/s3";

export async function GET() {
  try {
    await requireAdmin();

    const [database, storage, openai, replicate, huggingface, comfyui, worker] =
      await Promise.all([
        checkDatabaseHealth(),
        checkS3Health(),
        checkOpenAiHealth(),
        checkReplicateHealth(),
        checkHuggingFaceHealth(),
        checkComfyUiHealth(),
        checkCustomWorkerHealth(),
      ]);

    const queue = getQueueStatus();
    const demoMode = await getDemoMode();

    return json({
      checkedAt: new Date().toISOString(),
      demoMode,
      services: {
        neon: database,
        r2: storage,
        openai,
        replicate,
        huggingface,
        redis: {
          ok: isRedisConfigured(),
          message: isRedisConfigured()
            ? "REDIS_URL set (BullMQ worker not wired)"
            : "Skipped — not configured",
          mode: queue.mode,
          pending: queue.pending,
        },
        stripe: {
          ok: false,
          message: isStripeConfigured()
            ? "Stripe keys present but checkout disabled"
            : "Skipped — payments not configured yet",
        },
        googleOAuth: {
          ok: isGoogleOAuthConfigured(),
          message: isGoogleOAuthConfigured()
            ? "Google OAuth credentials configured"
            : "Not configured",
        },
        comfyui,
        customWorker: worker,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function checkDatabaseHealth(): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!isDatabaseConfigured()) {
    return { ok: false, message: "DATABASE_URL not configured" };
  }

  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, message: "Neon PostgreSQL connected", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Database connection failed",
      latencyMs: Date.now() - start,
    };
  }
}
