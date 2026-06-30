import type { AiModel } from "@prisma/client";

export type ResolutionTier = "480p" | "720p" | "1080p" | "1440p" | "4k";

export type CreditCalculationInput = {
  model: Pick<AiModel, "creditCostBase" | "creditCostPerSecond">;
  durationSeconds?: number;
  resolution?: ResolutionTier | string;
  batchSize?: number;
};

const RESOLUTION_MULTIPLIERS: Record<ResolutionTier, number> = {
  "480p": 1,
  "720p": 1.25,
  "1080p": 1.5,
  "1440p": 2,
  "4k": 3,
};

const DURATION_BUCKETS: { maxSeconds: number; multiplier: number }[] = [
  { maxSeconds: 5, multiplier: 1 },
  { maxSeconds: 15, multiplier: 1.5 },
  { maxSeconds: 30, multiplier: 2 },
  { maxSeconds: 60, multiplier: 3 },
  { maxSeconds: Infinity, multiplier: 4 },
];

function normalizeResolution(resolution?: string): ResolutionTier {
  if (!resolution) return "720p";

  const normalized = resolution.toLowerCase().replace(/\s/g, "");

  if (normalized.includes("4k") || normalized === "2160p") return "4k";
  if (normalized.includes("1440") || normalized === "2k") return "1440p";
  if (normalized.includes("1080")) return "1080p";
  if (normalized.includes("720")) return "720p";
  if (normalized.includes("480")) return "480p";

  return "720p";
}

function getDurationMultiplier(durationSeconds: number): number {
  const absDuration = Math.max(0, durationSeconds);
  const bucket = DURATION_BUCKETS.find((b) => absDuration <= b.maxSeconds);
  return bucket?.multiplier ?? 1;
}

function getResolutionMultiplier(resolution?: string): number {
  const tier = normalizeResolution(resolution);
  return RESOLUTION_MULTIPLIERS[tier];
}

export function calculateCreditCost(input: CreditCalculationInput): number {
  const {
    model,
    durationSeconds = 0,
    resolution,
    batchSize = 1,
  } = input;

  const base = model.creditCostBase;
  const perSecond = model.creditCostPerSecond * durationSeconds;
  const subtotal = base + perSecond;

  const durationMultiplier = durationSeconds > 0 ? getDurationMultiplier(durationSeconds) : 1;
  const resolutionMultiplier = getResolutionMultiplier(resolution);
  const quantity = Math.max(1, Math.floor(batchSize));

  const total = subtotal * durationMultiplier * resolutionMultiplier * quantity;
  return Math.max(1, Math.ceil(total));
}

export function estimateCreditRange(
  model: Pick<AiModel, "creditCostBase" | "creditCostPerSecond">,
  options: {
    minDuration?: number;
    maxDuration?: number;
    resolution?: string;
  } = {}
): { min: number; max: number } {
  const minDuration = options.minDuration ?? 0;
  const maxDuration = options.maxDuration ?? minDuration;

  return {
    min: calculateCreditCost({
      model,
      durationSeconds: minDuration,
      resolution: options.resolution,
    }),
    max: calculateCreditCost({
      model,
      durationSeconds: maxDuration,
      resolution: options.resolution,
    }),
  };
}
