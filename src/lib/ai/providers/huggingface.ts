import { JobStatus, MediaType } from "@prisma/client";

import { isHuggingFaceConfigured } from "@/lib/config/env";
import type {
  GenerationRequest,
  ProviderAdapter,
  ProviderJobStatus,
  ProviderPollResult,
  ProviderSubmitResult,
} from "./types";

/**
 * Hugging Face provider — health check only.
 * Inference requires explicit per-model HF_INFERENCE_MODEL_* env configuration.
 */
export class HuggingFaceProvider implements ProviderAdapter {
  readonly slug = "huggingface";

  async submit(_request: GenerationRequest): Promise<ProviderSubmitResult> {
    throw new Error(
      "Hugging Face inference is disabled by default. Configure explicit model env vars before enabling paid inference."
    );
  }

  async poll(_providerJobId: string): Promise<ProviderPollResult> {
    return { status: "failed", errorMessage: "Hugging Face inference not configured" };
  }

  async cancel(): Promise<void> {
    // no-op
  }

  mapStatus(status: ProviderJobStatus): JobStatus {
    const map: Record<ProviderJobStatus, JobStatus> = {
      queued: JobStatus.queued,
      processing: JobStatus.processing,
      completed: JobStatus.completed,
      failed: JobStatus.failed,
      canceled: JobStatus.canceled,
    };
    return map[status];
  }

  inferMediaType(type: string): MediaType {
    if (type.includes("video")) return MediaType.video;
    if (type.includes("audio")) return MediaType.audio;
    return MediaType.image;
  }
}

export const huggingFaceProvider = new HuggingFaceProvider();

export async function checkHuggingFaceHealth(): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!isHuggingFaceConfigured()) {
    return { ok: false, message: "HUGGINGFACE_API_KEY not configured" };
  }

  const start = Date.now();
  try {
    const res = await fetch("https://huggingface.co/api/whoami-v2", {
      headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
    });

    if (!res.ok) {
      return {
        ok: false,
        message: `Hugging Face auth failed (${res.status})`,
        latencyMs: Date.now() - start,
      };
    }

    return {
      ok: true,
      message: "Hugging Face API key valid (inference disabled by default)",
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Hugging Face health check failed",
      latencyMs: Date.now() - start,
    };
  }
}
