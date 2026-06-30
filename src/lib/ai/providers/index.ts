import type { ProviderAdapter } from "@/lib/ai/providers/types";
import { isDemoMode, isReplicateConfigured } from "@/lib/config/env";
import { comfyUIProvider } from "@/lib/ai/providers/comfyui";
import { customWorkerProvider } from "@/lib/ai/providers/custom-worker";
import { huggingFaceProvider } from "@/lib/ai/providers/huggingface";
import { MockProvider, mockProvider } from "@/lib/ai/providers/mock";
import { replicateProvider } from "@/lib/ai/providers/replicate";

const providers = new Map<string, ProviderAdapter>([
  ["mock", mockProvider],
  ["replicate", replicateProvider],
  ["huggingface", huggingFaceProvider],
  ["comfyui", comfyUIProvider],
  ["custom-worker", customWorkerProvider],
]);

export function registerProvider(provider: ProviderAdapter): void {
  providers.set(provider.slug, provider);
}

export function getProvider(slug?: string | null): ProviderAdapter {
  const resolved = slug ?? process.env.DEFAULT_AI_PROVIDER ?? "mock";
  const provider = providers.get(resolved);

  if (!provider) {
    if (isDemoMode()) {
      console.warn(`[providers] "${resolved}" not registered — falling back to mock (demo mode)`);
      return mockProvider;
    }
    throw new Error(`AI provider "${resolved}" is not registered`);
  }

  if (resolved === "replicate" && !isReplicateConfigured()) {
    if (isDemoMode()) return mockProvider;
    throw new Error("Replicate provider is not configured (missing REPLICATE_API_TOKEN)");
  }

  if (resolved === "mock" && !isDemoMode()) {
    console.warn("[providers] Using mock provider in production — assign a real provider to models");
  }

  return provider;
}

export function listProviders(): ProviderAdapter[] {
  return Array.from(providers.values());
}

export { MockProvider };
