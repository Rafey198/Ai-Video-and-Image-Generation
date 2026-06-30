import { prisma } from "@/lib/db/prisma";
import { isDatabaseConfigured } from "@/lib/db/safe-query";

export const DEMO_MODE_FLAG_KEY = "demo_mode";

const CACHE_TTL_MS = 30_000;

let cachedDemoMode: { value: boolean; expiresAt: number } | null = null;

/** Env-only fallback — use {@link getDemoMode} on the server for runtime resolution. */
export function isDemoModeFromEnv(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function invalidateDemoModeCache(): void {
  cachedDemoMode = null;
}

/**
 * Resolves demo mode at runtime: FeatureFlag `demo_mode` in DB overrides env when present.
 * New users inherit this global setting (no per-user override).
 */
export async function getDemoMode(): Promise<boolean> {
  if (cachedDemoMode && Date.now() < cachedDemoMode.expiresAt) {
    return cachedDemoMode.value;
  }

  if (isDatabaseConfigured()) {
    try {
      const flag = await prisma.featureFlag.findUnique({
        where: { key: DEMO_MODE_FLAG_KEY },
        select: { enabled: true },
      });

      if (flag !== null) {
        cachedDemoMode = {
          value: flag.enabled,
          expiresAt: Date.now() + CACHE_TTL_MS,
        };
        return flag.enabled;
      }
    } catch {
      // Fall through to env when DB is unavailable
    }
  }

  const value = isDemoModeFromEnv();
  cachedDemoMode = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}
