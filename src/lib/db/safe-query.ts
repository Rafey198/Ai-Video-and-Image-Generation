export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Run a Prisma query only when DATABASE_URL is configured.
 * Returns fallback during build/CI when the database is unavailable.
 */
export async function safeDbQuery<T>(
  query: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("[db] Query failed:", error);
    }
    return fallback;
  }
}
