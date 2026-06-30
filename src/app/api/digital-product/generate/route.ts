import { NextRequest } from "next/server";
import { GenerationDataMode } from "@prisma/client";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import {
  DigitalProductError,
  generateDigitalProduct,
  generationInputSchema,
} from "@/lib/digital-product/service";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const input = generationInputSchema.parse({
      ...body,
      dataMode: body.dataMode ?? GenerationDataMode.user_provided,
    });

    const products = await generateDigitalProduct(session.user.id, input);
    return json({ products, count: products.length }, 201);
  } catch (error) {
    if (error instanceof DigitalProductError) {
      return json({ error: error.message, code: error.code }, error.statusCode);
    }
    return handleApiError(error);
  }
}
