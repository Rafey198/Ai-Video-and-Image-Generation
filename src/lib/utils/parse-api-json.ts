/**
 * Parse a fetch Response as JSON; surface HTML/error pages with a clear message.
 */
export async function parseApiJson<T = Record<string, unknown>>(
  res: Response
): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    if (text.includes("vercel.com/sso") || res.redirected) {
      throw new Error(
        "This deployment is protected by Vercel login. Disable Deployment Protection in Vercel → Settings → Deployment Protection, or use your production URL."
      );
    }
    if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
      throw new Error(
        `Server returned an HTML page instead of JSON (HTTP ${res.status}). Redeploy the latest code and run prisma db push on production.`
      );
    }
    throw new Error(text.slice(0, 200) || `Unexpected response (HTTP ${res.status})`);
  }

  return res.json() as Promise<T>;
}
