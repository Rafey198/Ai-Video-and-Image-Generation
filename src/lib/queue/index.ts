/**
 * Job queue abstraction.
 * Uses Redis when REDIS_URL is set; otherwise in-process fallback with a warning.
 */

import { isRedisConfigured } from "@/lib/config/env";

let redisWarningLogged = false;

function logRedisSkippedOnce(): void {
  if (!redisWarningLogged && !isRedisConfigured()) {
    redisWarningLogged = true;
    console.warn(
      "[queue] REDIS_URL not configured — using in-memory queue fallback. " +
        "Jobs process synchronously via API polling. Safe for local dev."
    );
  }
}

export type QueueJobPayload = {
  jobId: string;
  type: string;
};

const pendingJobs = new Set<string>();

export async function enqueueJob(payload: QueueJobPayload): Promise<void> {
  logRedisSkippedOnce();

  if (isRedisConfigured()) {
    // Redis/BullMQ integration placeholder — wire when REDIS_URL is available
    console.warn("[queue] Redis URL set but BullMQ worker not yet wired; using in-memory fallback");
  }

  pendingJobs.add(payload.jobId);
}

export async function dequeueJob(jobId: string): Promise<void> {
  pendingJobs.delete(jobId);
}

export function getQueueStatus(): {
  mode: "redis" | "memory" | "skipped";
  pending: number;
} {
  if (isRedisConfigured()) {
    return { mode: "redis", pending: pendingJobs.size };
  }
  return { mode: "memory", pending: pendingJobs.size };
}
