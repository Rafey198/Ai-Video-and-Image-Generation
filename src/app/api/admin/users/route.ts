import { UserRole } from "@prisma/client";
import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAdmin } from "@/lib/auth/session";
import { grantCredits } from "@/lib/credits/wallet";
import { prisma } from "@/lib/db/prisma";

const updateUserSchema = z.object({
  userId: z.string().cuid(),
  role: z.nativeEnum(UserRole).optional(),
  suspended: z.boolean().optional(),
  grantCredits: z.number().int().positive().optional(),
});

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const role = searchParams.get("role") as UserRole | null;
    const suspended = searchParams.get("suspended");
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
    const offset = Number(searchParams.get("offset") ?? 0);

    const where = {
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: "insensitive" as const } },
              { name: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(role && Object.values(UserRole).includes(role) ? { role } : {}),
      ...(suspended === "true"
        ? { suspended: true }
        : suspended === "false"
          ? { suspended: false }
          : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          suspended: true,
          createdAt: true,
          creditWallet: { select: { balance: true } },
          _count: {
            select: { generationJobs: true, mediaAssets: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.user.count({ where }),
    ]);

    return json({ users, total, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const data = updateUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    const updated = await prisma.user.update({
      where: { id: data.userId },
      data: {
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.suspended !== undefined ? { suspended: data.suspended } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        suspended: true,
      },
    });

    if (data.grantCredits) {
      await grantCredits({
        userId: data.userId,
        amount: data.grantCredits,
        description: `Admin grant by ${admin.user.email}`,
        metadata: { adminId: admin.user.id },
      });
    }

    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.user.id,
        action: "user.update",
        target: data.userId,
        details: {
          role: data.role,
          suspended: data.suspended,
          grantCredits: data.grantCredits,
        },
      },
    });

    return json({ user: updated });
  } catch (error) {
    return handleApiError(error);
  }
}
