import { NextRequest } from "next/server";
import { DigitalProductType } from "@prisma/client";

import { handleApiError, json } from "@/lib/api/handler";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as DigitalProductType | null;
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");

    const templates = await prisma.template.findMany({
      where: {
        enabled: true,
        ...(type ? { productType: type } : {}),
        ...(featured ? { featured: true } : {}),
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      take: 50,
    });

    const categories = await prisma.templateCategory.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: "asc" },
    });

    return json({ templates, categories });
  } catch (error) {
    return handleApiError(error);
  }
}
