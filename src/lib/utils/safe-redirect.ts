/**
 * Validates callback URLs to prevent open redirects.
 * Only allows same-origin relative paths.
 */
export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!callbackUrl) return fallback;

  const trimmed = callbackUrl.trim();

  // Must be a relative path starting with single /
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  // Block protocol-relative and encoded tricks
  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return fallback;
  }

  return trimmed;
}
