import type { FAQItem } from "@/components/marketing/FAQAccordion";
import type { ModelCard } from "@/components/marketing/ModelShowcase";
import type { PricingTier } from "@/components/marketing/PricingCards";
import type { ShowcaseItem } from "@/components/marketing/ShowcaseGrid";

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Explore VireoMorph with starter credits.",
    price: 0,
    interval: "month",
    credits: 100,
    features: [
      "100 monthly credits",
      "Image generation",
      "Community gallery access",
      "Standard queue priority",
    ],
    ctaLabel: "Start free",
    ctaHref: "/register",
  },
  {
    id: "creator",
    name: "Creator",
    description: "For solo creators shipping content weekly.",
    price: 19,
    interval: "month",
    credits: 2_000,
    features: [
      "2,000 monthly credits",
      "Image & video generation",
      "Style presets library",
      "1080p exports",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals who need speed and scale.",
    price: 49,
    interval: "month",
    credits: 8_000,
    highlighted: true,
    features: [
      "8,000 monthly credits",
      "All media modalities",
      "Priority generation queue",
      "4K video exports",
      "API access (beta)",
      "Team workspace (3 seats)",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    description: "For production teams and agencies.",
    price: 149,
    interval: "month",
    credits: 30_000,
    features: [
      "30,000 monthly credits",
      "Dedicated model routing",
      "Custom style presets",
      "Advanced moderation controls",
      "SSO & audit logs",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom deployments, SLAs, and compliance.",
    price: 0,
    interval: "month",
    credits: 0,
    features: [
      "Unlimited seats",
      "Private model endpoints",
      "VPC / on-prem options",
      "Custom credit pools",
      "Dedicated success manager",
      "SOC 2 & GDPR support",
    ],
    ctaLabel: "Contact sales",
    ctaHref: "/enterprise",
  },
];

export const FEATURED_MODELS: ModelCard[] = [
  {
    id: "flux-dev",
    name: "FLUX.1 Dev",
    provider: "Black Forest Labs",
    type: "image",
    description: "Photorealistic image generation with exceptional prompt adherence.",
    credits: 4,
    featured: true,
  },
  {
    id: "wan-22",
    name: "Wan 2.2",
    provider: "Alibaba",
    type: "video",
    description: "Cinematic text-to-video with smooth motion and temporal consistency.",
    credits: 24,
    featured: true,
  },
  {
    id: "stable-audio",
    name: "Stable Audio",
    provider: "Stability AI",
    type: "audio",
    description: "Generate music and soundscapes aligned to your creative brief.",
    credits: 8,
  },
  {
    id: "sdxl",
    name: "SDXL",
    provider: "Stability AI",
    type: "image",
    description: "Versatile diffusion model for illustrations, concepts, and edits.",
    credits: 2,
  },
  {
    id: "runway-gen3",
    name: "Gen-3 Alpha",
    provider: "Runway",
    type: "video",
    description: "High-fidelity video generation with camera motion control.",
    credits: 32,
    featured: true,
  },
  {
    id: "elevenlabs-sfx",
    name: "ElevenLabs SFX",
    provider: "ElevenLabs",
    type: "audio",
    description: "Context-aware sound effects for video and interactive media.",
    credits: 6,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is VireoMorph?",
    answer:
      "VireoMorph is a premium AI creative studio for generating, animating, remixing, and syncing images, videos, and audio in one unified workspace.",
  },
  {
    question: "How do credits work?",
    answer:
      "Each generation consumes credits based on the model, resolution, and duration. Your plan includes a monthly credit pool; unused credits do not roll over unless noted on your plan.",
  },
  {
    question: "Can I use outputs commercially?",
    answer:
      "Commercial rights depend on the underlying model license. VireoMorph surfaces license status per model so you can verify usage before publishing.",
  },
  {
    question: "Which models are available?",
    answer:
      "We integrate leading image, video, and audio models from providers like Stability AI, Runway, and more. Browse the full catalogue on the Models page.",
  },
  {
    question: "Is my content private?",
    answer:
      "Yes. By default, generations are private to your account. You control visibility per project—private, workspace, or public showcase.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Pro and Studio plans include shared workspaces. Enterprise adds SSO, audit logs, custom credit pools, and dedicated support.",
  },
  {
    question: "How is content moderated?",
    answer:
      "We apply multi-layer safety filters, blocked category rules, and optional human review for flagged content. See our Safety Policy for details.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Subscriptions can be canceled from billing settings. You retain access through the end of your billing period.",
  },
];

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "1",
    title: "Neon City Drift",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    author: "Maya Chen",
    tags: ["cyberpunk", "cinematic"],
  },
  {
    id: "2",
    title: "Ethereal Portrait",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    author: "Alex Rivera",
    tags: ["portrait", "fantasy"],
  },
  {
    id: "3",
    title: "Ambient Pulse",
    type: "audio",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    author: "Studio K",
    tags: ["ambient", "sync"],
  },
  {
    id: "4",
    title: "Ocean Horizon",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
    author: "Jordan Lee",
    tags: ["landscape", "nature"],
  },
  {
    id: "5",
    title: "Kinetic Typography",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    author: "Pixel Forge",
    tags: ["motion", "brand"],
  },
  {
    id: "6",
    title: "Synthwave Drive",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    author: "Neon Labs",
    tags: ["retro", "automotive"],
  },
  {
    id: "7",
    title: "Botanical Study",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&q=80",
    author: "Elena Voss",
    tags: ["macro", "botanical"],
  },
  {
    id: "8",
    title: "Cinematic Score",
    type: "audio",
    thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    author: "Aurora Media",
    tags: ["orchestral", "film"],
  },
  {
    id: "9",
    title: "Abstract Flow",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1557672172-298ba090a0e1?w=800&q=80",
    author: "Creative Axis",
    tags: ["abstract", "fluid"],
  },
  {
    id: "10",
    title: "Product Hero",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    author: "Studio Alpha",
    tags: ["product", "commercial"],
  },
  {
    id: "11",
    title: "Voice Sync Demo",
    type: "audio",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231d799?w=800&q=80",
    author: "Synthwave Co",
    tags: ["voice", "lip-sync"],
  },
  {
    id: "12",
    title: "Architectural Vision",
    type: "image",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    author: "Form & Light",
    tags: ["architecture", "concept"],
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-vireomorph",
    title: "Introducing VireoMorph: The Unified AI Creative Studio",
    excerpt:
      "Today we're launching VireoMorph—a premium platform for generating, animating, remixing, and syncing media across image, video, and audio.",
    date: "2026-06-15",
    author: "VireoMorph Team",
    category: "Product",
    readTime: "5 min read",
    content: `We're excited to introduce VireoMorph, a new kind of AI creative studio built for professionals who need more than single-modality tools.

## One workspace, every modality

VireoMorph unifies image generation, video animation, audio synthesis, and lip-sync pipelines in a single dashboard. No more juggling five different subscriptions or exporting between incompatible formats.

## Built for teams

Shared workspaces, role-based access, and audit-ready infrastructure mean creative agencies and in-house teams can collaborate without sacrificing control.

## Model-agnostic by design

We route to the best model for each task—FLUX for stills, Wan for motion, Stable Audio for soundscapes—so you always get optimal quality without managing provider APIs yourself.

Ready to create? [Start with free credits](/register).`,
  },
  {
    slug: "choosing-the-right-video-model",
    title: "Choosing the Right Video Model for Your Project",
    excerpt:
      "A practical guide to Wan 2.2, Runway Gen-3, and other video models—when to use each and how credits scale with duration.",
    date: "2026-06-08",
    author: "Maya Chen",
    category: "Guides",
    readTime: "8 min read",
    content: `Not all video models are created equal. Here's how we think about model selection at VireoMorph.

## Text-to-video vs image-to-video

Start with image-to-video when you have a strong keyframe. Use text-to-video when you're exploring concepts from scratch.

## Duration and credits

Longer clips consume more credits per second. Our credit estimator shows the cost before you generate—no surprises on your invoice.

## License awareness

Always check the commercial license badge on each model card before publishing client work.`,
  },
  {
    slug: "safety-and-moderation-update",
    title: "Safety & Moderation: What We Block and Why",
    excerpt:
      "An overview of our content safety pipeline, blocked categories, and how creators can appeal moderation decisions.",
    date: "2026-05-28",
    author: "Trust & Safety",
    category: "Safety",
    readTime: "6 min read",
    content: `Responsible AI creation requires robust safety systems. Here's how VireoMorph protects creators and communities.

## Multi-layer filtering

Prompts and outputs pass through category classifiers, blocklists, and optional human review for edge cases.

## Transparency

When content is blocked, we explain the category—not just a generic error—so you can adjust and retry.

## Appeals

Enterprise customers can request manual review through their account manager. All users can read our full [Safety Policy](/safety).`,
  },
];

export const ENTERPRISE_FEATURES = [
  {
    title: "Dedicated infrastructure",
    description: "Private model endpoints, VPC peering, and optional on-premise deployment.",
  },
  {
    title: "Unlimited collaboration",
    description: "SSO, SCIM provisioning, granular roles, and workspace-level audit logs.",
  },
  {
    title: "Custom credit economics",
    description: "Volume discounts, pooled credits across teams, and predictable annual billing.",
  },
  {
    title: "Compliance & security",
    description: "SOC 2 readiness, GDPR data processing agreements, and encryption at rest.",
  },
  {
    title: "Priority support",
    description: "Dedicated success manager, SLA-backed response times, and onboarding workshops.",
  },
  {
    title: "API & integrations",
    description: "Production API keys, webhooks, and custom provider routing for your stack.",
  },
];
