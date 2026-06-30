import type { ProviderAdapter } from "@/lib/ai/providers/types";
import { MockProvider, mockProvider } from "@/lib/ai/providers/mock";

const providers = new Map<string, ProviderAdapter>([["mock", mockProvider]]);

export function registerProvider(provider: ProviderAdapter): void {
  providers.set(provider.slug, provider);
}

export function getProvider(slug?: string | null): ProviderAdapter {
  const resolved = slug ?? process.env.DEFAULT_AI_PROVIDER ?? "mock";
  const provider = providers.get(resolved);

  if (!provider) {
    if (resolved !== "mock") {
      console.warn(`AI provider "${resolved}" not found, falling back to mock`);
      return mockProvider;
    }
    throw new Error(`AI provider "${resolved}" is not registered`);
  }

  return provider;
}

export function listProviders(): ProviderAdapter[] {
  return Array.from(providers.values());
}

export { MockProvider };
