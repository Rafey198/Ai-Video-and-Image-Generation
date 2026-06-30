import { LicenseStatus } from "@prisma/client";
import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils";

const createModelSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).optional(),
  providerId: z.string().cuid().optional(),
  category: z.string().trim().min(1),
  taskType: z.string().trim().min(1),
  description: z.string().optional(),
  creditCostBase: z.number().int().min(0).default(1),
  creditCostPerSecond: z.number().min(0).default(0),
  licenseStatus: z.nativeEnum(LicenseStatus).optional(),
  enabled: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const enabled = searchParams.get("enabled");
    const category = searchParams.get("category") ?? undefined;

    const models = await prisma.aiModel.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(enabled === "true"
          ? { enabled: true }
          : enabled === "false"
            ? { enabled: false }
            : {}),
      },
      include: {
        provider: { select: { id: true, name: true, slug: true } },
        _count: { select: { generationJobs: true } },
      },
      orderBy: { name: "asc" },
    });

    return json({ models, count: models.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const data = createModelSchema.parse(body);

    const slug = data.slug ?? slugify(data.name);

    const existing = await prisma.aiModel.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("A model with this slug already exists", 409);
    }

    const model = await prisma.aiModel.create({
      data: {
        name: data.name,
        slug,
        providerId: data.providerId,
        category: data.category,
        taskType: data.taskType,
        description: data.description,
        creditCostBase: data.creditCostBase,
        creditCostPerSecond: data.creditCostPerSecond,
        licenseStatus: data.licenseStatus,
        enabled: data.enabled,
        featured: data.featured,
      },
      include: { provider: true },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.user.id,
        action: "model.create",
        target: model.id,
        details: { slug: model.slug, name: model.name },
      },
    });

    return json({ model }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
