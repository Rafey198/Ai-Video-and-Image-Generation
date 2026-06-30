import type { ProviderAdapter } from "@/lib/ai/providers/types";
import { isReplicateConfigured } from "@/lib/config/env";
import { getDemoMode } from "@/lib/config/runtime";
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

export async function getProvider(slug?: string | null): Promise<ProviderAdapter> {
  const demoMode = await getDemoMode();
  const resolved = slug ?? process.env.DEFAULT_AI_PROVIDER ?? "mock";
  const provider = providers.get(resolved);

  if (!provider) {
    if (demoMode) {
      console.warn(`[providers] "${resolved}" not registered — falling back to mock (demo mode)`);
      return mockProvider;
    }
    throw new Error(`AI provider "${resolved}" is not registered`);
  }

  if (resolved === "replicate" && !isReplicateConfigured()) {
    if (demoMode) return mockProvider;
    throw new Error("Replicate provider is not configured (missing REPLICATE_API_TOKEN)");
  }

  if (resolved === "mock" && !demoMode) {
    console.warn("[providers] Using mock provider in production — assign a real provider to models");
  }

  return provider;
}

/** Prefer Replicate when a registry slug has a live mapping and demo mode is off. */
export async function resolveProviderForModel(
  modelSlug: string,
  providerSlug?: string | null
): Promise<ProviderAdapter> {
  const demoMode = await getDemoMode();
  const { isReplicateModelMapped } = await import("@/lib/ai/providers/model-map");

  if (!demoMode && isReplicateModelMapped(modelSlug) && isReplicateConfigured()) {
    return replicateProvider;
  }

  return getProvider(providerSlug);
}

export function listProviders(): ProviderAdapter[] {
  return Array.from(providers.values());
}

export { MockProvider };
