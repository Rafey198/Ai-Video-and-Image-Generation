import {
  DigitalProductStatus,
  DigitalProductType,
  ExportFormat,
  GenerationDataMode,
  Prisma,
} from "@prisma/client";
import { z } from "zod";

import {
  callOpenAiJson,
  generateLogoConcepts,
  generateTemplateDesign,
  regeneratePartial,
} from "./ai-generator";
import { fetchRandomSeedBundle } from "./seed-data";
import { buildWorkbookBuffer, getSheetNamesForTemplate } from "./spreadsheet/builder";
import { checkTrademarkPrompt } from "./security/trademark-check";
import { sanitizeSvg } from "./security/svg-sanitize";
import { exportDigitalProduct } from "./export";
import {
  canExportFormat,
  getMaxBulkCount,
  getPlanLimits,
  resolveUserStudioPlan,
} from "./plans";
import type { GenerationInput, RegenerateTarget, TemplateDesignJson } from "./types";
import { prisma } from "@/lib/db/prisma";
import { getStorageProvider } from "@/lib/storage";
import { moderatePrompt } from "@/lib/security/moderation";

export class DigitalProductError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = "DigitalProductError";
  }
}

export const generationInputSchema = z.object({
  type: z.nativeEnum(DigitalProductType),
  category: z.string().min(1),
  dataMode: z.nativeEnum(GenerationDataMode).default("user_provided"),
  count: z.number().int().min(1).max(100).optional(),
  idea: z.string().optional(),
  niche: z.string().optional(),
  businessType: z.string().optional(),
  industry: z.string().optional(),
  audience: z.string().optional(),
  goal: z.string().optional(),
  colorPreference: z.string().optional(),
  stylePreference: z.string().optional(),
  brandingRequirement: z.string().optional(),
  size: z.string().optional(),
  exportFormats: z.array(z.nativeEnum(ExportFormat)).optional(),
  userData: z.record(z.unknown()).optional(),
  spreadsheetOptions: z.object({
    templateType: z.string(),
    tabCount: z.number().optional(),
    dashboardType: z.string().optional(),
    includeFormulas: z.boolean().optional(),
    sampleData: z.boolean().optional(),
    colorTheme: z.string().optional(),
    mode: z.enum(["beginner", "advanced"]).optional(),
    sheetsCompatible: z.boolean().optional(),
  }).optional(),
  logoOptions: z.object({
    businessName: z.string(),
    tagline: z.string().optional(),
    industry: z.string().optional(),
    targetAudience: z.string().optional(),
    brandPersonality: z.string().optional(),
    preferredColors: z.array(z.string()).optional(),
    colorsToAvoid: z.array(z.string()).optional(),
    iconIdea: z.string().optional(),
    typographyPreference: z.string().optional(),
    stylePreference: z.string().optional(),
    competitors: z.string().optional(),
    values: z.array(z.string()).optional(),
    logoUsage: z.string().optional(),
    backgroundStory: z.string().optional(),
    isRebrand: z.boolean().optional(),
    conceptCount: z.number().int().min(5).max(20).optional(),
  }).optional(),
  brochureOptions: z.object({
    brochureType: z.string(),
    foldType: z.string().optional(),
    size: z.string().optional(),
  }).optional(),
});

export async function generateDigitalProduct(userId: string, input: GenerationInput) {
  const plan = await resolveUserStudioPlan(userId);
  const limits = getPlanLimits(plan);

  const count = input.count ?? 1;
  const maxCount = getMaxBulkCount(plan, count);
  if (count > maxCount) {
    throw new DigitalProductError(
      `Your plan allows up to ${limits.maxBulkCount} templates per batch`,
      "PLAN_LIMIT",
      403
    );
  }

  const promptText = [
    input.idea,
    input.logoOptions?.businessName,
    input.logoOptions?.iconIdea,
    input.brandingRequirement,
  ].filter(Boolean).join(" ");

  if (promptText) {
    const moderation = await moderatePrompt(promptText, { userId });
    if (!moderation.allowed) {
      throw new DigitalProductError(moderation.reason ?? "Prompt blocked", "MODERATION_BLOCKED", 422);
    }

    const trademark = checkTrademarkPrompt(promptText);
    if (!trademark.allowed) {
      throw new DigitalProductError(trademark.warning ?? "Trademark concern", "TRADEMARK_BLOCKED", 422);
    }
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayCount = await prisma.digitalProduct.count({
    where: { userId, createdAt: { gte: todayStart }, deletedAt: null },
  });

  if (todayCount + count > limits.maxGenerationsPerDay) {
    throw new DigitalProductError(
      `Daily generation limit reached (${limits.maxGenerationsPerDay})`,
      "GENERATION_LIMIT",
      429
    );
  }

  const results = [];

  for (let i = 0; i < count; i++) {
    const product = await createSingleProduct(userId, input, plan, i);
    results.push(product);
  }

  return results;
}

async function createSingleProduct(
  userId: string,
  input: GenerationInput,
  plan: Awaited<ReturnType<typeof resolveUserStudioPlan>>,
  index: number
) {
  const limits = getPlanLimits(plan);
  const seed = input.dataMode === "random_seed"
    ? await fetchRandomSeedBundle(input.industry)
    : await fetchRandomSeedBundle(input.industry);

  const aiPrompt = buildAiPrompt(input, seed);
  const aiResult = await callOpenAiJson(
    "You are a professional digital product designer. Return valid JSON matching the TemplateDesignJson schema with title, subtitle, industry, targetAudience, brandStyle, colorPalette, sections, features, benefits, pricing, faq, cta, visualDirection, exportFormats.",
    aiPrompt
  );

  const design = aiResult ?? generateTemplateDesign(input, seed);

  if (index > 0) {
    design.title = `${design.title} — Variant ${index + 1}`;
  }

  const product = await prisma.digitalProduct.create({
    data: {
      userId,
      type: input.type,
      category: input.category,
      title: design.title,
      subtitle: design.subtitle,
      industry: design.industry,
      status: DigitalProductStatus.ready,
      dataMode: input.dataMode,
      contentJson: design as unknown as Prisma.InputJsonValue,
      designJson: design as unknown as Prisma.InputJsonValue,
      settingsJson: (input as unknown as Record<string, unknown>) as Prisma.InputJsonValue,
      size: input.size,
      watermark: limits.watermark,
    },
  });

  await prisma.generatedDesign.create({
    data: {
      productId: product.id,
      userId,
      title: design.title,
      subtitle: design.subtitle,
      industry: design.industry,
      contentJson: design as unknown as Prisma.InputJsonValue,
      designJson: design as unknown as Prisma.InputJsonValue,
    },
  });

  if (input.type === "logo" || input.type === "branding_kit") {
    await createLogoProject(userId, product.id, input, design);
  }

  if (input.type === "spreadsheet" || input.type === "planner") {
    await createSpreadsheet(userId, product.id, input);
  }

  if (input.type === "branding_kit" && limits.brandingKits) {
    await createBrandKit(userId, product.id, design);
  }

  await prisma.userTemplateLibrary.create({
    data: { userId, productId: product.id },
  });

  return product;
}

async function createLogoProject(
  userId: string,
  productId: string,
  input: GenerationInput,
  design: TemplateDesignJson
) {
  const opts = input.logoOptions;
  const businessName = opts?.businessName ?? design.title;
  const conceptCount = opts?.conceptCount ?? 5;
  const style = opts?.stylePreference ?? design.brandStyle;

  const concepts = generateLogoConcepts(
    businessName,
    opts?.preferredColors ?? design.colorPalette,
    conceptCount,
    style
  );

  const selectedSvg = sanitizeSvg(concepts[0]!.svg);

  await prisma.logoProject.create({
    data: {
      productId,
      userId,
      businessName,
      tagline: opts?.tagline,
      briefJson: (opts ?? {}) as Prisma.InputJsonValue,
      conceptsJson: concepts as unknown as Prisma.InputJsonValue,
      selectedIndex: 0,
      svgContent: selectedSvg,
      rationale: concepts[0]!.rationale,
    },
  });
}

async function createSpreadsheet(userId: string, productId: string, input: GenerationInput) {
  const templateType = input.spreadsheetOptions?.templateType ?? input.category;
  const sheetNames = getSheetNamesForTemplate(templateType);

  const spreadsheet = await prisma.spreadsheetTemplate.create({
    data: {
      productId,
      userId,
      templateType,
      tabCount: sheetNames.length,
      theme: input.spreadsheetOptions?.colorTheme,
      mode: input.spreadsheetOptions?.sampleData === false ? "blank" : "sample",
      workbookJson: { sheets: sheetNames } as Prisma.InputJsonValue,
    },
  });

  await Promise.all(
    sheetNames.map((name, i) =>
      prisma.spreadsheetSheet.create({
        data: {
          spreadsheetId: spreadsheet.id,
          name,
          sortOrder: i,
          sheetJson: { name } as Prisma.InputJsonValue,
        },
      })
    )
  );
}

async function createBrandKit(userId: string, productId: string, design: TemplateDesignJson) {
  await prisma.brandKit.create({
    data: {
      productId,
      userId,
      colorPalette: design.colorPalette as unknown as Prisma.InputJsonValue,
      typography: { heading: "Inter", body: "Inter" } as Prisma.InputJsonValue,
      brandVoice: design.brandStyle,
      usageRules: [
        "Maintain clear space equal to the height of the logo mark",
        "Use primary color on light backgrounds",
        "Do not stretch or distort the logo",
      ] as unknown as Prisma.InputJsonValue,
      spacingGuide: { minClearSpace: "1x logo height", minSize: "24px" } as Prisma.InputJsonValue,
      doDontExamples: [
        { type: "do", text: "Use on solid backgrounds with sufficient contrast" },
        { type: "dont", text: "Apply effects like shadows or outlines" },
      ] as unknown as Prisma.InputJsonValue,
    },
  });
}

function buildAiPrompt(input: GenerationInput, seed: ReturnType<typeof fetchRandomSeedBundle> extends Promise<infer T> ? T : never): string {
  return JSON.stringify({
    request: input,
    seedData: seed,
    instruction: "Generate a professional template design as structured JSON.",
  });
}

export async function regenerateDigitalProduct(
  userId: string,
  productId: string,
  target: RegenerateTarget
) {
  const product = await prisma.digitalProduct.findFirst({
    where: { id: productId, userId, deletedAt: null },
    include: { generatedDesign: true },
  });

  if (!product) {
    throw new DigitalProductError("Product not found", "NOT_FOUND", 404);
  }

  const design = product.designJson as unknown as TemplateDesignJson;
  const seed = await fetchRandomSeedBundle(product.industry ?? undefined);

  const updated = target === "full"
    ? generateTemplateDesign(
        { type: product.type, category: product.category, dataMode: product.dataMode },
        seed
      )
    : regeneratePartial(design, target, seed);

  await prisma.digitalProduct.update({
    where: { id: productId },
    data: {
      title: updated.title,
      subtitle: updated.subtitle,
      contentJson: updated as unknown as Prisma.InputJsonValue,
      designJson: updated as unknown as Prisma.InputJsonValue,
    },
  });

  if (product.generatedDesign) {
    await prisma.generatedDesign.update({
      where: { id: product.generatedDesign.id },
      data: {
        title: updated.title,
        subtitle: updated.subtitle,
        contentJson: updated as unknown as Prisma.InputJsonValue,
        designJson: updated as unknown as Prisma.InputJsonValue,
        version: { increment: 1 },
      },
    });
  }

  return updated;
}

export async function exportProduct(
  userId: string,
  productId: string,
  format: ExportFormat
) {
  const plan = await resolveUserStudioPlan(userId);
  const limits = getPlanLimits(plan);

  if (!canExportFormat(plan, format)) {
    throw new DigitalProductError(
      `${format.toUpperCase()} export requires a higher plan`,
      "EXPORT_NOT_ALLOWED",
      403
    );
  }

  if (format === "zip" && !limits.zipBundles) {
    throw new DigitalProductError("ZIP bundles require Business plan", "EXPORT_NOT_ALLOWED", 403);
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const exportCount = await prisma.exportHistory.count({
    where: { userId, createdAt: { gte: todayStart } },
  });

  if (exportCount >= limits.maxExportsPerDay) {
    throw new DigitalProductError("Daily export limit reached", "EXPORT_LIMIT", 429);
  }

  const product = await prisma.digitalProduct.findFirst({
    where: { id: productId, userId, deletedAt: null },
    include: { logoProject: true, spreadsheet: true },
  });

  if (!product) {
    throw new DigitalProductError("Product not found", "NOT_FOUND", 404);
  }

  const design = product.designJson as unknown as TemplateDesignJson;

  const result = await exportDigitalProduct({
    format,
    design,
    watermark: product.watermark,
    svgContent: product.logoProject?.svgContent ?? undefined,
    spreadsheetType: product.spreadsheet?.templateType,
  });

  const storage = getStorageProvider();
  const { url, key } = await storage.upload(result.buffer, {
    contentType: result.contentType,
    folder: `digital-products/${userId}`,
    filename: `${product.id}.${result.extension}`,
  });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const exportRecord = await prisma.exportHistory.create({
    data: {
      userId,
      productId,
      format,
      fileUrl: url,
      fileSize: result.buffer.length,
      signedUrl: url,
      expiresAt,
      metadata: { key } as Prisma.InputJsonValue,
    },
  });

  return { exportRecord, downloadUrl: url, contentType: result.contentType };
}

export async function getUserDashboard(userId: string, filters?: {
  type?: DigitalProductType;
  search?: string;
  favorite?: boolean;
  includeDeleted?: boolean;
}) {
  const where: Prisma.DigitalProductWhereInput = {
    userId,
    ...(filters?.includeDeleted ? {} : { deletedAt: null }),
    ...(filters?.type ? { type: filters.type } : {}),
    ...(filters?.favorite ? { favorite: true } : {}),
    ...(filters?.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { category: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, exports, stats] = await Promise.all([
    prisma.digitalProduct.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        exports: { orderBy: { createdAt: "desc" }, take: 3 },
        logoProject: { select: { svgContent: true } },
        spreadsheet: { select: { templateType: true, tabCount: true } },
      },
    }),
    prisma.exportHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { product: { select: { title: true, type: true } } },
    }),
    prisma.digitalProduct.groupBy({
      by: ["type"],
      where: { userId, deletedAt: null },
      _count: true,
    }),
  ]);

  return { products, exports, stats };
}
