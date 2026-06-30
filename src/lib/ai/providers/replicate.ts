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
import { resolveReplicateModel, LIVE_TEST_IMAGE_URL, type ReplicateModelRef } from "./model-map";
import { resolutionToPixels } from "@/lib/validation/generation";

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

function buildInput(request: GenerationRequest, modelRef: ReplicateModelRef): Record<string, unknown> {
  const mode = modelRef.inputMode ?? "text_to_image";
  const imageUrl =
    (request.settings.referenceImageUrl as string | undefined) ??
    (request.settings.referenceImage as string | undefined) ??
    LIVE_TEST_IMAGE_URL;

  switch (mode) {
    case "image_enhance":
      return {
        image: imageUrl,
        scale: Number(request.settings.scale ?? 2),
      };
    case "image_to_video":
      return {
        image: imageUrl,
        prompt: request.prompt ?? "gentle cinematic motion",
      };
    case "text_to_video":
      return {
        prompt: request.prompt ?? "",
        ...(request.negativePrompt ? { negative_prompt: request.negativePrompt } : {}),
        num_frames: Number(request.settings.duration ?? 5) * 8,
        fps: Number(request.settings.fps ?? 8),
      };
    case "text_to_audio":
      return {
        prompt: request.prompt ?? "ambient electronic music",
        duration: Number(request.settings.duration ?? 10),
      };
    case "text_to_speech":
      return {
        text: request.prompt ?? "Hello from VireoMorph live model test.",
        speaker: "default",
        language: "en",
      };
    case "lip_sync":
      return {
        source_image: imageUrl,
        driven_audio: request.settings.audioUrl ?? "https://replicate.delivery/pbxt/sample-audio.wav",
        prompt: request.prompt ?? "",
      };
    case "text_to_image":
    default: {
      const input: Record<string, unknown> = {
        prompt: request.prompt ?? "",
      };

      if (request.negativePrompt) {
        input.negative_prompt = request.negativePrompt;
      }

  if (request.settings.aspectRatio) {
    const [w, h] = String(request.settings.aspectRatio).split(":").map(Number);
    if (w && h) {
      const base = resolutionToPixels(String(request.settings.resolution ?? "768px"));
      input.width = Math.round((base * w) / h);
      input.height = base;
    }
  }

      if (request.settings.seed) {
        input.seed = request.settings.seed;
      }

      if (modelRef.requiresImage) {
        input.image = imageUrl;
      }

      return input;
    }
  }
}

function mimeFromOutputUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes(".mp4") || lower.includes("video")) return "video/mp4";
  if (lower.includes(".wav")) return "audio/wav";
  if (lower.includes(".mp3") || lower.includes("audio")) return "audio/mpeg";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  return "image/png";
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
      body: JSON.stringify({ input: buildInput(request, modelRef) }),
    })) as ReplicatePrediction;

    const estimatedSeconds =
      modelRef.inputMode === "text_to_video" || modelRef.inputMode === "image_to_video"
        ? 120
        : modelRef.inputMode === "text_to_audio" || modelRef.inputMode === "lip_sync"
          ? 60
          : 30;

    return {
      providerJobId: prediction.id,
      status: mapReplicateStatus(prediction.status),
      estimatedSeconds,
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
      contentType: mimeFromOutputUrl(outputUrl),
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
