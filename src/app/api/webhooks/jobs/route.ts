import { createHmac, timingSafeEqual } from "crypto";

import { processJob } from "@/lib/ai/jobs";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { prisma } from "@/lib/db/prisma";
import { rateLimitByIp } from "@/lib/security/rate-limit";

function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = signature.replace(/^sha256=/, "");

  try {
    const expectedBuf = Buffer.from(expected, "hex");
    const providedBuf = Buffer.from(provided, "hex");
    if (expectedBuf.length !== providedBuf.length) {
      return false;
    }
    return timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const rateLimit = rateLimitByIp(request, "webhooks:jobs");
    if (!rateLimit.success) {
      return errorResponse("Too many requests", 429);
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // Signature verification placeholder — enforced when WEBHOOK_SECRET is set
    if (webhookSecret) {
      const valid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!valid) {
        return errorResponse("Invalid webhook signature", 401);
      }
    }

    const payload = JSON.parse(rawBody) as {
      event?: string;
      jobId?: string;
      providerJobId?: string;
      source?: string;
      data?: Record<string, unknown>;
    };

    const jobId = payload.jobId;
    const source = payload.source ?? "external";
    const event = payload.event ?? "job.update";

    await prisma.webhookEvent.create({
      data: {
        jobId,
        source,
        event,
        payload: payload as object,
        processed: false,
      },
    });

    if (jobId) {
      const job = await prisma.generationJob.findUnique({
        where: { id: jobId },
        select: { id: true },
      });

      if (job) {
        await processJob(jobId);
        await prisma.webhookEvent.updateMany({
          where: { jobId, processed: false },
          data: { processed: true },
        });
      }
    }

    return json({ received: true, event, jobId: jobId ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}
