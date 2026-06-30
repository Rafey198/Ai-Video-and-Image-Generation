import {
  JobStatus,
  LicenseStatus,
  MediaType,
  PrismaClient,
  TransactionType,
  UserRole,
  Visibility,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@vireomorph.dev";
const ADMIN_PASSWORD = "Admin123!";
const DEMO_EMAIL = "demo@vireomorph.dev";
const DEMO_PASSWORD = "Demo123!";

async function ensureDemoModeFlag() {
  await prisma.featureFlag.upsert({
    where: { key: "demo_mode" },
    create: {
      key: "demo_mode",
      name: "Demo Mode",
      description: "Use mock providers and placeholder outputs",
      enabled: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
    },
    update: {},
  });
}

type ModelSeed = {
  slug: string;
  name: string;
  providerSlug: string;
  category: string;
  taskType: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  supportedModes?: string[];
  minDuration?: number;
  maxDuration?: number;
  fixedDuration?: number;
  supportedAspectRatios?: string[];
  supportedResolutions?: string[];
  supportsAudio?: boolean;
  supportsVideo?: boolean;
  supportsImage?: boolean;
  supportsPrompt?: boolean;
  supportsNegativePrompt?: boolean;
  supportsSeed?: boolean;
  supportsReferenceImage?: boolean;
  supportsReferenceVideo?: boolean;
  supportsLipSync?: boolean;
  supportsInpainting?: boolean;
  supportsUpscaling?: boolean;
  supportsIdentityPreservation?: boolean;
  estimatedRuntime?: number;
  creditCostBase?: number;
  creditCostPerSecond?: number;
  licenseStatus?: LicenseStatus;
  commercialUseNote?: string;
  enabled?: boolean;
  featured?: boolean;
  safetyCategory?: string;
  capabilities?: { key: string; value: string }[];
};

const PROVIDERS = [
  { slug: "mock", name: "Mock Provider", type: "mock", endpoint: null, enabled: true, healthy: true },
  {
    slug: "huggingface",
    name: "Hugging Face",
    type: "huggingface",
    endpoint: "https://api-inference.huggingface.co",
    apiKeyHint: "hf_****",
    enabled: true,
    healthy: true,
  },
  {
    slug: "replicate",
    name: "Replicate",
    type: "replicate",
    endpoint: "https://api.replicate.com/v1",
    apiKeyHint: "r8_****",
    enabled: true,
    healthy: true,
  },
  {
    slug: "comfyui",
    name: "ComfyUI",
    type: "comfyui",
    endpoint: "http://localhost:8188",
    enabled: false,
    healthy: false,
  },
  {
    slug: "custom-worker",
    name: "Custom GPU Worker",
    type: "custom_worker",
    endpoint: "http://localhost:8000",
    apiKeyHint: "wk_****",
    enabled: false,
    healthy: true,
  },
] as const;

const PLANS = [
  {
    slug: "free",
    name: "Free",
    description: "Explore VireoMorph with trial credits and core models.",
    monthlyCredits: 100,
    priceMonthly: 0,
    priceYearly: 0,
    maxTeamMembers: 1,
    sortOrder: 0,
    features: ["100 monthly credits", "Image generation", "Basic models", "Private gallery", "Community support"],
  },
  {
    slug: "creator",
    name: "Creator",
    description: "For solo creators publishing images, video, and audio.",
    monthlyCredits: 1500,
    priceMonthly: 19,
    priceYearly: 190,
    maxTeamMembers: 1,
    sortOrder: 1,
    features: ["1,500 monthly credits", "All image & video models", "Audio studio", "HD exports", "Email support"],
  },
  {
    slug: "pro",
    name: "Pro",
    description: "Advanced workflows, sync studio, and priority queue.",
    monthlyCredits: 5000,
    priceMonthly: 49,
    priceYearly: 490,
    maxTeamMembers: 3,
    sortOrder: 2,
    features: ["5,000 monthly credits", "Sync & lip-sync models", "Priority queue", "API access", "Style presets"],
  },
  {
    slug: "studio",
    name: "Studio",
    description: "Teams producing at scale with workspaces and admin tools.",
    monthlyCredits: 15000,
    priceMonthly: 99,
    priceYearly: 990,
    maxTeamMembers: 10,
    sortOrder: 3,
    features: ["15,000 monthly credits", "Team workspaces", "Shared projects", "Advanced moderation", "SLA support"],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "Custom deployment, SSO, dedicated GPUs, and compliance.",
    monthlyCredits: 100000,
    priceMonthly: 0,
    priceYearly: 0,
    maxTeamMembers: 100,
    sortOrder: 4,
    features: ["Custom credit pools", "Dedicated workers", "SSO & audit logs", "Custom models", "24/7 support"],
  },
] as const;

const IMAGE_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const IMAGE_RES = ["512px", "768px", "1024px", "1536px"];
const VIDEO_RATIOS = ["16:9", "9:16", "1:1"];
const VIDEO_RES = ["480p", "720p", "1080p"];

const MODELS: ModelSeed[] = [
  // Image generation
  {
    slug: "flux-1-schnell",
    name: "FLUX.1 Schnell",
    providerSlug: "replicate",
    category: "image",
    taskType: "text_to_image",
    description: "Fast open-weight text-to-image model with exceptional prompt adherence.",
    inputTypes: ["prompt"],
    outputTypes: ["image"],
    supportedModes: ["text_to_image"],
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: IMAGE_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    featured: true,
    estimatedRuntime: 8,
  },
  {
    slug: "sdxl",
    name: "Stable Diffusion XL",
    providerSlug: "huggingface",
    category: "image",
    taskType: "text_to_image",
    description: "Industry-standard SDXL for photorealistic and artistic image generation.",
    inputTypes: ["prompt"],
    outputTypes: ["image"],
    supportedModes: ["text_to_image", "image_to_image"],
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: IMAGE_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    supportsReferenceImage: true,
    creditCostBase: 1,
    licenseStatus: LicenseStatus.open_weight_check_license,
    featured: true,
    estimatedRuntime: 12,
  },
  {
    slug: "sd-3-5",
    name: "Stable Diffusion 3.5",
    providerSlug: "replicate",
    category: "image",
    taskType: "text_to_image",
    description: "Latest SD architecture with improved typography and composition.",
    inputTypes: ["prompt"],
    outputTypes: ["image"],
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: IMAGE_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.commercial_license_required,
    estimatedRuntime: 15,
  },
  {
    slug: "pixart-sigma",
    name: "PixArt-Σ",
    providerSlug: "huggingface",
    category: "image",
    taskType: "text_to_image",
    description: "Efficient transformer diffusion for high-resolution image synthesis.",
    inputTypes: ["prompt"],
    outputTypes: ["image"],
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: ["1024px", "1536px"],
    supportsSeed: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 10,
  },
  {
    slug: "kolors",
    name: "Kolors",
    providerSlug: "huggingface",
    category: "image",
    taskType: "text_to_image",
    description: "Bilingual text-to-image model with strong aesthetic quality.",
    inputTypes: ["prompt"],
    outputTypes: ["image"],
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: IMAGE_RES,
    supportsNegativePrompt: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 14,
  },
  {
    slug: "kandinsky",
    name: "Kandinsky",
    providerSlug: "huggingface",
    category: "image",
    taskType: "text_to_image",
    description: "Versatile multimodal image generation with style control.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["image"],
    supportsReferenceImage: true,
    supportedAspectRatios: IMAGE_RATIOS,
    supportedResolutions: IMAGE_RES,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 18,
  },
  // Image editing / control
  {
    slug: "controlnet",
    name: "ControlNet",
    providerSlug: "comfyui",
    category: "image",
    taskType: "image_control",
    description: "Structural guidance for pose, depth, canny, and edge-conditioned generation.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["image"],
    supportsReferenceImage: true,
    supportsInpainting: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 20,
  },
  {
    slug: "ip-adapter",
    name: "IP-Adapter",
    providerSlug: "comfyui",
    category: "image",
    taskType: "image_style_transfer",
    description: "Image-prompt adapter for style and subject reference conditioning.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["image"],
    supportsReferenceImage: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 16,
  },
  {
    slug: "instantid",
    name: "InstantID",
    providerSlug: "comfyui",
    category: "image",
    taskType: "face_preservation",
    description: "Zero-shot identity-preserving generation from a single reference face.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["image"],
    supportsReferenceImage: true,
    supportsIdentityPreservation: true,
    creditCostBase: 4,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 22,
  },
  {
    slug: "brushnet",
    name: "BrushNet",
    providerSlug: "comfyui",
    category: "image",
    taskType: "inpainting",
    description: "Brush-guided inpainting and region editing for precise local changes.",
    inputTypes: ["prompt", "image", "mask"],
    outputTypes: ["image"],
    supportsInpainting: true,
    supportsReferenceImage: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 18,
  },
  {
    slug: "sam-2",
    name: "SAM 2",
    providerSlug: "huggingface",
    category: "image",
    taskType: "segmentation",
    description: "Segment Anything Model 2 for image and video object segmentation.",
    inputTypes: ["image", "video"],
    outputTypes: ["mask"],
    supportsReferenceImage: true,
    supportsReferenceVideo: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 10,
  },
  {
    slug: "grounded-sam",
    name: "Grounded-SAM",
    providerSlug: "huggingface",
    category: "image",
    taskType: "segmentation",
    description: "Text-grounded segmentation combining Grounding DINO with SAM.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["mask", "image"],
    supportsReferenceImage: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 14,
  },
  {
    slug: "birefnet-rmbg",
    name: "BiRefNet / RMBG",
    providerSlug: "replicate",
    category: "image",
    taskType: "background_removal",
    description: "High-quality background removal and matting for product and portrait shots.",
    inputTypes: ["image"],
    outputTypes: ["image", "mask"],
    supportsReferenceImage: true,
    creditCostBase: 1,
    licenseStatus: LicenseStatus.permissive,
    estimatedRuntime: 5,
  },
  // Enhancement / upscaling
  {
    slug: "real-esrgan",
    name: "Real-ESRGAN",
    providerSlug: "replicate",
    category: "image",
    taskType: "upscaling",
    description: "Practical image super-resolution for photos and illustrations.",
    inputTypes: ["image"],
    outputTypes: ["image"],
    supportsUpscaling: true,
    supportsReferenceImage: true,
    creditCostBase: 1,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 8,
  },
  {
    slug: "gfpgan",
    name: "GFPGAN",
    providerSlug: "replicate",
    category: "image",
    taskType: "face_restoration",
    description: "Face restoration and enhancement for degraded portrait images.",
    inputTypes: ["image"],
    outputTypes: ["image"],
    supportsUpscaling: true,
    supportsIdentityPreservation: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 10,
  },
  {
    slug: "codeformer",
    name: "CodeFormer",
    providerSlug: "replicate",
    category: "image",
    taskType: "face_restoration",
    description: "Robust face restoration with controllable fidelity trade-offs.",
    inputTypes: ["image"],
    outputTypes: ["image"],
    supportsIdentityPreservation: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 12,
  },
  {
    slug: "basicsr",
    name: "BasicSR",
    providerSlug: "custom-worker",
    category: "image",
    taskType: "upscaling",
    description: "Open-source super-resolution toolkit with multiple backbone models.",
    inputTypes: ["image"],
    outputTypes: ["image"],
    supportsUpscaling: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 15,
  },
  // Video generation
  {
    slug: "wan-2-1-t2v",
    name: "Wan 2.1 Text-to-Video",
    providerSlug: "replicate",
    category: "video",
    taskType: "text_to_video",
    description: "Open Wan 2.1 text-to-video with cinematic motion quality.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 8,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: VIDEO_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    creditCostBase: 10,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 120,
  },
  {
    slug: "wan-2-2-t2v",
    name: "Wan 2.2 Text-to-Video",
    providerSlug: "replicate",
    category: "video",
    taskType: "text_to_video",
    description: "Next-gen Wan 2.2 with improved temporal consistency and detail.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 10,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: VIDEO_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    creditCostBase: 12,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    featured: true,
    estimatedRuntime: 150,
  },
  {
    slug: "wan-2-2-i2v",
    name: "Wan 2.2 Image-to-Video",
    providerSlug: "replicate",
    category: "video",
    taskType: "image_to_video",
    description: "Animate still images into smooth video clips with Wan 2.2.",
    inputTypes: ["image", "prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceImage: true,
    minDuration: 3,
    maxDuration: 10,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: VIDEO_RES,
    supportsNegativePrompt: true,
    supportsSeed: true,
    creditCostBase: 8,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    featured: true,
    estimatedRuntime: 140,
  },
  {
    slug: "hunyuanvideo",
    name: "HunyuanVideo",
    providerSlug: "huggingface",
    category: "video",
    taskType: "text_to_video",
    description: "Tencent HunyuanVideo for high-fidelity text-to-video generation.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 4,
    maxDuration: 12,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: VIDEO_RES,
    creditCostBase: 15,
    creditCostPerSecond: 3,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 180,
  },
  {
    slug: "ltx-video",
    name: "LTX-Video",
    providerSlug: "replicate",
    category: "video",
    taskType: "text_to_video",
    description: "Efficient latent video diffusion for rapid clip generation.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 2,
    maxDuration: 8,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: ["480p", "720p"],
    creditCostBase: 6,
    creditCostPerSecond: 1.5,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 60,
  },
  {
    slug: "ltx-2",
    name: "LTX-2",
    providerSlug: "replicate",
    category: "video",
    taskType: "text_to_video",
    description: "LTX-2 upgraded architecture with longer coherent sequences.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 4,
    maxDuration: 16,
    supportedAspectRatios: VIDEO_RATIOS,
    supportedResolutions: VIDEO_RES,
    creditCostBase: 10,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 120,
  },
  {
    slug: "cogvideox",
    name: "CogVideoX",
    providerSlug: "huggingface",
    category: "video",
    taskType: "text_to_video",
    description: "CogVideoX open video generation with strong semantic alignment.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 10,
    creditCostBase: 12,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 160,
  },
  {
    slug: "mochi-1",
    name: "Mochi 1",
    providerSlug: "replicate",
    category: "video",
    taskType: "text_to_video",
    description: "Genmo Mochi 1 for expressive motion and stylized video output.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 8,
    creditCostBase: 14,
    creditCostPerSecond: 2.5,
    licenseStatus: LicenseStatus.commercial_license_required,
    estimatedRuntime: 200,
  },
  {
    slug: "skyreels-v2",
    name: "SkyReels V2",
    providerSlug: "custom-worker",
    category: "video",
    taskType: "text_to_video",
    description: "SkyReels V2 cinematic text-to-video for short-form storytelling.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 12,
    creditCostBase: 11,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.unknown_check_required,
    estimatedRuntime: 130,
  },
  {
    slug: "skyreels-v3",
    name: "SkyReels V3",
    providerSlug: "custom-worker",
    category: "video",
    taskType: "text_to_video",
    description: "SkyReels V3 with enhanced character consistency and camera control.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 3,
    maxDuration: 15,
    creditCostBase: 14,
    creditCostPerSecond: 2.5,
    licenseStatus: LicenseStatus.unknown_check_required,
    featured: true,
    estimatedRuntime: 160,
  },
  {
    slug: "open-sora-2",
    name: "Open-Sora 2.0",
    providerSlug: "huggingface",
    category: "video",
    taskType: "text_to_video",
    description: "Open-Sora 2.0 community video diffusion for research and prototyping.",
    inputTypes: ["prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    minDuration: 2,
    maxDuration: 8,
    creditCostBase: 8,
    creditCostPerSecond: 1.5,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 90,
  },
  {
    slug: "videocrafter",
    name: "VideoCrafter",
    providerSlug: "huggingface",
    category: "video",
    taskType: "text_to_video",
    description: "VideoCrafter toolkit for text-to-video and image-to-video workflows.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceImage: true,
    minDuration: 2,
    maxDuration: 8,
    creditCostBase: 7,
    creditCostPerSecond: 1.5,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 100,
  },
  {
    slug: "animatediff",
    name: "AnimateDiff",
    providerSlug: "comfyui",
    category: "video",
    taskType: "image_to_video",
    description: "Animate still images using motion modules on SD backbones.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceImage: true,
    minDuration: 2,
    maxDuration: 6,
    creditCostBase: 5,
    creditCostPerSecond: 1,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 45,
  },
  // Video editing
  {
    slug: "wan-vace",
    name: "Wan VACE",
    providerSlug: "replicate",
    category: "video",
    taskType: "video_to_video",
    description: "Wan video all-in-one creation and editing (VACE) pipeline.",
    inputTypes: ["video", "prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceVideo: true,
    minDuration: 3,
    maxDuration: 12,
    creditCostBase: 12,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 150,
  },
  {
    slug: "vace",
    name: "VACE",
    providerSlug: "replicate",
    category: "video",
    taskType: "video_to_video",
    description: "General-purpose video creation and editing with prompt guidance.",
    inputTypes: ["video", "prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceVideo: true,
    minDuration: 3,
    maxDuration: 10,
    creditCostBase: 10,
    creditCostPerSecond: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 130,
  },
  {
    slug: "skyreels-v3-v2v",
    name: "SkyReels V3 Video-to-Video",
    providerSlug: "custom-worker",
    category: "video",
    taskType: "video_to_video",
    description: "Remix and restyle existing footage with SkyReels V3.",
    inputTypes: ["video", "prompt"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceVideo: true,
    minDuration: 3,
    maxDuration: 15,
    creditCostBase: 13,
    creditCostPerSecond: 2.5,
    licenseStatus: LicenseStatus.unknown_check_required,
    estimatedRuntime: 170,
  },
  {
    slug: "animatediff-controlnet",
    name: "AnimateDiff + ControlNet",
    providerSlug: "comfyui",
    category: "video",
    taskType: "video_to_video",
    description: "Controlled video generation combining AnimateDiff with ControlNet.",
    inputTypes: ["prompt", "image", "video"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceImage: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 8,
    creditCostBase: 8,
    creditCostPerSecond: 1.5,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 80,
  },
  {
    slug: "ltx-video-lora",
    name: "LTX-Video LoRA Workflows",
    providerSlug: "comfyui",
    category: "video",
    taskType: "video_control",
    description: "LoRA and control workflows built on LTX-Video for custom styles.",
    inputTypes: ["prompt", "image"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsReferenceImage: true,
    minDuration: 2,
    maxDuration: 10,
    creditCostBase: 7,
    creditCostPerSecond: 1.5,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 70,
  },
  // Audio / music
  {
    slug: "audiocraft",
    name: "AudioCraft",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "music_generation",
    description: "Meta AudioCraft suite for music, sound, and audio compression.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 5,
    maxDuration: 30,
    creditCostBase: 4,
    creditCostPerSecond: 0.5,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 30,
  },
  {
    slug: "musicgen",
    name: "MusicGen",
    providerSlug: "replicate",
    category: "audio",
    taskType: "music_generation",
    description: "Text-to-music generation with melody and style conditioning.",
    inputTypes: ["prompt", "audio"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 5,
    maxDuration: 60,
    creditCostBase: 3,
    creditCostPerSecond: 0.4,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    featured: true,
    estimatedRuntime: 25,
  },
  {
    slug: "audiogen",
    name: "AudioGen",
    providerSlug: "replicate",
    category: "audio",
    taskType: "sound_effects",
    description: "Generate sound effects and ambient audio from text descriptions.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 1,
    maxDuration: 30,
    creditCostBase: 2,
    creditCostPerSecond: 0.3,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 15,
  },
  {
    slug: "ace-step",
    name: "ACE-Step",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "music_generation",
    description: "ACE-Step music generation with lyric and style support.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 10,
    maxDuration: 120,
    creditCostBase: 5,
    creditCostPerSecond: 0.5,
    licenseStatus: LicenseStatus.unknown_check_required,
    estimatedRuntime: 40,
  },
  {
    slug: "ace-step-1-5",
    name: "ACE-Step 1.5",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "music_generation",
    description: "Upgraded ACE-Step 1.5 with improved vocal and instrumental quality.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 10,
    maxDuration: 180,
    creditCostBase: 6,
    creditCostPerSecond: 0.6,
    licenseStatus: LicenseStatus.unknown_check_required,
    estimatedRuntime: 50,
  },
  {
    slug: "stable-audio-open",
    name: "Stable Audio Open",
    providerSlug: "replicate",
    category: "audio",
    taskType: "sound_effects",
    description: "Stability AI open audio model for sound design and effects.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 1,
    maxDuration: 47,
    creditCostBase: 3,
    creditCostPerSecond: 0.4,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 20,
  },
  {
    slug: "mmaudio",
    name: "MMAudio",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "video_to_audio",
    description: "Generate synchronized audio from video content automatically.",
    inputTypes: ["video"],
    outputTypes: ["audio"],
    supportsAudio: true,
    supportsVideo: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 30,
    creditCostBase: 4,
    creditCostPerSecond: 0.5,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 35,
  },
  {
    slug: "amphion",
    name: "Amphion",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "music_generation",
    description: "Open toolkit for audio, music, and speech generation research.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 5,
    maxDuration: 60,
    creditCostBase: 4,
    creditCostPerSecond: 0.4,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 30,
  },
  {
    slug: "tango",
    name: "Tango",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "text_to_audio",
    description: "Text-to-audio diffusion for environmental and Foley sounds.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 2,
    maxDuration: 20,
    creditCostBase: 2,
    creditCostPerSecond: 0.3,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 18,
  },
  {
    slug: "tango-2",
    name: "Tango 2",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "text_to_audio",
    description: "Improved Tango 2 with higher fidelity text-to-audio synthesis.",
    inputTypes: ["prompt"],
    outputTypes: ["audio"],
    supportsAudio: true,
    minDuration: 2,
    maxDuration: 30,
    creditCostBase: 3,
    creditCostPerSecond: 0.35,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 22,
  },
  // TTS / voice
  {
    slug: "piper",
    name: "Piper",
    providerSlug: "custom-worker",
    category: "audio",
    taskType: "text_to_speech",
    description: "Fast local neural text-to-speech with multiple voice packs.",
    inputTypes: ["text"],
    outputTypes: ["audio"],
    supportsAudio: true,
    fixedDuration: 0,
    creditCostBase: 1,
    licenseStatus: LicenseStatus.permissive,
    estimatedRuntime: 3,
  },
  {
    slug: "xtts-v2",
    name: "Coqui XTTS v2",
    providerSlug: "replicate",
    category: "audio",
    taskType: "text_to_speech",
    description: "Multilingual voice cloning and text-to-speech with few-shot samples.",
    inputTypes: ["text", "audio"],
    outputTypes: ["audio"],
    supportsAudio: true,
    supportsReferenceImage: false,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 8,
  },
  {
    slug: "openvoice",
    name: "OpenVoice",
    providerSlug: "replicate",
    category: "audio",
    taskType: "voice_cloning",
    description: "Instant voice cloning with granular style and tone control.",
    inputTypes: ["text", "audio"],
    outputTypes: ["audio"],
    supportsAudio: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 10,
  },
  {
    slug: "f5-tts",
    name: "F5-TTS",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "text_to_speech",
    description: "Flow-matching TTS with natural prosody and fast inference.",
    inputTypes: ["text"],
    outputTypes: ["audio"],
    supportsAudio: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 6,
  },
  {
    slug: "styletts-2",
    name: "StyleTTS 2",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "text_to_speech",
    description: "Human-level TTS with style diffusion and adversarial training.",
    inputTypes: ["text"],
    outputTypes: ["audio"],
    supportsAudio: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 8,
  },
  {
    slug: "cosyvoice",
    name: "CosyVoice",
    providerSlug: "huggingface",
    category: "audio",
    taskType: "text_to_speech",
    description: "Multilingual zero-shot TTS with emotional expressiveness.",
    inputTypes: ["text", "audio"],
    outputTypes: ["audio"],
    supportsAudio: true,
    creditCostBase: 3,
    licenseStatus: LicenseStatus.unknown_check_required,
    estimatedRuntime: 10,
  },
  {
    slug: "fish-speech",
    name: "Fish Speech",
    providerSlug: "custom-worker",
    category: "audio",
    taskType: "text_to_speech",
    description: "High-quality multilingual speech synthesis and voice conversion.",
    inputTypes: ["text", "audio"],
    outputTypes: ["audio"],
    supportsAudio: true,
    creditCostBase: 2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 7,
  },
  // Lip sync / sync
  {
    slug: "musetalk",
    name: "MuseTalk",
    providerSlug: "replicate",
    category: "sync",
    taskType: "lip_sync",
    description: "Real-time high-quality lip synchronization for talking-head video.",
    inputTypes: ["video", "audio"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsAudio: true,
    supportsLipSync: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 60,
    creditCostBase: 6,
    creditCostPerSecond: 1,
    licenseStatus: LicenseStatus.research_only,
    featured: true,
    estimatedRuntime: 45,
  },
  {
    slug: "wav2lip",
    name: "Wav2Lip",
    providerSlug: "replicate",
    category: "sync",
    taskType: "lip_sync",
    description: "Classic lip-sync model aligning mouth movement to any audio track.",
    inputTypes: ["video", "audio"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsAudio: true,
    supportsLipSync: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 120,
    creditCostBase: 4,
    creditCostPerSecond: 0.8,
    licenseStatus: LicenseStatus.non_commercial_check_required,
    estimatedRuntime: 30,
  },
  {
    slug: "sadtalker",
    name: "SadTalker",
    providerSlug: "replicate",
    category: "sync",
    taskType: "talking_avatar",
    description: "Generate talking head videos from a single portrait and audio.",
    inputTypes: ["image", "audio"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsAudio: true,
    supportsLipSync: true,
    supportsReferenceImage: true,
    minDuration: 2,
    maxDuration: 60,
    creditCostBase: 5,
    creditCostPerSecond: 0.9,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 40,
  },
  {
    slug: "liveportrait",
    name: "LivePortrait",
    providerSlug: "replicate",
    category: "sync",
    taskType: "portrait_animation",
    description: "Animate portraits with expressive head pose and lip movement.",
    inputTypes: ["image", "video"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsLipSync: true,
    supportsReferenceImage: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 30,
    creditCostBase: 5,
    creditCostPerSecond: 1,
    licenseStatus: LicenseStatus.research_only,
    estimatedRuntime: 35,
  },
  {
    slug: "ltx-lipdub",
    name: "LTX Lipdub / IC-LoRA",
    providerSlug: "comfyui",
    category: "sync",
    taskType: "lip_sync",
    description: "LTX-based lip dub workflows with IC-LoRA identity control.",
    inputTypes: ["video", "audio"],
    outputTypes: ["video"],
    supportsVideo: true,
    supportsAudio: true,
    supportsLipSync: true,
    supportsReferenceVideo: true,
    minDuration: 2,
    maxDuration: 30,
    creditCostBase: 7,
    creditCostPerSecond: 1.2,
    licenseStatus: LicenseStatus.open_weight_check_license,
    estimatedRuntime: 50,
  },
  // Safety / moderation
  {
    slug: "laion-nsfw",
    name: "LAION CLIP NSFW Detector",
    providerSlug: "mock",
    category: "safety",
    taskType: "content_classification",
    description: "CLIP-based NSFW classifier for prompt and output screening.",
    inputTypes: ["text", "image"],
    outputTypes: ["classification"],
    supportsImage: true,
    creditCostBase: 0,
    licenseStatus: LicenseStatus.open_weight_check_license,
    safetyCategory: "nsfw",
    enabled: true,
    estimatedRuntime: 1,
  },
  {
    slug: "laion-safety",
    name: "LAION Safety",
    providerSlug: "mock",
    category: "safety",
    taskType: "content_classification",
    description: "LAION safety classifier for harmful content detection.",
    inputTypes: ["text", "image"],
    outputTypes: ["classification"],
    supportsImage: true,
    creditCostBase: 0,
    licenseStatus: LicenseStatus.open_weight_check_license,
    safetyCategory: "safety",
    enabled: true,
    estimatedRuntime: 1,
  },
  {
    slug: "nudenet",
    name: "NudeNet",
    providerSlug: "mock",
    category: "safety",
    taskType: "content_classification",
    description: "Explicit content detection for images and video frames.",
    inputTypes: ["image"],
    outputTypes: ["classification"],
    supportsImage: true,
    creditCostBase: 0,
    licenseStatus: LicenseStatus.open_weight_check_license,
    safetyCategory: "nsfw",
    enabled: true,
    estimatedRuntime: 2,
  },
  {
    slug: "blip",
    name: "BLIP",
    providerSlug: "huggingface",
    category: "safety",
    taskType: "captioning",
    description: "Bootstrapping vision-language model for image captioning and moderation context.",
    inputTypes: ["image"],
    outputTypes: ["text"],
    supportsImage: true,
    creditCostBase: 0,
    licenseStatus: LicenseStatus.open_weight_check_license,
    safetyCategory: "captioning",
    enabled: true,
    estimatedRuntime: 3,
  },
  {
    slug: "blip-2",
    name: "BLIP-2",
    providerSlug: "huggingface",
    category: "safety",
    taskType: "captioning",
    description: "BLIP-2 vision-language model for detailed image understanding and safety review.",
    inputTypes: ["image"],
    outputTypes: ["text"],
    supportsImage: true,
    creditCostBase: 0,
    licenseStatus: LicenseStatus.open_weight_check_license,
    safetyCategory: "captioning",
    enabled: true,
    estimatedRuntime: 5,
  },
];

async function clearDatabase() {
  await prisma.moderationEvent.deleteMany();
  await prisma.adminAuditLog.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.creditTransaction.deleteMany();
  await prisma.generationSetting.deleteMany();
  await prisma.mediaFavorite.deleteMany();
  await prisma.projectAsset.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.project.deleteMany();
  await prisma.mediaFolder.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.workspaceMember.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.creditWallet.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.modelCapability.deleteMany();
  await prisma.aiModel.deleteMany();
  await prisma.modelProvider.deleteMany();
  await prisma.moderationRule.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.showcaseItem.deleteMany();
  await prisma.promptTemplate.deleteMany();
  await prisma.stylePreset.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();
}

async function seedProviders() {
  const map = new Map<string, string>();
  for (const p of PROVIDERS) {
    const provider = await prisma.modelProvider.create({
      data: {
        name: p.name,
        slug: p.slug,
        type: p.type,
        endpoint: p.endpoint ?? undefined,
        apiKeyHint: "apiKeyHint" in p ? p.apiKeyHint : undefined,
        enabled: p.enabled,
        healthy: p.healthy,
        config: {},
      },
    });
    map.set(p.slug, provider.id);
  }
  return map;
}

async function seedModels(providerMap: Map<string, string>) {
  for (const m of MODELS) {
    const providerId = providerMap.get(m.providerSlug);
    await prisma.aiModel.create({
      data: {
        name: m.name,
        slug: m.slug,
        providerId,
        category: m.category,
        taskType: m.taskType,
        description: m.description,
        inputTypes: m.inputTypes,
        outputTypes: m.outputTypes,
        supportedModes: m.supportedModes ?? [m.taskType],
        minDuration: m.minDuration,
        maxDuration: m.maxDuration,
        fixedDuration: m.fixedDuration,
        supportedAspectRatios: m.supportedAspectRatios ?? [],
        supportedResolutions: m.supportedResolutions ?? [],
        supportsAudio: m.supportsAudio ?? m.category === "audio",
        supportsVideo: m.supportsVideo ?? (m.category === "video" || m.category === "sync"),
        supportsImage: m.supportsImage ?? (m.category === "image" || m.category === "safety"),
        supportsPrompt: m.supportsPrompt ?? m.inputTypes.includes("prompt"),
        supportsNegativePrompt: m.supportsNegativePrompt ?? false,
        supportsSeed: m.supportsSeed ?? false,
        supportsReferenceImage: m.supportsReferenceImage ?? false,
        supportsReferenceVideo: m.supportsReferenceVideo ?? false,
        supportsLipSync: m.supportsLipSync ?? false,
        supportsInpainting: m.supportsInpainting ?? false,
        supportsUpscaling: m.supportsUpscaling ?? false,
        supportsIdentityPreservation: m.supportsIdentityPreservation ?? false,
        estimatedRuntime: m.estimatedRuntime,
        creditCostBase: m.creditCostBase ?? 1,
        creditCostPerSecond: m.creditCostPerSecond ?? 0,
        licenseStatus: m.licenseStatus ?? LicenseStatus.unknown_check_required,
        commercialUseNote: m.commercialUseNote,
        enabled: m.enabled ?? true,
        featured: m.featured ?? false,
        safetyCategory: m.safetyCategory,
        capabilities: m.capabilities
          ? { create: m.capabilities }
          : undefined,
      },
    });
  }
}

async function main() {
  console.log("🌱 Seeding VireoMorph database...");

  await clearDatabase();

  const [adminHash, demoHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 12),
    bcrypt.hash(DEMO_PASSWORD, 12),
  ]);

  const admin = await prisma.user.create({
    data: {
      name: "VireoMorph Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: UserRole.super_admin,
      emailVerified: new Date(),
    },
  });

  const demo = await prisma.user.create({
    data: {
      name: "Demo Creator",
      email: DEMO_EMAIL,
      passwordHash: demoHash,
      role: UserRole.creator,
      emailVerified: new Date(),
    },
  });

  const plans = await Promise.all(
    PLANS.map((plan) =>
      prisma.plan.create({
        data: {
          name: plan.name,
          slug: plan.slug,
          description: plan.description,
          monthlyCredits: plan.monthlyCredits,
          priceMonthly: plan.priceMonthly,
          priceYearly: plan.priceYearly,
          maxTeamMembers: plan.maxTeamMembers,
          features: plan.features,
          sortOrder: plan.sortOrder,
          active: true,
        },
      })
    )
  );

  const creatorPlan = plans.find((p) => p.slug === "creator")!;
  const enterprisePlan = plans.find((p) => p.slug === "enterprise")!;

  await prisma.subscription.create({
    data: {
      userId: admin.id,
      planId: enterprisePlan.id,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.subscription.create({
    data: {
      userId: demo.id,
      planId: creatorPlan.id,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.creditWallet.create({
    data: { userId: admin.id, balance: 999_999 },
  });

  await prisma.creditWallet.create({
    data: { userId: demo.id, balance: 1250 },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Studio",
      slug: "demo-studio",
      ownerId: demo.id,
      members: {
        create: { userId: demo.id, role: UserRole.team_admin },
      },
    },
  });

  const providerMap = await seedProviders();
  await seedModels(providerMap);

  const modelBySlug = Object.fromEntries(
    (await prisma.aiModel.findMany({ select: { id: true, slug: true } })).map((m) => [m.slug, m.id])
  );

  const featureFlags = [
    { key: "demo_mode", name: "Demo Mode", description: "Use mock providers and placeholder outputs", enabled: process.env.NEXT_PUBLIC_DEMO_MODE === "true" },
    { key: "video_generation", name: "Video Generation", description: "Enable video studio and video models", enabled: true },
    { key: "audio_generation", name: "Audio Generation", description: "Enable audio studio and music models", enabled: true },
    { key: "sync_studio", name: "Sync Studio", description: "Enable lip-sync and AV sync workflows", enabled: true },
    { key: "api_access", name: "API Access", description: "Allow users to create API keys", enabled: true },
    { key: "workspace_teams", name: "Team Workspaces", description: "Enable multi-user workspaces", enabled: true },
    { key: "stripe_billing", name: "Stripe Billing", description: "Enable live Stripe checkout", enabled: false },
    { key: "public_gallery", name: "Public Gallery", description: "Allow public media sharing", enabled: true },
    { key: "3d_hero", name: "3D Hero", description: "Show Three.js hero on marketing pages", enabled: true },
    { key: "maintenance_mode", name: "Maintenance Mode", description: "Show maintenance banner and block generation", enabled: false },
    { key: "signup_enabled", name: "Signups Enabled", description: "Allow new user registrations", enabled: true },
    { key: "moderation_strict", name: "Strict Moderation", description: "Block prompts matching moderation rules", enabled: true },
  ];

  await prisma.featureFlag.createMany({ data: featureFlags });

  const moderationRules = [
    { name: "Minors - Sexual Content", category: "minors", description: "Block sexual content involving minors", pattern: "\\b(underage|minor\\s+sexual|child\\s+porn|csam)\\b", action: "block", severity: "critical" },
    { name: "Non-Consensual Deepfake", category: "illegal", description: "Block non-consensual intimate deepfakes", pattern: "\\b(non[- ]?consensual\\s+deepfake|revenge\\s+porn)\\b", action: "block", severity: "critical" },
    { name: "Explicit Sexual Transformations", category: "sexual", description: "Block explicit sexual transformation requests", pattern: "\\b(explicit\\s+nudity|pornograph|xxx)\\b", action: "block", severity: "high" },
    { name: "Celebrity Impersonation", category: "harassment", description: "Block unauthorized celebrity impersonation", pattern: "\\b(celebrity\\s+deepfake|impersonate\\s+celebrity)\\b", action: "block", severity: "high" },
    { name: "ID Document Editing", category: "illegal", description: "Block forged ID and document editing", pattern: "\\b(fake\\s+id|forge\\s+passport|counterfeit\\s+document)\\b", action: "block", severity: "critical" },
    { name: "Illegal Violence", category: "violence", description: "Block graphic violence and gore", pattern: "\\b(gore|torture|dismember|mass\\s+shooting)\\b", action: "block", severity: "high" },
    { name: "Hate Speech", category: "hate", description: "Block hate speech and genocide glorification", pattern: "\\b(nazi|genocide|ethnic\\s+cleansing)\\b", action: "block", severity: "high" },
    { name: "Harassment", category: "harassment", description: "Block doxxing and targeted harassment", pattern: "\\b(doxx|stalk\\s+and\\s+harass)\\b", action: "block", severity: "medium" },
    { name: "Self Harm", category: "self_harm", description: "Block self-harm instructions", pattern: "\\b(suicide\\s+method|self[- ]harm\\s+instruction)\\b", action: "block", severity: "critical" },
    { name: "Weapons Manufacturing", category: "weapons", description: "Block weapon manufacturing instructions", pattern: "\\b(bomb\\s+making|ied\\s+instructions|3d\\s+print\\s+gun)\\b", action: "block", severity: "critical" },
    { name: "Drug Synthesis", category: "drugs", description: "Block illegal drug synthesis instructions", pattern: "\\b(meth\\s+recipe|fentanyl\\s+synthesis)\\b", action: "block", severity: "critical" },
    { name: "Private Data Extraction", category: "illegal", description: "Block PII harvesting and data extraction", pattern: "\\b(extract\\s+private\\s+data|ssn\\s+lookup)\\b", action: "block", severity: "high" },
  ];

  await prisma.moderationRule.createMany({ data: moderationRules });

  const siteContent = [
    { key: "hero_title", section: "home", title: "Hero Title", content: "Generate. Animate. Remix. Sync." },
    { key: "hero_subtitle", section: "home", title: "Hero Subtitle", content: "Premium AI creative studio for images, video, audio, and sync — powered by 60+ open and commercial models." },
    { key: "hero_cta_primary", section: "home", title: "Primary CTA", content: "Start Creating" },
    { key: "hero_cta_secondary", section: "home", title: "Secondary CTA", content: "View Models" },
    { key: "features_intro", section: "features", title: "Features Intro", content: "Everything you need to go from prompt to polished media in one unified studio." },
    { key: "pricing_teaser", section: "pricing", title: "Pricing Teaser", content: "Start free with 100 credits. Upgrade when you're ready to scale." },
    { key: "security_headline", section: "security", title: "Security Headline", content: "Enterprise-grade safety built in" },
    { key: "security_body", section: "security", title: "Security Body", content: "Private galleries, moderation rules, audit logs, and role-based access control protect your creative work." },
    { key: "about_mission", section: "about", title: "Mission", content: "VireoMorph empowers creators and teams to produce world-class AI media without juggling dozens of tools." },
    { key: "enterprise_cta", section: "enterprise", title: "Enterprise CTA", content: "Contact sales for custom deployment, SSO, and dedicated GPU workers." },
    { key: "footer_tagline", section: "footer", title: "Footer Tagline", content: "Generate. Animate. Remix. Sync." },
    { key: "faq_support", section: "faq", title: "Support FAQ", content: "Reach our team at support@vireomorph.dev for billing, API, and integration help." },
  ];

  await prisma.siteContent.createMany({ data: siteContent });

  const blogPosts = [
    {
      slug: "getting-started-with-vireomorph",
      title: "Getting Started with VireoMorph",
      excerpt: "Learn how to create your first image, video, and audio generations in under five minutes.",
      content: `# Getting Started with VireoMorph\n\nWelcome to VireoMorph — your all-in-one AI creative studio.\n\n## Step 1: Create an account\nSign up for free and receive 100 trial credits.\n\n## Step 2: Choose a studio\nNavigate to Image, Video, Audio, or Sync studio depending on your project.\n\n## Step 3: Select a model\nPick from 60+ models in our registry. Each model card shows credit cost, capabilities, and license notes.\n\n## Step 4: Generate and remix\nSubmit your prompt, track job progress, and save outputs to your gallery.\n\nHappy creating!`,
      coverImage: "/placeholders/image-placeholder.svg",
      category: "tutorial",
      published: true,
      publishedAt: new Date("2025-01-15"),
    },
    {
      slug: "choosing-the-right-video-model",
      title: "Choosing the Right Video Model",
      excerpt: "A practical guide to Wan 2.2, LTX-Video, SkyReels, and other video models in the registry.",
      content: `# Choosing the Right Video Model\n\nVideo generation models differ in duration limits, resolution, motion quality, and licensing.\n\n## Text-to-video\n**Wan 2.2** excels at cinematic clips. **LTX-Video** is faster for drafts. **HunyuanVideo** offers high fidelity for non-commercial work.\n\n## Image-to-video\nUse **Wan 2.2 I2V** or **AnimateDiff** to breathe life into still frames.\n\n## Video-to-video\n**Wan VACE** and **SkyReels V3** support remixing and restyling existing footage.\n\nAlways check license status before commercial use.`,
      coverImage: "/placeholders/video-placeholder.svg",
      category: "guide",
      published: true,
      publishedAt: new Date("2025-02-01"),
    },
    {
      slug: "sync-studio-lip-sync-workflows",
      title: "Sync Studio: Lip-Sync Workflows",
      excerpt: "Combine MuseTalk, Wav2Lip, and LivePortrait for professional talking-head content.",
      content: `# Sync Studio Lip-Sync Workflows\n\nThe Sync Studio aligns audio with video for podcasts, ads, and social content.\n\n## MuseTalk\nBest for real-time quality lip sync on existing talking-head footage.\n\n## Wav2Lip\nReliable classic option for any face video plus audio track.\n\n## SadTalker & LivePortrait\nGenerate talking avatars from a single portrait image.\n\nUpload your assets, pick a model, and export a synced video to your gallery.`,
      coverImage: "/placeholders/audio-placeholder.svg",
      category: "tutorial",
      published: true,
      publishedAt: new Date("2025-03-10"),
    },
  ];

  await prisma.blogPost.createMany({ data: blogPosts });

  const showcaseItems = [
    { title: "Neon Cityscape", description: "Cyberpunk skyline at dusk", mediaType: MediaType.image, mediaUrl: "/placeholders/image-placeholder.svg", thumbnailUrl: "/placeholders/image-placeholder.svg", style: "Cinematic", modelSlug: "flux-1-schnell", featured: true, sortOrder: 1 },
    { title: "Portrait Study", description: "Editorial fashion portrait", mediaType: MediaType.image, mediaUrl: "/placeholders/image-placeholder.svg", thumbnailUrl: "/placeholders/image-placeholder.svg", style: "Editorial", modelSlug: "sdxl", featured: true, sortOrder: 2 },
    { title: "Product Hero", description: "Minimal product photography", mediaType: MediaType.image, mediaUrl: "/placeholders/image-placeholder.svg", thumbnailUrl: "/placeholders/image-placeholder.svg", style: "Commercial", modelSlug: "flux-1-schnell", featured: false, sortOrder: 3 },
    { title: "Abstract Waves", description: "Fluid generative art", mediaType: MediaType.image, mediaUrl: "/placeholders/image-placeholder.svg", thumbnailUrl: "/placeholders/image-placeholder.svg", style: "Abstract", modelSlug: "sd-3-5", featured: false, sortOrder: 4 },
    { title: "Ocean Timelapse", description: "Aerial ocean waves in golden hour", mediaType: MediaType.video, mediaUrl: "/placeholders/video-placeholder.svg", thumbnailUrl: "/placeholders/video-placeholder.svg", style: "Nature", modelSlug: "wan-2-2-t2v", featured: true, sortOrder: 5 },
    { title: "Character Walk", description: "Animated character loop", mediaType: MediaType.video, mediaUrl: "/placeholders/video-placeholder.svg", thumbnailUrl: "/placeholders/video-placeholder.svg", style: "Animation", modelSlug: "wan-2-2-i2v", featured: true, sortOrder: 6 },
    { title: "City Flythrough", description: "Drone-style urban flythrough", mediaType: MediaType.video, mediaUrl: "/placeholders/video-placeholder.svg", thumbnailUrl: "/placeholders/video-placeholder.svg", style: "Cinematic", modelSlug: "ltx-video", featured: false, sortOrder: 7 },
    { title: "Sky Reel Short", description: "Narrative short film clip", mediaType: MediaType.video, mediaUrl: "/placeholders/video-placeholder.svg", thumbnailUrl: "/placeholders/video-placeholder.svg", style: "Story", modelSlug: "skyreels-v3", featured: false, sortOrder: 8 },
    { title: "Synthwave Track", description: "Retro electronic music loop", mediaType: MediaType.audio, mediaUrl: "/placeholders/audio-placeholder.svg", thumbnailUrl: "/placeholders/audio-placeholder.svg", style: "Electronic", modelSlug: "musicgen", featured: true, sortOrder: 9 },
    { title: "Podcast Intro", description: "Voiceover with ambient bed", mediaType: MediaType.audio, mediaUrl: "/placeholders/audio-placeholder.svg", thumbnailUrl: "/placeholders/audio-placeholder.svg", style: "Voiceover", modelSlug: "xtts-v2", featured: false, sortOrder: 10 },
    { title: "Synced Interview", description: "Lip-synced talking head", mediaType: MediaType.video, mediaUrl: "/placeholders/video-placeholder.svg", thumbnailUrl: "/placeholders/video-placeholder.svg", style: "Sync", modelSlug: "musetalk", featured: true, sortOrder: 11 },
    { title: "Brand Anthem", description: "Orchestral brand music sting", mediaType: MediaType.audio, mediaUrl: "/placeholders/audio-placeholder.svg", thumbnailUrl: "/placeholders/audio-placeholder.svg", style: "Orchestral", modelSlug: "ace-step", featured: false, sortOrder: 12 },
  ];

  await prisma.showcaseItem.createMany({ data: showcaseItems });

  const stylePresets = [
    { name: "Cinematic", slug: "cinematic", category: "image", description: "Film-grade color grading and dramatic lighting", settings: { contrast: 1.2, saturation: 0.9, style: "cinematic" } },
    { name: "Anime", slug: "anime", category: "image", description: "Vibrant cel-shaded anime aesthetic", settings: { style: "anime", lineArt: true } },
    { name: "Photorealistic", slug: "photorealistic", category: "image", description: "Ultra-realistic photography style", settings: { style: "photo", detail: "high" } },
    { name: "Watercolor", slug: "watercolor", category: "image", description: "Soft painterly watercolor textures", settings: { style: "watercolor", brush: "soft" } },
    { name: "3D Render", slug: "3d-render", category: "image", description: "Clean CGI and octane-style renders", settings: { style: "3d", engine: "octane" } },
    { name: "Slow Motion", slug: "slow-motion", category: "video", description: "Smooth slow-motion emphasis", settings: { motion: "slow", fps: 60 } },
    { name: "Handheld", slug: "handheld", category: "video", description: "Documentary handheld camera feel", settings: { camera: "handheld", shake: 0.3 } },
    { name: "Drone Aerial", slug: "drone-aerial", category: "video", description: "Sweeping aerial cinematography", settings: { camera: "drone", motion: "pan" } },
    { name: "Lo-Fi Beats", slug: "lofi-beats", category: "audio", description: "Chill lo-fi hip hop production", settings: { genre: "lofi", bpm: 85 } },
    { name: "Epic Orchestral", slug: "epic-orchestral", category: "audio", description: "Trailer-style orchestral scoring", settings: { genre: "orchestral", mood: "epic" } },
    { name: "Corporate Voice", slug: "corporate-voice", category: "audio", description: "Professional narration tone", settings: { voice: "corporate", pace: "medium" } },
  ];

  await prisma.stylePreset.createMany({ data: stylePresets });

  const promptTemplates = [
    { name: "Product Hero Shot", category: "image", description: "Clean e-commerce product photography", content: "Professional product photo of {product} on minimalist background, studio lighting, 8k, commercial photography" },
    { name: "Landscape Vista", category: "image", description: "Epic landscape scene", content: "Breathtaking landscape of {location}, golden hour, volumetric light, ultra detailed, National Geographic style" },
    { name: "Character Portrait", category: "image", description: "Detailed character portrait", content: "Portrait of {character}, dramatic lighting, detailed face, {style} art style, sharp focus" },
    { name: "Social Clip Hook", category: "video", description: "Short-form video opener", content: "Dynamic 5-second video hook: {subject}, fast cuts, trending social media style, 9:16 vertical" },
    { name: "Cinematic B-Roll", category: "video", description: "Cinematic b-roll footage", content: "Cinematic b-roll of {scene}, smooth camera movement, shallow depth of field, 24fps film look" },
    { name: "Logo Animation", category: "video", description: "Logo reveal motion", content: "Elegant logo reveal animation for {brand}, particle effects, dark background, 3 seconds" },
    { name: "Podcast Intro", category: "audio", description: "Podcast opening music and voice", content: "Upbeat podcast intro music, 15 seconds, {genre} style, professional broadcast quality" },
    { name: "Ambient Soundscape", category: "audio", description: "Environmental ambient audio", content: "Immersive ambient soundscape of {environment}, seamless loop, high fidelity, no vocals" },
    { name: "Voiceover Read", category: "audio", description: "Professional narration", content: "Read the following in a warm, professional voice: {script}" },
    { name: "Lip Sync Dub", category: "sync", description: "Dub video with new audio", content: "Sync lip movement to provided audio track, natural expressions, maintain original lighting" },
    { name: "Talking Avatar", category: "sync", description: "Animate portrait with speech", content: "Animate portrait to speak provided audio, subtle head movement, realistic lip sync" },
  ];

  await prisma.promptTemplate.createMany({ data: promptTemplates });

  const folder = await prisma.mediaFolder.create({
    data: { userId: demo.id, name: "Demo Outputs" },
  });

  const demoJobs = [
    {
      modelSlug: "flux-1-schnell",
      type: "image",
      status: JobStatus.completed,
      prompt: "Futuristic luxury penthouse interior at night, violet neon accents, glass walls, ultra detailed",
      creditsCost: 2,
      progress: 100,
      asset: { type: MediaType.image, title: "Luxury Penthouse", url: "/placeholders/image-placeholder.svg", width: 1024, height: 1024 },
    },
    {
      modelSlug: "wan-2-2-i2v",
      type: "video",
      status: JobStatus.completed,
      prompt: "Camera slowly pans across a misty forest at sunrise, cinematic, 4k",
      creditsCost: 14,
      progress: 100,
      asset: { type: MediaType.video, title: "Forest Sunrise", url: "/placeholders/video-placeholder.svg", duration: 5, width: 1920, height: 1080 },
    },
    {
      modelSlug: "musicgen",
      type: "audio",
      status: JobStatus.completed,
      prompt: "Ambient electronic track with soft pads and subtle arpeggios, 30 seconds",
      creditsCost: 5,
      progress: 100,
      asset: { type: MediaType.audio, title: "Ambient Electronic", url: "/placeholders/audio-placeholder.svg", duration: 30 },
    },
    {
      modelSlug: "sdxl",
      type: "image",
      status: JobStatus.processing,
      prompt: "Abstract aurora borealis over mountains, vivid colors",
      creditsCost: 1,
      progress: 62,
      asset: null,
    },
    {
      modelSlug: "ltx-video",
      type: "video",
      status: JobStatus.failed,
      prompt: "Underwater coral reef timelapse",
      creditsCost: 8,
      progress: 0,
      errorMessage: "Provider timeout — credits refunded automatically",
      asset: null,
    },
    {
      modelSlug: "flux-1-schnell",
      type: "image",
      status: JobStatus.queued,
      prompt: "Minimalist logo design for AI creative studio, geometric vireo bird motif",
      creditsCost: 2,
      progress: 0,
      asset: null,
    },
  ] as const;

  for (const job of demoJobs) {
    const created = await prisma.generationJob.create({
      data: {
        userId: demo.id,
        workspaceId: workspace.id,
        modelId: modelBySlug[job.modelSlug],
        status: job.status,
        type: job.type,
        prompt: job.prompt,
        creditsCost: job.creditsCost,
        progress: job.progress,
        errorMessage: "errorMessage" in job ? job.errorMessage : undefined,
        startedAt: job.status !== JobStatus.queued ? new Date(Date.now() - 3600000) : undefined,
        completedAt: job.status === JobStatus.completed ? new Date(Date.now() - 1800000) : undefined,
        settings: { aspectRatio: "16:9", resolution: "1024px", demo: true },
      },
    });

    if (job.asset) {
      await prisma.mediaAsset.create({
        data: {
          userId: demo.id,
          workspaceId: workspace.id,
          jobId: created.id,
          folderId: folder.id,
          type: job.asset.type,
          title: job.asset.title,
          url: job.asset.url,
          thumbnailUrl: job.asset.url,
          width: "width" in job.asset ? job.asset.width : undefined,
          height: "height" in job.asset ? job.asset.height : undefined,
          duration: "duration" in job.asset ? job.asset.duration : undefined,
          mimeType: job.asset.type === MediaType.image ? "image/svg+xml" : job.asset.type === MediaType.video ? "video/mp4" : "audio/mpeg",
          visibility: Visibility.private,
          metadata: { seeded: true, demo: true },
        },
      });
    }

    if (job.status === JobStatus.completed) {
      await prisma.creditTransaction.create({
        data: {
          userId: demo.id,
          amount: -job.creditsCost,
          type: TransactionType.generation,
          description: `Generation: ${job.modelSlug}`,
          jobId: created.id,
        },
      });
    }

    if (job.status === JobStatus.failed) {
      await prisma.creditTransaction.create({
        data: {
          userId: demo.id,
          amount: job.creditsCost,
          type: TransactionType.refund,
          description: `Refund: failed ${job.modelSlug} job`,
          jobId: created.id,
        },
      });
    }
  }

  await prisma.notification.createMany({
    data: [
      { userId: demo.id, title: "Welcome to VireoMorph", message: "Your demo account is ready with 1,250 credits. Explore the studios!", type: "info", link: "/dashboard" },
      { userId: demo.id, title: "Generation complete", message: "Your FLUX penthouse image is ready in the gallery.", type: "success", link: "/gallery" },
      { userId: demo.id, title: "Job failed — credits refunded", message: "Your LTX-Video job timed out. 8 credits were returned to your wallet.", type: "warning", link: "/history" },
    ],
  });

  await prisma.prompt.create({
    data: {
      userId: demo.id,
      title: "Favorite penthouse prompt",
      content: "Futuristic luxury penthouse interior at night, violet neon accents, glass walls",
      tags: ["interior", "luxury", "neon"],
      favorite: true,
    },
  });

  await prisma.project.create({
    data: {
      userId: demo.id,
      workspaceId: workspace.id,
      name: "Brand Campaign Q1",
      description: "Demo project with mixed media assets",
    },
  });

  await prisma.systemLog.create({
    data: {
      level: "info",
      category: "seed",
      message: "Database seeded successfully",
      metadata: { models: MODELS.length, users: 2, plans: PLANS.length },
    },
  });

  const { seedDigitalProductData } = await import("./seed-digital-product");
  await seedDigitalProductData(prisma);

  await ensureDemoModeFlag();

  console.log(`✅ Seeded ${MODELS.length} AI models across ${PROVIDERS.length} providers`);
  console.log(`✅ Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`✅ Demo:  ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
