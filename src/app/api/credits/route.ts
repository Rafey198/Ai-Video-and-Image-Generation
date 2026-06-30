import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { getBalance } from "@/lib/credits/wallet";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
    const offset = Number(searchParams.get("offset") ?? 0);
    const type = searchParams.get("type") ?? undefined;

    const [balance, transactions, total] = await Promise.all([
      getBalance(session.user.id),
      prisma.creditTransaction.findMany({
        where: {
          userId: session.user.id,
          ...(type ? { type: type as never } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          job: {
            select: { id: true, type: true, status: true },
          },
        },
      }),
      prisma.creditTransaction.count({
        where: {
          userId: session.user.id,
          ...(type ? { type: type as never } : {}),
        },
      }),
    ]);

    return json({ balance, transactions, total, limit, offset });
  } catch (error) {
    return handleApiError(error);
  }
}
