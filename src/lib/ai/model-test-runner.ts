import { JobStatus } from "@prisma/client";

import { createGenerationJob } from "@/lib/ai/jobs";
import { isReplicateModelMapped, LIVE_TEST_IMAGE_URL, resolveReplicateModel } from "@/lib/ai/providers/model-map";
import { runJobToCompletion } from "@/lib/ai/run-job-to-completion";
import { getDemoMode } from "@/lib/config/runtime";
import { isReplicateConfigured } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";

export type ModelLiveTestResult = {
  modelSlug: string;
  modelName: string;
  category: string;
  providerSlug: string | null;
  status: "completed" | "failed" | "skipped" | "unsupported";
  jobId?: string;
  mediaUrl?: string;
  error?: string;
  durationMs: number;
  mapped: boolean;
};

const DEFAULT_PROMPTS: Record<string, string> = {
  image: "A premium product photo of wireless earbuds on marble, soft studio lighting, 4k",
  video: "Cinematic slow-motion ocean waves at golden hour, aerial drone shot",
  audio: "Upbeat lo-fi hip hop beat with warm vinyl texture, 90 bpm",
  sync: "Professional presenter speaking to camera in a modern studio",
  moderation: "Safety classifier test input",
  other: "VireoMorph live model connectivity test",
};

function categoryToJobType(category: string): string {
  if (category === "video") return "video";
  if (category === "audio") return "audio";
  if (category === "sync") return "sync";
  return "image";
}

export function defaultPromptForCategory(category: string): string {
  return DEFAULT_PROMPTS[category] ?? DEFAULT_PROMPTS.other;
}

export async function testModelLive(
  userId: string,
  modelSlug: string,
  prompt?: string
): Promise<ModelLiveTestResult> {
  const started = Date.now();

  const model = await prisma.aiModel.findUnique({
    where: { slug: modelSlug },
    include: { provider: true },
  });

  if (!model || !model.enabled) {
    return {
      modelSlug,
      modelName: model?.name ?? modelSlug,
      category: model?.category ?? "unknown",
      providerSlug: model?.provider?.slug ?? null,
      status: "skipped",
      error: "Model not found or disabled",
      durationMs: Date.now() - started,
      mapped: isReplicateModelMapped(modelSlug),
    };
  }

  const mapped = isReplicateModelMapped(model.slug);
  const demoMode = await getDemoMode();

  if (demoMode) {
    return {
      modelSlug: model.slug,
      modelName: model.name,
      category: model.category,
      providerSlug: model.provider?.slug ?? null,
      status: "skipped",
      error: "Turn Demo Mode OFF in Admin → Feature Flags for live provider tests",
      durationMs: Date.now() - started,
      mapped,
    };
  }

  if (!isReplicateConfigured()) {
    return {
      modelSlug: model.slug,
      modelName: model.name,
      category: model.category,
      providerSlug: model.provider?.slug ?? null,
      status: "skipped",
      error: "Set REPLICATE_API_TOKEN on Vercel for live generation",
      durationMs: Date.now() - started,
      mapped,
    };
  }

  if (!mapped) {
    return {
      modelSlug: model.slug,
      modelName: model.name,
      category: model.category,
      providerSlug: model.provider?.slug ?? null,
      status: "unsupported",
      error: `No Replicate mapping for "${model.slug}" yet`,
      durationMs: Date.now() - started,
      mapped: false,
    };
  }

  const mapping = resolveReplicateModel(model.slug)!;
  const jobType = categoryToJobType(model.category);
  const testPrompt = prompt?.trim() || defaultPromptForCategory(model.category);

  try {
    const job = await createGenerationJob({
      userId,
      modelId: model.id,
      type: jobType,
      prompt: testPrompt,
      settings: {
        aspectRatio: "16:9",
        resolution: "720p",
        duration: jobType === "video" ? 4 : jobType === "audio" ? 8 : 1,
        referenceImageUrl: mapping.requiresImage ? LIVE_TEST_IMAGE_URL : undefined,
      },
    });

    const maxAttempts =
      jobType === "video" ? 90 : jobType === "audio" || jobType === "sync" ? 60 : 45;

    const finalJob = await runJobToCompletion(job.id, { maxAttempts, delayMs: 2500 });

    const media = await prisma.mediaAsset.findFirst({
      where: { jobId: job.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      modelSlug: model.slug,
      modelName: model.name,
      category: model.category,
      providerSlug: "replicate",
      status: finalJob.status === JobStatus.completed ? "completed" : "failed",
      jobId: job.id,
      mediaUrl: media?.url,
      error: finalJob.errorMessage ?? undefined,
      durationMs: Date.now() - started,
      mapped: true,
    };
  } catch (error) {
    return {
      modelSlug: model.slug,
      modelName: model.name,
      category: model.category,
      providerSlug: model.provider?.slug ?? null,
      status: "failed",
      error: error instanceof Error ? error.message : "Live test failed",
      durationMs: Date.now() - started,
      mapped: true,
    };
  }
}

export async function listModelsForLiveTest(category?: string) {
  const models = await prisma.aiModel.findMany({
    where: {
      enabled: true,
      ...(category && category !== "all" ? { category } : {}),
    },
    include: { provider: { select: { slug: true, name: true } } },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return models.map((model) => ({
    id: model.id,
    slug: model.slug,
    name: model.name,
    category: model.category,
    providerSlug: model.provider?.slug ?? null,
    mapped: isReplicateModelMapped(model.slug),
    taskType: model.taskType,
    creditCostBase: model.creditCostBase,
  }));
}
