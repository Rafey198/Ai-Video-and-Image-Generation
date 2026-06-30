export type ModerationCategory =
  | "violence"
  | "sexual"
  | "hate"
  | "harassment"
  | "self_harm"
  | "illegal"
  | "minors"
  | "weapons"
  | "drugs";

export type ModerationResult = {
  allowed: boolean;
  flagged: boolean;
  categories: ModerationCategory[];
  reason?: string;
};

const BLOCKED_PATTERNS: Record<ModerationCategory, RegExp[]> = {
  violence: [/\b(gore|torture|dismember)\b/i],
  sexual: [/\b(explicit\s*nudity|pornograph)\b/i],
  hate: [/\b(nazi|genocide|ethnic\s*cleansing)\b/i],
  harassment: [/\b(doxx|stalk\s+and\s+harass)\b/i],
  self_harm: [/\b(suicide\s+method|self[- ]harm\s+instruction)\b/i],
  illegal: [/\b(child\s*porn|csam)\b/i],
  minors: [/\b(underage|minor\s+sexual)\b/i],
  weapons: [/\b(bomb\s+making|ied\s+instructions)\b/i],
  drugs: [/\b(meth\s+recipe|fentanyl\s+synthesis)\b/i],
};

export async function moderatePrompt(
  prompt: string,
  options?: { userId?: string; negativePrompt?: string }
): Promise<ModerationResult> {
  const text = [prompt, options?.negativePrompt].filter(Boolean).join(" ");
  const categories: ModerationCategory[] = [];

  for (const [category, patterns] of Object.entries(BLOCKED_PATTERNS) as [
    ModerationCategory,
    RegExp[],
  ][]) {
    if (patterns.some((pattern) => pattern.test(text))) {
      categories.push(category);
    }
  }

  if (categories.length > 0) {
    return {
      allowed: false,
      flagged: true,
      categories,
      reason: `Prompt blocked due to: ${categories.join(", ")}`,
    };
  }

  return {
    allowed: true,
    flagged: false,
    categories: [],
  };
}

export function isBlockedCategory(category: string): category is ModerationCategory {
  return category in BLOCKED_PATTERNS;
}
