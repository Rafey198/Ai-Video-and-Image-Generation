import { z } from "zod";

import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const markReadSchema = z.object({
  ids: z.array(z.string().cuid()).min(1).optional(),
  markAllRead: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const unreadOnly = searchParams.get("unread") === "true";
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
    const offset = Number(searchParams.get("offset") ?? 0);

    const where = {
      userId: session.user.id,
      ...(unreadOnly ? { read: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: session.user.id, read: false },
      }),
    ]);

    return json({ notifications, total, unreadCount, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = markReadSchema.parse(body);

    if (data.markAllRead) {
      const result = await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
      return json({ updated: result.count, markAllRead: true });
    }

    if (!data.ids?.length) {
      return errorResponse("Provide ids or markAllRead", 400);
    }

    const result = await prisma.notification.updateMany({
      where: {
        id: { in: data.ids },
        userId: session.user.id,
      },
      data: { read: true },
    });

    return json({ updated: result.count, ids: data.ids });
  } catch (error) {
    return handleApiError(error);
  }
}
