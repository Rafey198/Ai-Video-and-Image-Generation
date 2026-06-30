import { LicenseStatus } from "@prisma/client";
import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const updateModelSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).optional(),
  taskType: z.string().trim().min(1).optional(),
  description: z.string().nullable().optional(),
  providerId: z.string().cuid().nullable().optional(),
  creditCostBase: z.number().int().min(0).optional(),
  creditCostPerSecond: z.number().min(0).optional(),
  licenseStatus: z.nativeEnum(LicenseStatus).optional(),
  enabled: z.boolean().optional(),
  featured: z.boolean().optional(),
  commercialUseNote: z.string().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const data = updateModelSchema.parse(body);

    const existing = await prisma.aiModel.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Model not found", 404);
    }

    const model = await prisma.aiModel.update({
      where: { id },
      data,
      include: { provider: true },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.user.id,
        action: "model.update",
        target: id,
        details: data as object,
      },
    });

    return json({ model });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const admin = await requireAdmin();
    const { id } = await context.params;

    const existing = await prisma.aiModel.findUnique({
      where: { id },
      select: { id: true, slug: true, name: true },
    });

    if (!existing) {
      return errorResponse("Model not found", 404);
    }

    const jobCount = await prisma.generationJob.count({ where: { modelId: id } });
    if (jobCount > 0) {
      const model = await prisma.aiModel.update({
        where: { id },
        data: { enabled: false },
      });
      return json({
        model,
        message: "Model has existing jobs; disabled instead of deleted",
        softDeleted: true,
      });
    }

    await prisma.aiModel.delete({ where: { id } });

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.user.id,
        action: "model.delete",
        target: id,
        details: { slug: existing.slug, name: existing.name },
      },
    });

    return json({ message: "Model deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
