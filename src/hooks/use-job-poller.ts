"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { ActiveJob, MediaItem } from "@/lib/types/components";

type PollResult = {
  job: ActiveJob & { errorMessage?: string | null };
  mediaAssets: MediaItem[];
};

type UseJobPollerOptions = {
  onComplete?: (media: MediaItem) => void;
  onError?: (message: string) => void;
  intervalMs?: number;
  maxAttempts?: number;
};

export function useJobPoller(options: UseJobPollerOptions = {}) {
  const { onComplete, onError, intervalMs = 1500, maxAttempts = 40 } = options;
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [result, setResult] = useState<MediaItem | null>(null);
  const [polling, setPolling] = useState(false);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    setPolling(false);
    attemptsRef.current = 0;
  }, []);

  const pollJob = useCallback(
    async (jobId: string) => {
      const res = await fetch(`/api/jobs/${jobId}/poll`);
      const data = (await res.json()) as PollResult & { error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to poll job");
      }

      setActiveJob({
        id: data.job.id,
        status: data.job.status,
        progress: data.job.progress ?? 0,
        type: data.job.type ?? "image",
        prompt: data.job.prompt,
      });

      if (data.job.status === "completed" && data.mediaAssets?.[0]) {
        const media = data.mediaAssets[0];
        setResult(media);
        stopPolling();
        onComplete?.(media);
        return true;
      }

      if (data.job.status === "failed") {
        stopPolling();
        onError?.(data.job.errorMessage ?? "Generation failed");
        return true;
      }

      return false;
    },
    [onComplete, onError, stopPolling]
  );

  useEffect(() => {
    if (!polling || !activeJob?.id) return;

    const interval = setInterval(async () => {
      attemptsRef.current += 1;
      if (attemptsRef.current > maxAttempts) {
        stopPolling();
        onError?.("Generation timed out. Check History for status.");
        return;
      }

      try {
        const done = await pollJob(activeJob.id);
        if (done) clearInterval(interval);
      } catch (err) {
        stopPolling();
        onError?.(err instanceof Error ? err.message : "Polling failed");
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [polling, activeJob?.id, intervalMs, maxAttempts, pollJob, stopPolling, onError]);

  const startJob = useCallback(
    (job: ActiveJob) => {
      setActiveJob(job);
      setResult(null);
      setPolling(true);
      attemptsRef.current = 0;
      // Immediate first poll
      void pollJob(job.id);
    },
    [pollJob]
  );

  return {
    activeJob,
    setActiveJob,
    result,
    setResult,
    polling,
    startJob,
    stopPolling,
  };
}
