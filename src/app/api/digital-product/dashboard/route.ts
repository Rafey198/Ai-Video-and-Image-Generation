import { NextRequest } from "next/server";
import { DigitalProductType } from "@prisma/client";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { getUserDashboard } from "@/lib/digital-product/service";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") as DigitalProductType | null;
    const search = searchParams.get("search") ?? undefined;
    const favorite = searchParams.get("favorite") === "true";

    const dashboard = await getUserDashboard(session.user.id, {
      type: type ?? undefined,
      search,
      favorite,
    });

    return json(dashboard);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return json({ error: "Product ID required" }, 400);
    }

    await prisma.digitalProduct.updateMany({
      where: { id: productId, userId: session.user.id },
      data: { deletedAt: new Date() },
    });

    return json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { productId, favorite } = body;

    if (!productId) {
      return json({ error: "Product ID required" }, 400);
    }

    await prisma.digitalProduct.updateMany({
      where: { id: productId, userId: session.user.id },
      data: { favorite: Boolean(favorite) },
    });

    return json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
