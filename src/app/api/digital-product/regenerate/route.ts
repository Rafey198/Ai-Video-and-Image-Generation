import { NextRequest } from "next/server";
import { DigitalProductType } from "@prisma/client";
import { z } from "zod";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import {
  DigitalProductError,
  regenerateDigitalProduct,
} from "@/lib/digital-product/service";
import type { RegenerateTarget } from "@/lib/digital-product/types";

const schema = z.object({
  productId: z.string(),
  target: z.enum([
    "full",
    "headline",
    "sections",
    "pricing",
    "cta",
    "design_style",
    "colors",
    "spreadsheet_tabs",
    "formulas",
    "dashboard_layout",
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = schema.parse(await req.json());

    const design = await regenerateDigitalProduct(
      session.user.id,
      body.productId,
      body.target as RegenerateTarget
    );

    return json({ design });
  } catch (error) {
    if (error instanceof DigitalProductError) {
      return json({ error: error.message, code: error.code }, error.statusCode);
    }
    return handleApiError(error);
  }
}
