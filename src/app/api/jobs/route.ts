import { JobStatus } from "@prisma/client";
import { z } from "zod";

import { createGenerationJob, processJob } from "@/lib/ai/jobs";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { getDemoMode } from "@/lib/config/runtime";
import { prisma } from "@/lib/db/prisma";
import { enqueueJob } from "@/lib/queue";
import { generationRateLimit } from "@/lib/security/rate-limit";
import {
  audioGenerationSchema,
  imageGenerationSchema,
  syncGenerationSchema,
  videoGenerationSchema,
} from "@/lib/validation/generation";

const jobTypeSchema = z.enum(["image", "video", "audio", "sync"]);

function parseJobBody(body: unknown) {
  const type = jobTypeSchema.parse(
    typeof body === "object" && body !== null && "type" in body
      ? (body as { type: unknown }).type
      : undefined
  );

  switch (type) {
    case "image":
      return { type, ...imageGenerationSchema.parse(body) };
    case "video":
      return { type, ...videoGenerationSchema.parse(body) };
    case "audio":
      return { type, ...audioGenerationSchema.parse(body) };
    case "sync":
      return { type, ...syncGenerationSchema.parse(body) };
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status") as JobStatus | null;
    const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
    const offset = Number(searchParams.get("offset") ?? 0);

    const where = {
      userId: session.user.id,
      ...(status && Object.values(JobStatus).includes(status) ? { status } : {}),
    };

    const [jobs, total] = await Promise.all([
      prisma.generationJob.findMany({
        where,
        include: {
          model: {
            select: { id: true, name: true, slug: true, category: true, taskType: true },
          },
          mediaAssets: {
            select: {
              id: true,
              type: true,
              url: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.generationJob.count({ where }),
    ]);

    return json({ jobs, total, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const rateLimit = generationRateLimit(`jobs:create:${session.user.id}`);
    if (!rateLimit.success) {
      return errorResponse("Generation rate limit exceeded", 429);
    }

    const body = await request.json();
    const parsed = parseJobBody(body);

    const model = await prisma.aiModel.findUnique({
      where: { slug: parsed.modelSlug },
    });

    if (!model) {
      return errorResponse("Model not found", 404);
    }

    const { type, prompt, workspaceId, projectId, ...settings } = parsed;

    const negativePrompt = "negativePrompt" in parsed ? parsed.negativePrompt : undefined;

    const job = await createGenerationJob({
      userId: session.user.id,
      modelId: model.id,
      type,
      prompt,
      negativePrompt,
      workspaceId,
      projectId,
      settings,
    });

    // In demo mode, process immediately so serverless instances complete jobs
    let processedJob = job;
    let mediaAssets: unknown[] = [];

    const demoMode = await getDemoMode();

    if (demoMode) {
      processedJob = await processJob(job.id);
      mediaAssets = await prisma.mediaAsset.findMany({
        where: { jobId: job.id },
        select: {
          id: true,
          type: true,
          url: true,
          thumbnailUrl: true,
          mimeType: true,
          width: true,
          height: true,
          duration: true,
        },
      });
    } else {
      await enqueueJob({ jobId: job.id, type });
    }

    return json({ job: processedJob, media: mediaAssets[0] ?? null, mediaAssets }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
