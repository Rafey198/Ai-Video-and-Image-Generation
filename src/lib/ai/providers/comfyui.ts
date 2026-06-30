import { JobStatus, MediaType } from "@prisma/client";

import { isComfyUiConfigured } from "@/lib/config/env";
import type {
  GenerationRequest,
  ProviderAdapter,
  ProviderJobStatus,
  ProviderPollResult,
  ProviderSubmitResult,
} from "./types";

export class ComfyUIProvider implements ProviderAdapter {
  readonly slug = "comfyui";

  async submit(_request: GenerationRequest): Promise<ProviderSubmitResult> {
    if (!isComfyUiConfigured()) {
      throw new Error("ComfyUI endpoint is not configured");
    }
    throw new Error("ComfyUI provider adapter not yet implemented");
  }

  async poll(_providerJobId: string): Promise<ProviderPollResult> {
    return { status: "failed", errorMessage: "ComfyUI not configured" };
  }

  async cancel(): Promise<void> {}

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

export const comfyUIProvider = new ComfyUIProvider();

export async function checkComfyUiHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!isComfyUiConfigured()) {
    return { ok: false, message: "Not configured" };
  }
  return { ok: false, message: "Endpoint set but adapter not wired" };
}
