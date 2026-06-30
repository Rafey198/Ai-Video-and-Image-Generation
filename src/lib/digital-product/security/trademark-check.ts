const FAMOUS_BRANDS = [
  "apple",
  "google",
  "microsoft",
  "amazon",
  "meta",
  "facebook",
  "instagram",
  "nike",
  "adidas",
  "coca-cola",
  "pepsi",
  "mcdonalds",
  "starbucks",
  "tesla",
  "bmw",
  "mercedes",
  "disney",
  "netflix",
  "spotify",
  "twitter",
  "x corp",
  "linkedin",
  "uber",
  "airbnb",
  "samsung",
  "sony",
  "ibm",
  "oracle",
  "salesforce",
  "adobe",
];

const IMITATION_PATTERNS = [
  /\bcopy\s+(the\s+)?logo\b/i,
  /\bclone\s+(the\s+)?brand\b/i,
  /\bimitate\s+.+\s+logo\b/i,
  /\breplicate\s+.+\s+branding\b/i,
  /\bexact\s+copy\s+of\b/i,
  /\btrademark\s+of\b/i,
];

export type TrademarkCheckResult = {
  allowed: boolean;
  warning?: string;
  flaggedBrands?: string[];
};

export function checkTrademarkPrompt(text: string): TrademarkCheckResult {
  const lower = text.toLowerCase();
  const flaggedBrands = FAMOUS_BRANDS.filter((brand) => lower.includes(brand));

  const hasImitationIntent = IMITATION_PATTERNS.some((p) => p.test(text));

  if (hasImitationIntent || flaggedBrands.length > 0) {
    return {
      allowed: false,
      warning:
        "Your request appears to reference famous brands or trademark imitation. Please describe your original brand identity instead.",
      flaggedBrands,
    };
  }

  return { allowed: true };
}
