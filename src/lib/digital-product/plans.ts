import type { ExportFormat } from "@prisma/client";

import type { PlanLimits } from "./types";

export type StudioPlanTier = "free" | "pro" | "business";

const FREE_EXPORTS: ExportFormat[] = ["png", "jpg", "json"];
const PRO_EXPORTS: ExportFormat[] = ["pdf", "png", "jpg", "pptx", "svg", "xlsx", "json"];
const BUSINESS_EXPORTS: ExportFormat[] = [
  "pdf",
  "png",
  "jpg",
  "svg",
  "pptx",
  "xlsx",
  "docx",
  "json",
  "zip",
];

export const STUDIO_PLAN_LIMITS: Record<StudioPlanTier, PlanLimits> = {
  free: {
    maxGenerationsPerDay: 5,
    maxBulkCount: 3,
    watermark: true,
    allowedExports: FREE_EXPORTS,
    maxExportsPerDay: 10,
    brandingKits: false,
    zipBundles: false,
  },
  pro: {
    maxGenerationsPerDay: 50,
    maxBulkCount: 25,
    watermark: false,
    allowedExports: PRO_EXPORTS,
    maxExportsPerDay: 100,
    brandingKits: false,
    zipBundles: false,
  },
  business: {
    maxGenerationsPerDay: 200,
    maxBulkCount: 100,
    watermark: false,
    allowedExports: BUSINESS_EXPORTS,
    maxExportsPerDay: 500,
    brandingKits: true,
    zipBundles: true,
  },
};

export async function resolveUserStudioPlan(userId: string): Promise<StudioPlanTier> {
  const { prisma } = await import("@/lib/db/prisma");

  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: "active" },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  if (!subscription?.plan) return "free";

  const slug = subscription.plan.slug.toLowerCase();
  if (slug.includes("business") || slug.includes("studio") || slug.includes("enterprise")) {
    return "business";
  }
  if (slug.includes("pro") || slug.includes("creator")) {
    return "pro";
  }
  return "free";
}

export function getPlanLimits(tier: StudioPlanTier): PlanLimits {
  return STUDIO_PLAN_LIMITS[tier];
}

export function canExportFormat(tier: StudioPlanTier, format: ExportFormat): boolean {
  return STUDIO_PLAN_LIMITS[tier].allowedExports.includes(format);
}

export function getMaxBulkCount(tier: StudioPlanTier, requested: number): number {
  return Math.min(requested, STUDIO_PLAN_LIMITS[tier].maxBulkCount);
}
