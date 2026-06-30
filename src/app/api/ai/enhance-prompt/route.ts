import { z } from "zod";

import { enhancePrompt } from "@/lib/ai/openai";
import { errorResponse, handleApiError, json } from "@/lib/api/handler";
import { requireAuth } from "@/lib/auth/session";
import { isOpenAiConfigured } from "@/lib/config/env";
import { generationRateLimit } from "@/lib/security/rate-limit";

const schema = z.object({
  prompt: z.string().trim().min(3).max(4000),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    const rateLimit = generationRateLimit(`ai:enhance:${session.user.id}`);
    if (!rateLimit.success) {
      return errorResponse("Rate limit exceeded", 429);
    }

    if (!isOpenAiConfigured()) {
      return errorResponse("OpenAI is not configured", 503);
    }

    const body = await request.json();
    const { prompt } = schema.parse(body);

    const result = await enhancePrompt(prompt);
    return json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
