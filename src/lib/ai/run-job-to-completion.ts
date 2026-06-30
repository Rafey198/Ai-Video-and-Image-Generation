import { JobStatus } from "@prisma/client";

import { processJob } from "@/lib/ai/jobs";
import { prisma } from "@/lib/db/prisma";

export async function runJobToCompletion(
  jobId: string,
  options?: { maxAttempts?: number; delayMs?: number }
) {
  const maxAttempts = options?.maxAttempts ?? 120;
  const delayMs = options?.delayMs ?? 2000;

  let job = await processJob(jobId);

  for (let attempt = 1; attempt < maxAttempts; attempt++) {
    if (
      job.status === JobStatus.completed ||
      job.status === JobStatus.failed ||
      job.status === JobStatus.canceled
    ) {
      return job;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
    job = await processJob(jobId);
  }

  return job;
}
