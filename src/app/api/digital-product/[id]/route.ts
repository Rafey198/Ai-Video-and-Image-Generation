import { NextRequest } from "next/server";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { DigitalProductError } from "@/lib/digital-product/service";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const product = await prisma.digitalProduct.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
      include: {
        generatedDesign: true,
        logoProject: true,
        brandKit: true,
        spreadsheet: { include: { sheets: true } },
        exports: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!product) {
      throw new DigitalProductError("Product not found", "NOT_FOUND", 404);
    }

    return json({ product });
  } catch (error) {
    if (error instanceof DigitalProductError) {
      return json({ error: error.message, code: error.code }, error.statusCode);
    }
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await req.json();

    const product = await prisma.digitalProduct.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
    });

    if (!product) {
      throw new DigitalProductError("Product not found", "NOT_FOUND", 404);
    }

    const updated = await prisma.digitalProduct.update({
      where: { id },
      data: {
        title: body.title ?? product.title,
        contentJson: body.contentJson ?? product.contentJson,
        designJson: body.designJson ?? product.designJson,
        settingsJson: body.settingsJson ?? product.settingsJson,
      },
    });

    return json({ product: updated });
  } catch (error) {
    if (error instanceof DigitalProductError) {
      return json({ error: error.message, code: error.code }, error.statusCode);
    }
    return handleApiError(error);
  }
}
