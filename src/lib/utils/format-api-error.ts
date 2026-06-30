/** Format API validation errors from /api/jobs and similar routes. */
export function formatApiError(data: {
  error?: string;
  issues?: Record<string, string[] | undefined>;
}): string {
  if (data.issues) {
    const details = Object.entries(data.issues)
      .flatMap(([field, messages]) =>
        (messages ?? []).map((message) => `${field}: ${message}`)
      )
      .join("; ");
    if (details) return details;
  }
  return data.error ?? "Request failed";
}
