import { JobStatus, MediaType } from "@prisma/client";
import { randomUUID } from "crypto";

import { SITE_CONFIG } from "@/config/site";
import type {
  GenerationOutput,
  GenerationRequest,
  ProviderAdapter,
  ProviderJobStatus,
  ProviderPollResult,
  ProviderSubmitResult,
} from "@/lib/ai/providers/types";

type MockJobRecord = {
  status: ProviderJobStatus;
  progress: number;
  createdAt: number;
  request: GenerationRequest;
  outputs?: GenerationOutput[];
  errorMessage?: string;
};

const MOCK_JOBS = new Map<string, MockJobRecord>();
const COMPLETION_DELAY_MS = 2_500;
const PROGRESS_INTERVAL_MS = 500;

function placeholderUrl(type: string, index = 0): string {
  const base = SITE_CONFIG.url.replace(/\/$/, "");
  const id = randomUUID();

  if (type === "video" || type.includes("video")) {
    return `${base}/placeholders/video-${id}.mp4`;
  }
  if (type === "audio" || type.includes("audio")) {
    return `${base}/placeholders/audio-${id}.mp3`;
  }
  return `${base}/placeholders/image-${id}-${index}.png`;
}

function inferMimeType(type: string): string {
  if (type === "video" || type.includes("video")) return "video/mp4";
  if (type === "audio" || type.includes("audio")) return "audio/mpeg";
  return "image/png";
}

function simulateProgress(jobId: string) {
  const record = MOCK_JOBS.get(jobId);
  if (!record || record.status === "canceled" || record.status === "failed") {
    return;
  }

  const elapsed = Date.now() - record.createdAt;
  const progress = Math.min(100, Math.floor((elapsed / COMPLETION_DELAY_MS) * 100));
  record.progress = progress;
  record.status = progress >= 100 ? "completed" : "processing";

  if (record.status === "completed") {
    const batchSize = Number(record.request.settings.batchSize ?? 1);
    const count = Math.max(1, Math.min(4, batchSize));
    record.outputs = Array.from({ length: count }, (_, index) => ({
      url: placeholderUrl(record.request.type, index),
      thumbnailUrl: placeholderUrl(record.request.type, index),
      mimeType: inferMimeType(record.request.type),
      width: 1024,
      height: 1024,
      duration:
        record.request.type.includes("video") || record.request.type.includes("audio")
          ? Number(record.request.settings.duration ?? 5)
          : undefined,
      metadata: { mock: true, provider: "mock" },
    }));
  }

  MOCK_JOBS.set(jobId, record);
}

export class MockProvider implements ProviderAdapter {
  readonly slug = "mock";

  async submit(request: GenerationRequest): Promise<ProviderSubmitResult> {
    const providerJobId = randomUUID();
    MOCK_JOBS.set(providerJobId, {
      status: "queued",
      progress: 0,
      createdAt: Date.now(),
      request,
    });

    setTimeout(() => simulateProgress(providerJobId), PROGRESS_INTERVAL_MS);
    const interval = setInterval(() => {
      simulateProgress(providerJobId);
      const record = MOCK_JOBS.get(providerJobId);
      if (!record || record.status === "completed" || record.status === "failed") {
        clearInterval(interval);
      }
    }, PROGRESS_INTERVAL_MS);

    return {
      providerJobId,
      status: "queued",
      estimatedSeconds: Math.ceil(COMPLETION_DELAY_MS / 1000),
    };
  }

  async poll(providerJobId: string): Promise<ProviderPollResult> {
    const record = MOCK_JOBS.get(providerJobId);
    if (!record) {
      return {
        status: "failed",
        errorMessage: "Mock job not found",
      };
    }

    simulateProgress(providerJobId);
    const updated = MOCK_JOBS.get(providerJobId)!;

    return {
      status: updated.status,
      progress: updated.progress,
      outputs: updated.outputs,
      errorMessage: updated.errorMessage,
    };
  }

  async cancel(providerJobId: string): Promise<void> {
    const record = MOCK_JOBS.get(providerJobId);
    if (!record) return;
    record.status = "canceled";
    MOCK_JOBS.set(providerJobId, record);
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
    if (type.includes("image")) return MediaType.image;
    return MediaType.other;
  }
}

export const mockProvider = new MockProvider();
