/** Server-side environment helpers — never log secret values. */

export function isEnvSet(key: string): boolean {
  const value = process.env[key];
  return Boolean(value && value.trim().length > 0);
}

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export function isStripeConfigured(): boolean {
  return isEnvSet("STRIPE_SECRET_KEY") && isEnvSet("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
}

export function isRedisConfigured(): boolean {
  return isEnvSet("REDIS_URL");
}

export function isOpenAiConfigured(): boolean {
  return isEnvSet("OPENAI_API_KEY");
}

export function isReplicateConfigured(): boolean {
  return isEnvSet("REPLICATE_API_TOKEN");
}

export function isHuggingFaceConfigured(): boolean {
  return isEnvSet("HUGGINGFACE_API_KEY");
}

export function isS3Configured(): boolean {
  return (
    process.env.STORAGE_PROVIDER === "s3" &&
    isEnvSet("S3_BUCKET") &&
    isEnvSet("S3_ACCESS_KEY_ID") &&
    isEnvSet("S3_SECRET_ACCESS_KEY") &&
    isEnvSet("S3_ENDPOINT")
  );
}

export function isComfyUiConfigured(): boolean {
  return isEnvSet("COMFYUI_ENDPOINT");
}

export function isCustomWorkerConfigured(): boolean {
  return isEnvSet("CUSTOM_WORKER_ENDPOINT");
}

export function isGoogleOAuthConfigured(): boolean {
  return isEnvSet("AUTH_GOOGLE_ID") && isEnvSet("AUTH_GOOGLE_SECRET");
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}
