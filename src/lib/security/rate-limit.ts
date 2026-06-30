import { RATE_LIMITS } from "@/config/site";

export type RateLimitConfig = {
  windowMs: number;
  max: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

function cleanupExpired(now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  config: RateLimitConfig = RATE_LIMITS.api
): RateLimitResult {
  const now = Date.now();

  if (store.size > 10_000) {
    cleanupExpired(now);
  }

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.max,
      remaining: config.max - 1,
      resetAt,
    };
  }

  if (existing.count >= config.max) {
    return {
      success: false,
      limit: config.max,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    success: true,
    limit: config.max,
    remaining: config.max - existing.count,
    resetAt: existing.resetAt,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimitByIp(
  request: Request,
  namespace: string,
  config?: RateLimitConfig
): RateLimitResult {
  const ip = getClientIp(request);
  return rateLimit(`${namespace}:${ip}`, config);
}

export const apiRateLimit = (key: string) => rateLimit(key, RATE_LIMITS.api);
export const generationRateLimit = (key: string) =>
  rateLimit(key, RATE_LIMITS.generation);
export const authRateLimit = (key: string) => rateLimit(key, RATE_LIMITS.auth);
