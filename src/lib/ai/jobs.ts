import { JobStatus, MediaType, Prisma } from "@prisma/client";

import { getProvider, resolveProviderForModel } from "@/lib/ai/providers";
import { calculateCreditCost } from "@/lib/credits/calculator";
import { deductCredits, refundCredits } from "@/lib/credits/wallet";
import { prisma } from "@/lib/db/prisma";
import { moderatePrompt } from "@/lib/security/moderation";

export class JobError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "JobError";
  }
}

export type CreateGenerationJobInput = {
  userId: string;
  modelId: string;
  type: string;
  prompt?: string;
  negativePrompt?: string;
  settings?: Record<string, unknown>;
  workspaceId?: string;
  projectId?: string;
};

export async function createGenerationJob(input: CreateGenerationJobInput) {
  const model = await prisma.aiModel.findUnique({
    where: { id: input.modelId },
    include: { provider: true },
  });

  if (!model || !model.enabled) {
    throw new JobError("Model not found or disabled", "MODEL_UNAVAILABLE", 404);
  }

  if (input.prompt) {
    const moderation = await moderatePrompt(input.prompt, {
      userId: input.userId,
      negativePrompt: input.negativePrompt,
    });

    if (!moderation.allowed) {
      throw new JobError(
        moderation.reason ?? "Prompt blocked by moderation",
        "MODERATION_BLOCKED",
        422
      );
    }
  }

  const durationSeconds = Number(input.settings?.duration ?? 0);
  const resolution = String(input.settings?.resolution ?? "720p");
  const batchSize = Number(input.settings?.batchSize ?? 1);

  const creditsCost = calculateCreditCost({
    model,
    durationSeconds,
    resolution,
    batchSize,
  });

  const job = await prisma.$transaction(async (tx) => {
    const created = await tx.generationJob.create({
      data: {
        userId: input.userId,
        workspaceId: input.workspaceId,
        projectId: input.projectId,
        modelId: input.modelId,
        type: input.type,
        prompt: input.prompt,
        negativePrompt: input.negativePrompt,
        settings: (input.settings ?? {}) as Prisma.InputJsonValue,
        creditsCost,
        status: JobStatus.queued,
      },
    });

    await tx.generationSetting.create({
      data: {
        jobId: created.id,
        settings: (input.settings ?? {}) as Prisma.InputJsonValue,
      },
    });

    return created;
  });

  try {
    await deductCredits({
      userId: input.userId,
      amount: creditsCost,
      jobId: job.id,
      description: `Generation: ${model.name}`,
      metadata: { modelSlug: model.slug, type: input.type },
    });
  } catch (error) {
    await prisma.generationJob.update({
      where: { id: job.id },
      data: {
        status: JobStatus.canceled,
        errorMessage: "Insufficient credits",
        completedAt: new Date(),
      },
    });
    throw error;
  }

  return job;
}

export async function processJob(jobId: string) {
  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: {
      model: { include: { provider: true } },
    },
  });

  if (!job) {
    throw new JobError("Job not found", "JOB_NOT_FOUND", 404);
  }

  if (job.status === JobStatus.canceled) {
    return job;
  }

  if (job.status === JobStatus.completed) {
    return job;
  }

  const provider = await resolveProviderForModel(job.model.slug, job.model.provider?.slug);

  let providerJobId = job.providerJobId;

  if (!providerJobId) {
    const submitted = await provider.submit({
      jobId: job.id,
      type: job.type,
      prompt: job.prompt,
      negativePrompt: job.negativePrompt,
      settings: (job.settings as Record<string, unknown>) ?? {},
      modelSlug: job.model.slug,
      providerSlug: job.model.provider?.slug,
    });

    providerJobId = submitted.providerJobId;

    await prisma.generationJob.update({
      where: { id: job.id },
      data: {
        providerJobId,
        status: provider.mapStatus(submitted.status),
        startedAt: new Date(),
        progress: submitted.status === "processing" ? 10 : 0,
      },
    });
  }

  const pollResult = await provider.poll(providerJobId);
  const status = provider.mapStatus(pollResult.status);

  const updatedJob = await prisma.generationJob.update({
    where: { id: job.id },
    data: {
      status,
      progress: pollResult.progress ?? (status === JobStatus.completed ? 100 : undefined),
      errorMessage: pollResult.errorMessage,
      completedAt: status === JobStatus.completed ? new Date() : undefined,
    },
  });

  if (status === JobStatus.completed && pollResult.outputs?.length) {
    const mediaType = provider.inferMediaType(job.type);

    await prisma.$transaction(async (tx) => {
      for (const output of pollResult.outputs!) {
        await tx.mediaAsset.create({
          data: {
            userId: job.userId,
            workspaceId: job.workspaceId,
            jobId: job.id,
            type: mediaType,
            title: job.prompt?.slice(0, 120) ?? "Generated asset",
            url: output.url,
            thumbnailUrl: output.thumbnailUrl,
            mimeType: output.mimeType,
            width: output.width,
            height: output.height,
            duration: output.duration,
            metadata: (output.metadata ?? {}) as Prisma.InputJsonValue,
          },
        });
      }
    });
  }

  if (status === JobStatus.failed) {
    await refundCredits({
      userId: job.userId,
      amount: job.creditsCost,
      jobId: job.id,
      description: "Automatic refund for failed generation",
      metadata: { error: pollResult.errorMessage },
    });
  }

  return updatedJob;
}

export async function cancelJob(jobId: string, userId?: string) {
  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: { model: { include: { provider: true } } },
  });

  if (!job) {
    throw new JobError("Job not found", "JOB_NOT_FOUND", 404);
  }

  if (userId && job.userId !== userId) {
    throw new JobError("Not authorized to cancel this job", "FORBIDDEN", 403);
  }

  if (job.status === JobStatus.completed || job.status === JobStatus.canceled) {
    return job;
  }

  if (job.providerJobId && job.model.provider?.slug) {
    const provider = await resolveProviderForModel(job.model.slug, job.model.provider.slug);
    await provider.cancel(job.providerJobId);
  }

  const updated = await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: JobStatus.canceled,
      completedAt: new Date(),
    },
  });

  if (job.status !== JobStatus.failed) {
    await refundCredits({
      userId: job.userId,
      amount: job.creditsCost,
      jobId: job.id,
      description: "Refund for canceled generation",
    });
  }

  return updated;
}

export async function retryJob(jobId: string, userId?: string) {
  const job = await prisma.generationJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new JobError("Job not found", "JOB_NOT_FOUND", 404);
  }

  if (userId && job.userId !== userId) {
    throw new JobError("Not authorized to retry this job", "FORBIDDEN", 403);
  }

  if (job.status !== JobStatus.failed && job.status !== JobStatus.canceled) {
    throw new JobError(
      "Only failed or canceled jobs can be retried",
      "INVALID_STATUS",
      400
    );
  }

  await deductCredits({
    userId: job.userId,
    amount: job.creditsCost,
    jobId: job.id,
    description: "Retry generation",
  });

  const retried = await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: JobStatus.queued,
      providerJobId: null,
      progress: 0,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
    },
  });

  return retried;
}

export function resolveMediaTypeFromJobType(type: string): MediaType {
  if (type.includes("video")) return MediaType.video;
  if (type.includes("audio")) return MediaType.audio;
  if (type.includes("image")) return MediaType.image;
  return MediaType.other;
}
