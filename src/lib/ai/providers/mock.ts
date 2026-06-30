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

const COMPLETION_DELAY_MS = 2_000;

const PLACEHOLDER_ASSETS = {
  image: "/placeholders/image-placeholder.svg",
  video: "/placeholders/video-placeholder.svg",
  audio: "/placeholders/audio-placeholder.svg",
} as const;

function placeholderUrl(type: string): string {
  if (type.includes("video")) return PLACEHOLDER_ASSETS.video;
  if (type.includes("audio")) return PLACEHOLDER_ASSETS.audio;
  return PLACEHOLDER_ASSETS.image;
}

function inferMimeType(type: string): string {
  if (type.includes("video")) return "video/mp4";
  if (type.includes("audio")) return "audio/mpeg";
  return "image/svg+xml";
}

function buildOutputs(request: GenerationRequest): GenerationOutput[] {
  const batchSize = Number(request.settings.batchSize ?? 1);
  const count = Math.max(1, Math.min(4, batchSize));
  const url = placeholderUrl(request.type);

  return Array.from({ length: count }, () => ({
    url,
    thumbnailUrl: url,
    mimeType: inferMimeType(request.type),
    width: 1024,
    height: 1024,
    duration:
      request.type.includes("video") || request.type.includes("audio")
        ? Number(request.settings.duration ?? 5)
        : undefined,
    metadata: { mock: true, provider: "mock", demo: SITE_CONFIG.demoMode },
  }));
}

/** Stateless mock — encodes submit timestamp in providerJobId for serverless compatibility. */
function parseMockTimestamp(providerJobId: string): number {
  const match = providerJobId.match(/^mock-(\d+)-/);
  return match ? Number(match[1]) : Date.now();
}

function statelessPoll(
  providerJobId: string,
  request?: GenerationRequest
): ProviderPollResult {
  const startedAt = parseMockTimestamp(providerJobId);
  const elapsed = Date.now() - startedAt;
  const progress = Math.min(100, Math.floor((elapsed / COMPLETION_DELAY_MS) * 100));

  if (progress >= 100) {
    return {
      status: "completed",
      progress: 100,
      outputs: request ? buildOutputs(request) : buildOutputs({ type: "image", settings: {}, jobId: "", modelSlug: "" }),
    };
  }

  return {
    status: elapsed > 300 ? "processing" : "queued",
    progress: Math.max(5, progress),
  };
}

export class MockProvider implements ProviderAdapter {
  readonly slug = "mock";

  // Cache last request per job for output generation (short-lived, optional)
  private static requestCache = new Map<string, GenerationRequest>();

  async submit(request: GenerationRequest): Promise<ProviderSubmitResult> {
    const providerJobId = `mock-${Date.now()}-${randomUUID()}`;
    MockProvider.requestCache.set(providerJobId, request);
    // Evict old entries
    if (MockProvider.requestCache.size > 100) {
      const first = MockProvider.requestCache.keys().next().value;
      if (first) MockProvider.requestCache.delete(first);
    }

    return {
      providerJobId,
      status: "queued",
      estimatedSeconds: Math.ceil(COMPLETION_DELAY_MS / 1000),
    };
  }

  async poll(providerJobId: string): Promise<ProviderPollResult> {
    const request = MockProvider.requestCache.get(providerJobId);
    const result = statelessPoll(providerJobId, request);

    if (result.status === "completed") {
      MockProvider.requestCache.delete(providerJobId);
    }

    return result;
  }

  async cancel(providerJobId: string): Promise<void> {
    MockProvider.requestCache.delete(providerJobId);
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
