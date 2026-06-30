/** Maps VireoMorph registry slugs to external provider model identifiers. */

export type ReplicateModelRef = {
  owner: string;
  name: string;
  version?: string;
};

export const REPLICATE_MODEL_MAP: Record<string, ReplicateModelRef> = {
  "flux-1-schnell": { owner: "black-forest-labs", name: "flux-schnell" },
  sdxl: { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613" },
  "stable-diffusion-3-5": { owner: "stability-ai", name: "stable-diffusion-3.5-large" },
  "pixart-sigma": { owner: "cjwbw", name: "pixart-alpha" },
};

export function resolveReplicateModel(slug: string): ReplicateModelRef | null {
  return REPLICATE_MODEL_MAP[slug] ?? null;
}

export function replicateModelVersion(ref: ReplicateModelRef): string {
  if (ref.version) return ref.version;
  return `${ref.owner}/${ref.name}`;
}
