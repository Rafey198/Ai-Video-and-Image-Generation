import type { ExportFormat } from "@prisma/client";
import { randomUUID } from "crypto";

import type { SeedBundle } from "./seed-data";
import type {
  FaqItem,
  GenerationInput,
  LogoConcept,
  PricingTier,
  RegenerateTarget,
  TemplateDesignJson,
  TemplateSection,
} from "./types";

const COLOR_PALETTES = [
  ["#0F172A", "#3B82F6", "#60A5FA", "#F8FAFC", "#94A3B8"],
  ["#1A1A2E", "#E94560", "#F5A623", "#FFFFFF", "#16213E"],
  ["#0D1B2A", "#1B998B", "#E8F1F2", "#FF6B35", "#2E4057"],
  ["#2D3142", "#EF8354", "#4F5D75", "#FFFFFF", "#BFC0C0"],
  ["#1B4332", "#40916C", "#95D5B2", "#D8F3DC", "#081C15"],
  ["#240046", "#7B2CBF", "#C77DFF", "#E0AAFF", "#10002B"],
];

const BRAND_STYLES = [
  "modern minimal",
  "corporate professional",
  "luxury premium",
  "tech forward",
  "playful creative",
  "bold startup",
  "clean editorial",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function buildSections(input: GenerationInput, seed: SeedBundle): TemplateSection[] {
  const features = seed.features ?? [
    "Streamlined workflow automation",
    "Real-time analytics dashboard",
    "Enterprise-grade security",
    "24/7 customer support",
    "Seamless integrations",
  ];

  const benefits = seed.benefits ?? [
    "Reduce operational costs by 40%",
    "Accelerate time-to-market",
    "Improve customer satisfaction",
    "Scale without complexity",
  ];

  const base: TemplateSection[] = [
    {
      id: randomUUID(),
      type: "hero",
      heading: seed.businessName ?? input.idea ?? "Your Business",
      body: seed.description ?? `Professional ${input.category.replace(/_/g, " ")} for ${input.audience ?? "modern businesses"}.`,
      order: 0,
    },
    {
      id: randomUUID(),
      type: "problem",
      heading: "The Challenge",
      body: (seed.painPoints ?? ["Inefficient processes", "Lack of visibility"]).join(". ") + ".",
      items: seed.painPoints,
      order: 1,
    },
    {
      id: randomUUID(),
      type: "solution",
      heading: "Our Solution",
      body: `We deliver ${input.goal ?? "measurable results"} through innovative approaches tailored to ${input.industry ?? "your industry"}.`,
      order: 2,
    },
    {
      id: randomUUID(),
      type: "features",
      heading: "Key Features",
      body: "Everything you need to succeed.",
      items: features,
      order: 3,
    },
    {
      id: randomUUID(),
      type: "benefits",
      heading: "Why Choose Us",
      body: "Transform your business outcomes.",
      items: benefits,
      order: 4,
    },
  ];

  if (seed.testimonials?.length) {
    base.push({
      id: randomUUID(),
      type: "testimonials",
      heading: "What Clients Say",
      body: String((seed.testimonials[0] as Record<string, string>)?.quote ?? "Outstanding results."),
      order: 5,
    });
  }

  if (seed.founderBio) {
    base.push({
      id: randomUUID(),
      type: "team",
      heading: "Leadership",
      body: seed.founderBio,
      order: 6,
    });
  }

  return base;
}

function buildPricing(seed: SeedBundle): PricingTier[] {
  if (seed.pricing?.length) {
    return (seed.pricing as Record<string, unknown>[]).map((p, i) => ({
      name: String(p.name ?? `Plan ${i + 1}`),
      price: String(p.price ?? "$49"),
      period: String(p.period ?? "/month"),
      features: Array.isArray(p.features) ? p.features.map(String) : ["Core features", "Email support"],
      highlighted: i === 1,
    }));
  }

  return [
    { name: "Starter", price: "$29", period: "/month", features: ["5 users", "Basic analytics", "Email support"] },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: ["25 users", "Advanced analytics", "Priority support", "API access"],
      highlighted: true,
    },
    { name: "Enterprise", price: "Custom", features: ["Unlimited users", "Dedicated manager", "SLA", "Custom integrations"] },
  ];
}

function buildFaq(seed: SeedBundle): FaqItem[] {
  if (seed.faqs?.length) {
    return (seed.faqs as Record<string, string>[]).map((f) => ({
      question: f.question ?? "How does it work?",
      answer: f.answer ?? "Our platform streamlines your workflow.",
    }));
  }

  return [
    { question: "How quickly can I get started?", answer: "Setup takes less than 5 minutes with our guided onboarding." },
    { question: "Is there a free trial?", answer: "Yes, all plans include a 14-day free trial with full access." },
    { question: "Can I cancel anytime?", answer: "Absolutely. No long-term contracts required." },
  ];
}

export function generateTemplateDesign(
  input: GenerationInput,
  seed: SeedBundle
): TemplateDesignJson {
  const palette =
    seed.colorPalette?.length === 5
      ? seed.colorPalette
      : input.colorPreference
        ? [input.colorPreference, ...pick(COLOR_PALETTES).slice(1)]
        : pick(COLOR_PALETTES);

  const title = seed.businessName ?? input.idea ?? `Professional ${input.category.replace(/_/g, " ")}`;
  const subtitle =
    seed.mission ??
    input.goal ??
    `Tailored ${input.category.replace(/_/g, " ")} for ${input.audience ?? "growth-focused teams"}`;

  return {
    title,
    subtitle,
    industry: seed.industry ?? input.industry ?? "Technology",
    targetAudience: seed.targetAudience ?? input.audience ?? "Business professionals",
    brandStyle: seed.visualStyle ?? input.stylePreference ?? pick(BRAND_STYLES),
    colorPalette: palette,
    sections: buildSections(input, seed),
    features: seed.features ?? ["Automation", "Analytics", "Security", "Integrations", "Support"],
    benefits: seed.benefits ?? ["Save time", "Reduce costs", "Scale faster", "Improve outcomes"],
    pricing: buildPricing(seed),
    faq: buildFaq(seed),
    cta: seed.ctas?.[0] ?? "Get Started Today",
    visualDirection: `Clean ${input.stylePreference ?? "modern"} layout with strong hierarchy, generous whitespace, and ${palette[1]} accent colors.`,
    exportFormats: (input.exportFormats ?? ["pdf", "png", "pptx", "json"]) as ExportFormat[],
  };
}

export function regeneratePartial(
  design: TemplateDesignJson,
  target: RegenerateTarget,
  seed: SeedBundle
): TemplateDesignJson {
  const updated = { ...design, sections: [...design.sections] };

  switch (target) {
    case "headline":
      updated.title = seed.businessName ?? `${design.title} — Refined`;
      updated.subtitle = seed.mission ?? design.subtitle;
      break;
    case "sections":
      updated.sections = buildSections(
        { type: "one_pager", category: "general", dataMode: "random_seed" },
        seed
      );
      break;
    case "pricing":
      updated.pricing = buildPricing(seed);
      break;
    case "cta":
      updated.cta = seed.ctas?.[0] ?? pick(["Start Free Trial", "Book a Demo", "Contact Us", "Get Started"]);
      break;
    case "design_style":
      updated.brandStyle = pick(BRAND_STYLES);
      updated.visualDirection = `Refreshed ${updated.brandStyle} aesthetic with premium typography.`;
      break;
    case "colors":
      updated.colorPalette = seed.colorPalette?.length === 5 ? seed.colorPalette : pick(COLOR_PALETTES);
      break;
    default:
      break;
  }

  return updated;
}

export async function callOpenAiJson(
  systemPrompt: string,
  userPrompt: string
): Promise<TemplateDesignJson | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    return JSON.parse(content) as TemplateDesignJson;
  } catch {
    return null;
  }
}

export function generateLogoConcepts(
  businessName: string,
  colors: string[],
  count: number,
  style: string
): LogoConcept[] {
  const concepts: LogoConcept[] = [];
  const primary = colors[0] ?? "#3B82F6";
  const secondary = colors[1] ?? "#1E293B";
  const accent = colors[2] ?? "#60A5FA";

  const styles = ["wordmark", "lettermark", "icon_text", "geometric", "minimal"];

  for (let i = 0; i < count; i++) {
    const conceptStyle = styles[i % styles.length]!;
    const initial = businessName.charAt(0).toUpperCase();
    let svg = "";

    switch (conceptStyle) {
      case "wordmark":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
          <text x="20" y="75" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" fill="${primary}">${escapeXml(businessName)}</text>
        </svg>`;
        break;
      case "lettermark":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
          <rect x="10" y="10" width="100" height="100" rx="20" fill="${primary}"/>
          <text x="60" y="78" font-family="Inter, Arial, sans-serif" font-size="56" font-weight="700" fill="#FFFFFF" text-anchor="middle">${initial}</text>
        </svg>`;
        break;
      case "icon_text":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
          <circle cx="50" cy="60" r="35" fill="${accent}"/>
          <path d="M35 60 L45 70 L70 40" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>
          <text x="100" y="72" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="600" fill="${secondary}">${escapeXml(businessName)}</text>
        </svg>`;
        break;
      case "geometric":
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
          <polygon points="30,90 60,30 90,90" fill="${primary}"/>
          <rect x="70" y="40" width="30" height="50" fill="${accent}"/>
          <text x="120" y="72" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="600" fill="${secondary}">${escapeXml(businessName)}</text>
        </svg>`;
        break;
      default:
        svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" width="400" height="120">
          <rect x="15" y="35" width="8" height="50" fill="${primary}"/>
          <text x="35" y="72" font-family="Inter, Arial, sans-serif" font-size="40" font-weight="300" fill="${secondary}">${escapeXml(businessName)}</text>
        </svg>`;
    }

    concepts.push({
      id: randomUUID(),
      name: `${conceptStyle.charAt(0).toUpperCase()}${conceptStyle.slice(1)} ${i + 1}`,
      style: `${style} ${conceptStyle}`,
      svg,
      colors: [primary, secondary, accent],
      rationale: `A ${conceptStyle} logo concept reflecting ${style} aesthetics with clean vector shapes suitable for all media.`,
    });
  }

  return concepts;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
