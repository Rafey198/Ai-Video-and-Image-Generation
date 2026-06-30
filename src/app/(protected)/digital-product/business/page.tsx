import { GeneratorForm } from "@/components/digital-product/GeneratorForm";
import { BUSINESS_TEMPLATE_CATEGORIES } from "@/lib/digital-product/constants";

export default function BusinessTemplatePage() {
  return (
    <GeneratorForm
      type="business_template"
      category="business_plan"
      title="AI Business Template Generator"
      description="Generate business plans, proposals, invoices, and strategy documents."
      categories={BUSINESS_TEMPLATE_CATEGORIES.map((t) => ({
        value: t,
        label: t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      }))}
    />
  );
}
