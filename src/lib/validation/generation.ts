import { z } from "zod";

import { FILE_LIMITS } from "@/config/site";

const promptField = z
  .string()
  .trim()
  .min(1, "Prompt is required")
  .max(4000, "Prompt must be 4000 characters or fewer");

const negativePromptField = z
  .string()
  .trim()
  .max(2000, "Negative prompt must be 2000 characters or fewer")
  .optional();

const aspectRatioField = z
  .enum(["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"])
  .optional();

const resolutionField = z
  .enum(["480p", "720p", "1080p", "1440p", "4k"])
  .optional();

const seedField = z.number().int().min(0).max(2_147_483_647).optional();

const modelSlugField = z
  .string()
  .trim()
  .min(1, "Model is required")
  .max(120);

const workspaceIdField = z.string().cuid().optional();
const projectIdField = z.string().cuid().optional();

export const imageGenerationSchema = z.object({
  modelSlug: modelSlugField,
  prompt: promptField,
  negativePrompt: negativePromptField,
  aspectRatio: aspectRatioField,
  resolution: resolutionField.default("1080p"),
  seed: seedField,
  batchSize: z.number().int().min(1).max(4).default(1),
  stylePreset: z.string().trim().max(80).optional(),
  referenceImageUrl: z.string().url().optional(),
  workspaceId: workspaceIdField,
  projectId: projectIdField,
});

export const videoGenerationSchema = z.object({
  modelSlug: modelSlugField,
  prompt: promptField,
  negativePrompt: negativePromptField,
  duration: z.number().min(1).max(60).default(5),
  aspectRatio: aspectRatioField.default("16:9"),
  resolution: resolutionField.default("720p"),
  fps: z.number().int().min(12).max(60).default(24),
  seed: seedField,
  referenceImageUrl: z.string().url().optional(),
  referenceVideoUrl: z.string().url().optional(),
  workspaceId: workspaceIdField,
  projectId: projectIdField,
});

export const audioGenerationSchema = z.object({
  modelSlug: modelSlugField,
  prompt: promptField,
  negativePrompt: negativePromptField,
  duration: z.number().min(1).max(300).default(30),
  seed: seedField,
  format: z.enum(["mp3", "wav", "ogg"]).default("mp3"),
  workspaceId: workspaceIdField,
  projectId: projectIdField,
});

export const syncGenerationSchema = z.object({
  modelSlug: modelSlugField,
  prompt: promptField.optional(),
  videoUrl: z.string().url("A source video URL is required"),
  audioUrl: z.string().url("A source audio URL is required"),
  duration: z.number().min(1).max(120).optional(),
  lipSyncStrength: z.number().min(0).max(1).default(0.8),
  workspaceId: workspaceIdField,
  projectId: projectIdField,
});

export const generationUploadSchema = z.object({
  mimeType: z.string(),
  fileSize: z.number().int().positive(),
}).superRefine((data, ctx) => {
  const { mimeType, fileSize } = data;

  if (FILE_LIMITS.allowedImageTypes.includes(mimeType)) {
    if (fileSize > FILE_LIMITS.maxImageSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Image exceeds maximum size of ${FILE_LIMITS.maxImageSize} bytes`,
      });
    }
    return;
  }

  if (FILE_LIMITS.allowedVideoTypes.includes(mimeType)) {
    if (fileSize > FILE_LIMITS.maxVideoSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Video exceeds maximum size of ${FILE_LIMITS.maxVideoSize} bytes`,
      });
    }
    return;
  }

  if (FILE_LIMITS.allowedAudioTypes.includes(mimeType)) {
    if (fileSize > FILE_LIMITS.maxAudioSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Audio exceeds maximum size of ${FILE_LIMITS.maxAudioSize} bytes`,
      });
    }
    return;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Unsupported file type",
  });
});

export type ImageGenerationInput = z.infer<typeof imageGenerationSchema>;
export type VideoGenerationInput = z.infer<typeof videoGenerationSchema>;
export type AudioGenerationInput = z.infer<typeof audioGenerationSchema>;
export type SyncGenerationInput = z.infer<typeof syncGenerationSchema>;
