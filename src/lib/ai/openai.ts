import { getOpenAiModel, isOpenAiConfigured } from "@/lib/config/env";

export type EnhancePromptResult = {
  enhanced: string;
  model: string;
};

export async function enhancePrompt(prompt: string): Promise<EnhancePromptResult> {
  if (!isOpenAiConfigured()) {
    throw new Error("OpenAI is not configured");
  }

  const model = getOpenAiModel();
  const apiKey = process.env.OPENAI_API_KEY!;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            "You are a creative prompt engineer for AI image and video generation. " +
            "Enhance the user's prompt with vivid cinematic detail while preserving intent. " +
            "Return only the enhanced prompt text, no preamble.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI request failed (${res.status}): ${errText.slice(0, 150)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const enhanced = data.choices?.[0]?.message?.content?.trim();
  if (!enhanced) {
    throw new Error("OpenAI returned an empty response");
  }

  return { enhanced, model };
}

export async function checkOpenAiHealth(): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
  model?: string;
}> {
  if (!isOpenAiConfigured()) {
    return { ok: false, message: "OPENAI_API_KEY not configured" };
  }

  const model = getOpenAiModel();
  const start = Date.now();
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      signal: AbortSignal.timeout(8000),
    });
    return {
      ok: res.ok,
      message: res.ok ? `OpenAI reachable (model: ${model})` : `OpenAI returned ${res.status}`,
      latencyMs: Date.now() - start,
      model,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "OpenAI health check failed",
      latencyMs: Date.now() - start,
      model,
    };
  }
}
