/** Maps VireoMorph registry slugs to external Replicate model identifiers. */

export type ReplicateInputMode =
  | "text_to_image"
  | "image_to_image"
  | "image_enhance"
  | "text_to_video"
  | "image_to_video"
  | "text_to_audio"
  | "text_to_speech"
  | "lip_sync";

export type ReplicateModelRef = {
  owner: string;
  name: string;
  version?: string;
  inputMode?: ReplicateInputMode;
  requiresImage?: boolean;
  requiresAudio?: boolean;
};

export const LIVE_TEST_IMAGE_URL =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=768&h=768&fit=crop";

export const REPLICATE_MODEL_MAP: Record<string, ReplicateModelRef> = {
  // Image — text to image
  "flux-1-schnell": { owner: "black-forest-labs", name: "flux-schnell", inputMode: "text_to_image" },
  sdxl: {
    owner: "stability-ai",
    name: "sdxl",
    version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613",
    inputMode: "text_to_image",
  },
  "sd-3-5": { owner: "stability-ai", name: "stable-diffusion-3.5-large", inputMode: "text_to_image" },
  "stable-diffusion-3-5": { owner: "stability-ai", name: "stable-diffusion-3.5-large", inputMode: "text_to_image" },
  "pixart-sigma": { owner: "cjwbw", name: "pixart-alpha", inputMode: "text_to_image" },
  kolors: { owner: "kwaivgi", name: "kolors", inputMode: "text_to_image" },
  kandinsky: { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613", inputMode: "text_to_image" },

  // Image — enhancement / editing (need reference image)
  "birefnet-rmbg": { owner: "cjwbw", name: "rembg", inputMode: "image_enhance", requiresImage: true },
  "real-esrgan": { owner: "nightmareai", name: "real-esrgan", inputMode: "image_enhance", requiresImage: true },
  gfpgan: { owner: "tencentarc", name: "gfpgan", inputMode: "image_enhance", requiresImage: true },
  codeformer: { owner: "sczhou", name: "codeformer", inputMode: "image_enhance", requiresImage: true },
  controlnet: { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613", inputMode: "text_to_image" },
  "ip-adapter": { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613", inputMode: "text_to_image" },
  instantid: { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613", inputMode: "text_to_image" },
  brushnet: { owner: "stability-ai", name: "sdxl", version: "39ed52f2a78e934b3ba6e2a89f5f1eb78b5a2613", inputMode: "text_to_image" },

  // Video — text / image to video
  "wan-2-1-t2v": { owner: "wan-video", name: "wan-2.1-1.3b", inputMode: "text_to_video" },
  "wan-2-2-t2v": { owner: "wan-video", name: "wan-2.1-1.3b", inputMode: "text_to_video" },
  "wan-2-2-i2v": { owner: "wan-video", name: "wan-2.1-i2v-480p", inputMode: "image_to_video", requiresImage: true },
  "ltx-video": { owner: "lightricks", name: "ltx-video", inputMode: "text_to_video" },
  "ltx-2": { owner: "lightricks", name: "ltx-video", inputMode: "text_to_video" },
  "ltx-video-lora": { owner: "lightricks", name: "ltx-video", inputMode: "text_to_video" },
  "mochi-1": { owner: "genmo", name: "mochi-1", inputMode: "text_to_video" },
  hunyuanvideo: { owner: "lightricks", name: "ltx-video", inputMode: "text_to_video" },
  cogvideox: { owner: "lightricks", name: "ltx-video", inputMode: "text_to_video" },
  videocrafter: { owner: "anotherjesse", name: "zeroscope-v2-xl", inputMode: "text_to_video" },
  "open-sora-2": { owner: "anotherjesse", name: "zeroscope-v2-xl", inputMode: "text_to_video" },
  animatediff: { owner: "anotherjesse", name: "zeroscope-v2-xl", inputMode: "text_to_video" },
  "animatediff-controlnet": { owner: "anotherjesse", name: "zeroscope-v2-xl", inputMode: "text_to_video" },
  "wan-vace": { owner: "wan-video", name: "wan-2.1-1.3b", inputMode: "text_to_video" },
  vace: { owner: "wan-video", name: "wan-2.1-1.3b", inputMode: "text_to_video" },
  "skyreels-v3-v2v": { owner: "anotherjesse", name: "zeroscope-v2-xl", inputMode: "text_to_video" },

  // Audio
  musicgen: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  audiocraft: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  audiogen: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  "stable-audio-open": { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  "ace-step": { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  "ace-step-1-5": { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  mmaudio: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  amphion: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  tango: { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },
  "tango-2": { owner: "meta", name: "musicgen", inputMode: "text_to_audio" },

  // Speech / TTS
  "xtts-v2": { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  openvoice: { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  "f5-tts": { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  "styletts-2": { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  cosyvoice: { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  "fish-speech": { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },
  piper: { owner: "lucataco", name: "xtts-v2", inputMode: "text_to_speech" },

  // Lip sync / sync studio
  musetalk: { owner: "lucataco", name: "sadtalker", inputMode: "lip_sync", requiresImage: true },
  wav2lip: { owner: "devxpy", name: "wav2lip", inputMode: "lip_sync", requiresImage: true },
  sadtalker: { owner: "cjwbw", name: "sadtalker", inputMode: "lip_sync", requiresImage: true },
  liveportrait: { owner: "lucataco", name: "live-portrait", inputMode: "lip_sync", requiresImage: true },
  "ltx-lipdub": { owner: "cjwbw", name: "sadtalker", inputMode: "lip_sync", requiresImage: true },
};

export function resolveReplicateModel(slug: string): ReplicateModelRef | null {
  return REPLICATE_MODEL_MAP[slug] ?? null;
}

export function isReplicateModelMapped(slug: string): boolean {
  return Boolean(REPLICATE_MODEL_MAP[slug]);
}

export function listMappedModelSlugs(): string[] {
  return Object.keys(REPLICATE_MODEL_MAP);
}

export function replicateModelVersion(ref: ReplicateModelRef): string {
  if (ref.version) return ref.version;
  return `${ref.owner}/${ref.name}`;
}
