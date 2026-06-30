import { NextRequest } from "next/server";
import { ExportFormat } from "@prisma/client";
import { z } from "zod";

import { handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { DigitalProductError, exportProduct } from "@/lib/digital-product/service";

const exportSchema = z.object({
  productId: z.string(),
  format: z.nativeEnum(ExportFormat),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = exportSchema.parse(await req.json());

    const result = await exportProduct(session.user.id, body.productId, body.format);
    return json({
      export: result.exportRecord,
      downloadUrl: result.downloadUrl,
      contentType: result.contentType,
    });
  } catch (error) {
    if (error instanceof DigitalProductError) {
      return json({ error: error.message, code: error.code }, error.statusCode);
    }
    return handleApiError(error);
  }
}
