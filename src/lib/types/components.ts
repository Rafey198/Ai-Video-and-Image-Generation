import type { JobStatus, MediaType, UserRole } from "@prisma/client";

export type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type CreditInfo = {
  balance: number;
  monthlyUsed?: number;
  monthlyLimit?: number;
};

export type UsageDataPoint = {
  date: string;
  credits: number;
  jobs: number;
};

export type JobSummary = {
  id: string;
  type: string;
  status: JobStatus;
  prompt?: string | null;
  modelName?: string;
  creditsCost: number;
  progress: number;
  createdAt: string | Date;
  thumbnailUrl?: string | null;
};

export type MediaItem = {
  id: string;
  type: MediaType;
  title?: string | null;
  url: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt?: string | Date;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  link?: string | null;
  createdAt: string | Date;
};

export type AiModelOption = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string | null;
  creditCostBase: number;
  creditCostPerSecond: number;
  minDuration?: number | null;
  maxDuration?: number | null;
  fixedDuration?: number | null;
  featured?: boolean;
  supportedAspectRatios?: string[];
  supportedResolutions?: string[];
};

export type StudioCategory = "image" | "video" | "audio" | "sync";

export type GenerationSettings = {
  aspectRatio?: string;
  resolution?: string;
  fps?: number;
  seed?: number;
  batchSize?: number;
  negativePrompt?: string;
  stylePreset?: string;
};

export type ActiveJob = {
  id: string;
  status: JobStatus;
  progress: number;
  type: string;
  prompt?: string | null;
  errorMessage?: string | null;
  estimatedSeconds?: number;
};

export type MediaFolder = {
  id: string;
  name: string;
  parentId?: string | null;
  assetCount?: number;
};

export type AdminStat = {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  suspended: boolean;
  createdAt: string | Date;
  creditBalance?: number;
};

export type AdminModel = {
  id: string;
  name: string;
  slug: string;
  category: string;
  providerName?: string | null;
  enabled: boolean;
  featured: boolean;
  creditCostBase: number;
  creditCostPerSecond: number;
};

export type AdminJob = {
  id: string;
  userId: string;
  userEmail?: string;
  type: string;
  status: JobStatus;
  modelName?: string;
  creditsCost: number;
  progress: number;
  createdAt: string | Date;
};

export type FeatureFlag = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  enabled: boolean;
};

export type SystemLogEntry = {
  id: string;
  level: string;
  category: string;
  message: string;
  createdAt: string | Date;
};
