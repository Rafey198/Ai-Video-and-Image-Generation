import type { DigitalProductType } from "@prisma/client";

export const ONE_PAGER_TYPES = [
  "startup",
  "product",
  "service",
  "investor",
  "agency_proposal",
  "ai_tool",
  "case_study",
  "pricing",
  "personal_brand",
  "course",
  "real_estate",
  "event",
] as const;

export const ONE_PAGER_SIZES = [
  { id: "us_letter", label: "US Letter (8.5 × 11 in)", width: 816, height: 1056 },
  { id: "a4", label: "A4 (8.27 × 11.69 in)", width: 794, height: 1123 },
  { id: "landscape_16_9", label: "16:9 Landscape", width: 1920, height: 1080 },
  { id: "square", label: "Square 1080 × 1080", width: 1080, height: 1080 },
  { id: "linkedin", label: "LinkedIn Portrait 1080 × 1350", width: 1080, height: 1350 },
  { id: "story", label: "Instagram Story 1080 × 1920", width: 1080, height: 1920 },
  { id: "custom", label: "Custom Size", width: 1080, height: 1350 },
] as const;

export const BUSINESS_TEMPLATE_CATEGORIES = [
  "business_plan",
  "company_profile",
  "pitch_document",
  "service_proposal",
  "pricing_sheet",
  "invoice",
  "contract_outline",
  "onboarding_checklist",
  "marketing_plan",
  "social_media_plan",
  "content_calendar",
  "client_intake_form",
  "brand_strategy_sheet",
  "business_model_canvas",
  "swot_analysis",
  "competitor_analysis",
  "customer_persona",
  "sales_sheet",
] as const;

export const BROCHURE_TYPES = [
  "tri_fold",
  "bi_fold",
  "single_page_flyer",
  "company",
  "product",
  "service",
  "real_estate",
  "restaurant",
  "clinic",
  "school",
  "event",
  "saas",
  "ai_agency",
] as const;

export const BROCHURE_SIZES = [
  { id: "a4", label: "A4" },
  { id: "us_letter", label: "US Letter" },
  { id: "tri_fold_us", label: "Tri-fold US Letter" },
  { id: "tri_fold_a4", label: "Tri-fold A4" },
  { id: "square", label: "Square Brochure" },
  { id: "custom", label: "Custom Size" },
] as const;

export const SPREADSHEET_TEMPLATES = [
  "ultimate_project_manager",
  "ultimate_budget",
  "weekly_planner_pro",
  "monthly_planner",
  "crm_tracker",
  "client_tracker",
  "invoice_tracker",
  "expense_tracker",
  "inventory_manager",
  "goal_tracker",
  "habit_tracker",
  "content_calendar",
  "social_media_planner",
  "fitness_tracker",
  "study_planner",
  "hr_attendance",
  "sales_dashboard",
  "finance_dashboard",
  "startup_kpi_dashboard",
  "real_estate_analyzer",
  "freelance_manager",
] as const;

export const PLANNER_CATEGORIES = [
  "yearly",
  "monthly",
  "weekly",
  "daily",
  "goal",
  "project",
  "client",
  "meeting_notes",
  "habit",
  "invoice_tracker",
  "expense_tracker",
  "reporting",
  "brainstorming",
] as const;

export const BULK_PACK_TYPES = [
  "business_startup_kit",
  "freelancer_kit",
  "agency_kit",
  "real_estate_kit",
  "budget_planner_bundle",
  "project_manager_bundle",
  "social_media_bundle",
  "fitness_coach_bundle",
  "student_planner_bundle",
  "content_creator_bundle",
  "etsy_digital_bundle",
] as const;

export const GENERATION_COUNTS = [1, 5, 10, 25, 50] as const;

export const GALLERY_FILTERS: { id: string; label: string; type?: DigitalProductType }[] = [
  { id: "all", label: "All Templates" },
  { id: "one_pager", label: "One-Pagers", type: "one_pager" },
  { id: "brochure", label: "Brochures", type: "brochure" },
  { id: "logo", label: "Logos", type: "logo" },
  { id: "branding_kit", label: "Branding Kits", type: "branding_kit" },
  { id: "spreadsheet", label: "Excel Templates", type: "spreadsheet" },
  { id: "planner", label: "Planners", type: "planner" },
  { id: "business_template", label: "Business Templates", type: "business_template" },
  { id: "bulk_pack", label: "Digital Packs", type: "bulk_pack" },
];

export const STUDIO_SECTIONS = [
  {
    id: "one-pager",
    href: "/digital-product/one-pager",
    title: "AI One-Pager Studio",
    description: "Create stunning one-page business documents in any size.",
    type: "one_pager" as DigitalProductType,
    icon: "FileText",
  },
  {
    id: "business",
    href: "/digital-product/business",
    title: "AI Business Template Generator",
    description: "Business plans, proposals, invoices, and strategy sheets.",
    type: "business_template" as DigitalProductType,
    icon: "Briefcase",
  },
  {
    id: "brochure",
    href: "/digital-product/brochure",
    title: "AI Brochure Template Generator",
    description: "Tri-fold, bi-fold, and industry-specific brochures.",
    type: "brochure" as DigitalProductType,
    icon: "BookOpen",
  },
  {
    id: "logo",
    href: "/digital-product/logo",
    title: "AI Logo & Branding Kit",
    description: "SVG-first logo concepts and complete branding kits.",
    type: "logo" as DigitalProductType,
    icon: "Palette",
  },
  {
    id: "excel",
    href: "/digital-product/excel",
    title: "AI Excel Template Maker",
    description: "Multi-tab workbooks with formulas and dashboards.",
    type: "spreadsheet" as DigitalProductType,
    icon: "Table",
  },
  {
    id: "planner",
    href: "/digital-product/planner",
    title: "AI Planner Generator",
    description: "Weekly, monthly, and productivity planner templates.",
    type: "planner" as DigitalProductType,
    icon: "Calendar",
  },
  {
    id: "bulk",
    href: "/digital-product/bulk",
    title: "Bulk Digital Product Pack",
    description: "Complete downloadable bundles with ZIP export.",
    type: "bulk_pack" as DigitalProductType,
    icon: "Package",
  },
  {
    id: "gallery",
    href: "/digital-product/gallery",
    title: "Template Gallery",
    description: "Browse and customize professional templates.",
    type: undefined,
    icon: "LayoutGrid",
  },
  {
    id: "dashboard",
    href: "/digital-product/dashboard",
    title: "My Dashboard",
    description: "History, saved downloads, and favorites.",
    type: undefined,
    icon: "LayoutDashboard",
  },
] as const;

export const LOGO_SERVICE_DESCRIPTION = `Custom Logo Design tailored to capture your brand's unique identity and leave a lasting impression. Whether you're starting fresh or undergoing a rebrand, each logo is thoughtfully created to reflect your business values and resonate with your target audience.

Our logo design system focuses on clean, modern, and impactful visuals. The goal is to deliver logos that not only look exceptional but also communicate trust, credibility, and clarity.

The platform manages every step of the logo design process, from concept to completion, ensuring a smooth and collaborative experience. The user's vision guides the direction, while the AI-assisted creative engine brings it to life.

Each business logo design is fully customized to align with the brand's voice, industry, and long-term goals. No copying famous brands, no generic shortcuts, and no low-quality template output.

The final logo and branding kit includes high-resolution files, vector formats suitable for all media, and a detailed brand guide outlining the color palette, typography, and logo usage for consistent branding across every platform.`;

export const CANVA_HELPER_TEXT =
  "To edit in Canva, download the editable PPTX or SVG file and upload it to Canva.";
