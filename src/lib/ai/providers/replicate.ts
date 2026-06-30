import { JobStatus, MediaType } from "@prisma/client";

import { isReplicateConfigured } from "@/lib/config/env";
import { uploadRemoteUrlToStorage } from "@/lib/storage/s3";
import type {
  GenerationRequest,
  ProviderAdapter,
  ProviderJobStatus,
  ProviderPollResult,
  ProviderSubmitResult,
} from "./types";
import { resolveReplicateModel } from "./model-map";

const REPLICATE_API = "https://api.replicate.com/v1";

type ReplicatePrediction = {
  id: string;
  status: string;
  output?: string | string[] | null;
  error?: string | null;
  logs?: string;
};

function mapReplicateStatus(status: string): ProviderJobStatus {
  switch (status) {
    case "starting":
    case "processing":
      return "processing";
    case "succeeded":
      return "completed";
    case "failed":
    case "canceled":
      return status === "canceled" ? "canceled" : "failed";
    default:
      return "queued";
  }
}

async function replicateFetch(path: string, init?: RequestInit) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is not configured");

  const res = await fetch(`${REPLICATE_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Replicate API error (${res.status}): ${body.slice(0, 200)}`);
  }

  return res.json();
}

function buildInput(request: GenerationRequest): Record<string, unknown> {
  const input: Record<string, unknown> = {
    prompt: request.prompt ?? "",
  };

  if (request.negativePrompt) {
    input.negative_prompt = request.negativePrompt;
  }

  if (request.settings.aspectRatio) {
    const [w, h] = String(request.settings.aspectRatio).split(":").map(Number);
    if (w && h) {
      const base = request.settings.resolution === "1080p" ? 1080 : 768;
      input.width = Math.round((base * w) / h);
      input.height = base;
    }
  }

  if (request.settings.seed) {
    input.seed = request.settings.seed;
  }

  return input;
}

export class ReplicateProvider implements ProviderAdapter {
  readonly slug = "replicate";

  async submit(request: GenerationRequest): Promise<ProviderSubmitResult> {
    if (!isReplicateConfigured()) {
      throw new Error("Replicate is not configured");
    }

    const modelRef = resolveReplicateModel(request.modelSlug);
    if (!modelRef) {
      throw new Error(`No Replicate mapping for model: ${request.modelSlug}`);
    }

    const modelPath = `${modelRef.owner}/${modelRef.name}`;
    const prediction = (await replicateFetch(`/models/${modelPath}/predictions`, {
      method: "POST",
      body: JSON.stringify({ input: buildInput(request) }),
    })) as ReplicatePrediction;

    return {
      providerJobId: prediction.id,
      status: mapReplicateStatus(prediction.status),
      estimatedSeconds: 30,
    };
  }

  async poll(providerJobId: string): Promise<ProviderPollResult> {
    const prediction = (await replicateFetch(
      `/predictions/${providerJobId}`
    )) as ReplicatePrediction;

    const status = mapReplicateStatus(prediction.status);

    if (status !== "completed") {
      return {
        status,
        progress: status === "processing" ? 50 : 10,
        errorMessage: prediction.error ?? undefined,
      };
    }

    const outputUrl = Array.isArray(prediction.output)
      ? prediction.output[0]
      : prediction.output;

    if (!outputUrl || typeof outputUrl !== "string") {
      return { status: "failed", errorMessage: "Replicate returned no output URL" };
    }

    const stored = await uploadRemoteUrlToStorage(outputUrl, {
      folder: "generations/replicate",
      contentType: "image/png",
    });

    return {
      status: "completed",
      progress: 100,
      outputs: [
        {
          url: stored.url,
          thumbnailUrl: stored.url,
          mimeType: stored.mimeType,
          width: 1024,
          height: 1024,
          metadata: { provider: "replicate", storageKey: stored.key },
        },
      ],
    };
  }

  async cancel(providerJobId: string): Promise<void> {
    await replicateFetch(`/predictions/${providerJobId}/cancel`, { method: "POST" });
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

export const replicateProvider = new ReplicateProvider();

export async function checkReplicateHealth(): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!isReplicateConfigured()) {
    return { ok: false, message: "REPLICATE_API_TOKEN not configured" };
  }

  const start = Date.now();
  try {
    await replicateFetch("/account");
    return { ok: true, message: "Replicate API reachable", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Replicate health check failed",
      latencyMs: Date.now() - start,
    };
  }
}
