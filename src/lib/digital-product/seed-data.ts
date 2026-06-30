import { prisma } from "@/lib/db/prisma";

export type SeedBundle = {
  businessName?: string;
  brandName?: string;
  industry?: string;
  category?: string;
  targetAudience?: string;
  painPoints?: string[];
  benefits?: string[];
  features?: string[];
  pricing?: unknown[];
  faqs?: unknown[];
  testimonials?: unknown[];
  caseStudies?: unknown[];
  ctas?: string[];
  description?: string;
  founderBio?: string;
  mission?: string;
  values?: string[];
  colorPalette?: string[];
  typography?: unknown;
  visualStyle?: string;
  layout?: string;
  contact?: unknown;
  socialLinks?: unknown;
  disclaimer?: string;
  licensing?: string;
};

const RECORD_TYPES = [
  "business_name",
  "brand_name",
  "industry",
  "category",
  "audience",
  "pain_point",
  "benefit",
  "feature",
  "pricing",
  "faq",
  "testimonial",
  "case_study",
  "cta",
  "description",
  "founder_bio",
  "mission",
  "value",
  "color_palette",
  "typography",
  "visual_style",
  "layout",
  "contact",
  "social",
  "disclaimer",
  "licensing",
] as const;

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export async function fetchRandomSeedBundle(industry?: string): Promise<SeedBundle> {
  const where = industry ? { industry } : {};

  const records = await prisma.seedBusinessData.findMany({
    where,
    take: 200,
    orderBy: { createdAt: "desc" },
  });

  if (records.length === 0) {
    const fallback = await prisma.seedBusinessData.findMany({ take: 200 });
    return buildBundleFromRecords(fallback);
  }

  return buildBundleFromRecords(records);
}

function buildBundleFromRecords(
  records: { recordType: string; content: unknown }[]
): SeedBundle {
  const byType = new Map<string, unknown[]>();
  for (const r of records) {
    const list = byType.get(r.recordType) ?? [];
    list.push(r.content);
    byType.set(r.recordType, list);
  }

  const getText = (type: string): string | undefined => {
    const items = byType.get(type);
    if (!items?.length) return undefined;
    const item = pickRandom(items) as Record<string, unknown>;
    return String(item?.text ?? item?.value ?? item?.name ?? "");
  };

  const getList = (type: string, count = 4): string[] => {
    const items = byType.get(type) ?? [];
    return pickMultiple(items, count).map((item) => {
      const obj = item as Record<string, unknown>;
      return String(obj?.text ?? obj?.value ?? obj?.name ?? obj?.title ?? "");
    }).filter(Boolean);
  };

  return {
    businessName: getText("business_name"),
    brandName: getText("brand_name"),
    industry: getText("industry"),
    category: getText("category"),
    targetAudience: getText("audience"),
    painPoints: getList("pain_point", 3),
    benefits: getList("benefit", 4),
    features: getList("feature", 5),
    pricing: byType.get("pricing")?.slice(0, 3),
    faqs: byType.get("faq")?.slice(0, 4),
    testimonials: byType.get("testimonial")?.slice(0, 2),
    caseStudies: byType.get("case_study")?.slice(0, 1),
    ctas: getList("cta", 2),
    description: getText("description"),
    founderBio: getText("founder_bio"),
    mission: getText("mission"),
    values: getList("value", 4),
    colorPalette: getList("color_palette", 5),
    typography: pickRandom(byType.get("typography") ?? []),
    visualStyle: getText("visual_style"),
    layout: getText("layout"),
    contact: pickRandom(byType.get("contact") ?? []),
    socialLinks: pickRandom(byType.get("social") ?? []),
    disclaimer: getText("disclaimer"),
    licensing: getText("licensing"),
  };
}

export async function fetchSpreadsheetSeed(templateType: string) {
  return prisma.seedSpreadsheetData.findMany({
    where: { templateType },
    orderBy: { createdAt: "asc" },
  });
}

export async function fetchIndustrySeed(industry: string) {
  return prisma.seedIndustryData.findFirst({
    where: { industry },
    orderBy: { createdAt: "desc" },
  });
}

export { RECORD_TYPES };
