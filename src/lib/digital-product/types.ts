import type { DigitalProductType, ExportFormat, GenerationDataMode } from "@prisma/client";

export type TemplateDesignJson = {
  title: string;
  subtitle: string;
  industry: string;
  targetAudience: string;
  brandStyle: string;
  colorPalette: string[];
  sections: TemplateSection[];
  features: string[];
  benefits: string[];
  pricing: PricingTier[];
  faq: FaqItem[];
  cta: string;
  visualDirection: string;
  exportFormats: ExportFormat[];
};

export type TemplateSection = {
  id: string;
  type: string;
  heading: string;
  body: string;
  items?: string[];
  order: number;
};

export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type GenerationInput = {
  type: DigitalProductType;
  category: string;
  dataMode: GenerationDataMode;
  count?: number;
  idea?: string;
  niche?: string;
  businessType?: string;
  industry?: string;
  audience?: string;
  goal?: string;
  colorPreference?: string;
  stylePreference?: string;
  brandingRequirement?: string;
  size?: string;
  exportFormats?: ExportFormat[];
  userData?: Record<string, unknown>;
  spreadsheetOptions?: SpreadsheetOptions;
  logoOptions?: LogoOptions;
  brochureOptions?: BrochureOptions;
};

export type SpreadsheetOptions = {
  templateType: string;
  tabCount?: number;
  dashboardType?: string;
  includeFormulas?: boolean;
  sampleData?: boolean;
  colorTheme?: string;
  mode?: "beginner" | "advanced";
  sheetsCompatible?: boolean;
};

export type LogoOptions = {
  businessName: string;
  tagline?: string;
  industry?: string;
  targetAudience?: string;
  brandPersonality?: string;
  preferredColors?: string[];
  colorsToAvoid?: string[];
  iconIdea?: string;
  typographyPreference?: string;
  stylePreference?: string;
  competitors?: string;
  values?: string[];
  logoUsage?: string;
  backgroundStory?: string;
  isRebrand?: boolean;
  conceptCount?: number;
};

export type BrochureOptions = {
  brochureType: string;
  foldType?: string;
  size?: string;
};

export type RegenerateTarget =
  | "full"
  | "headline"
  | "sections"
  | "pricing"
  | "cta"
  | "design_style"
  | "colors"
  | "spreadsheet_tabs"
  | "formulas"
  | "dashboard_layout";

export type PlanLimits = {
  maxGenerationsPerDay: number;
  maxBulkCount: number;
  watermark: boolean;
  allowedExports: ExportFormat[];
  maxExportsPerDay: number;
  brandingKits: boolean;
  zipBundles: boolean;
};

export type LogoConcept = {
  id: string;
  name: string;
  style: string;
  svg: string;
  colors: string[];
  rationale: string;
};

export type BulkPackItem = {
  type: DigitalProductType;
  category: string;
  title: string;
};
