import type { JobStatus, MediaType } from "@prisma/client";

export type ProviderJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "canceled";

export type GenerationRequest = {
  jobId: string;
  type: string;
  prompt?: string | null;
  negativePrompt?: string | null;
  settings: Record<string, unknown>;
  modelSlug: string;
  providerSlug?: string | null;
};

export type GenerationOutput = {
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
};

export type ProviderSubmitResult = {
  providerJobId: string;
  status: ProviderJobStatus;
  estimatedSeconds?: number;
};

export type ProviderPollResult = {
  status: ProviderJobStatus;
  progress?: number;
  outputs?: GenerationOutput[];
  errorMessage?: string;
};

export interface ProviderAdapter {
  readonly slug: string;
  submit(request: GenerationRequest): Promise<ProviderSubmitResult>;
  poll(providerJobId: string): Promise<ProviderPollResult>;
  cancel(providerJobId: string): Promise<void>;
  mapStatus(status: ProviderJobStatus): JobStatus;
  inferMediaType(type: string): MediaType;
}
