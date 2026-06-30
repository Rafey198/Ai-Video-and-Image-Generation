import { GeneratorForm } from "@/components/digital-product/GeneratorForm";
import { PLANNER_CATEGORIES } from "@/lib/digital-product/constants";

export default function PlannerGeneratorPage() {
  return (
    <GeneratorForm
      type="planner"
      category="weekly"
      title="AI Planner & Productivity Template Generator"
      description="Weekly, monthly, yearly planners and productivity templates in XLSX, PDF, and DOCX."
      categories={PLANNER_CATEGORIES.map((t) => ({
        value: t,
        label: t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      }))}
      defaultExportFormats={["xlsx", "pdf", "docx", "png", "zip"]}
    />
  );
}
