import { JobStatus, MediaType } from "@prisma/client";

import { isCustomWorkerConfigured } from "@/lib/config/env";
import type {
  GenerationRequest,
  ProviderAdapter,
  ProviderJobStatus,
  ProviderPollResult,
  ProviderSubmitResult,
} from "./types";

export class CustomWorkerProvider implements ProviderAdapter {
  readonly slug = "custom-worker";

  async submit(_request: GenerationRequest): Promise<ProviderSubmitResult> {
    if (!isCustomWorkerConfigured()) {
      throw new Error("Custom worker endpoint is not configured");
    }
    throw new Error("Custom worker provider adapter not yet implemented");
  }

  async poll(_providerJobId: string): Promise<ProviderPollResult> {
    return { status: "failed", errorMessage: "Custom worker not configured" };
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

export const customWorkerProvider = new CustomWorkerProvider();

export async function checkCustomWorkerHealth(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (!isCustomWorkerConfigured()) {
    return { ok: false, message: "Not configured" };
  }

  const endpoint = process.env.CUSTOM_WORKER_ENDPOINT!;
  const start = Date.now();
  try {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/health`, {
      headers: process.env.CUSTOM_WORKER_API_KEY
        ? { Authorization: `Bearer ${process.env.CUSTOM_WORKER_API_KEY}` }
        : {},
      signal: AbortSignal.timeout(5000),
    });
    return {
      ok: res.ok,
      message: res.ok ? "Worker reachable" : `Worker returned ${res.status}`,
    };
  } catch {
    return { ok: false, message: `Unreachable (${Date.now() - start}ms)` };
  }
}
