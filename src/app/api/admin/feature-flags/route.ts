import { Prisma } from "@prisma/client";
import { z } from "zod";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const updateFlagsSchema = z.object({
  flags: z.array(
    z.object({
      key: z.string().trim().min(1),
      enabled: z.boolean().optional(),
      config: z.record(z.unknown()).optional(),
      name: z.string().optional(),
      description: z.string().optional(),
    })
  ),
});

export async function GET() {
  try {
    await requireAdmin();

    const flags = await prisma.featureFlag.findMany({
      orderBy: { key: "asc" },
    });

    return json({ flags, count: flags.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const { flags } = updateFlagsSchema.parse(body);

    const updated = await prisma.$transaction(
      flags.map((flag) =>
        prisma.featureFlag.upsert({
          where: { key: flag.key },
          create: {
            key: flag.key,
            name: flag.name ?? flag.key,
            description: flag.description,
            enabled: flag.enabled ?? false,
            config: (flag.config ?? {}) as Prisma.InputJsonValue,
          },
          update: {
            ...(flag.enabled !== undefined ? { enabled: flag.enabled } : {}),
            ...(flag.config !== undefined ? { config: flag.config as Prisma.InputJsonValue } : {}),
            ...(flag.name !== undefined ? { name: flag.name } : {}),
            ...(flag.description !== undefined ? { description: flag.description } : {}),
          },
        })
      )
    );

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.user.id,
        action: "feature_flags.update",
        details: { keys: flags.map((f) => f.key) },
      },
    });

    return json({ flags: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
