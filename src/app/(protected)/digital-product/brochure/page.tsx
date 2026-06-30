import { GeneratorForm } from "@/components/digital-product/GeneratorForm";
import { BROCHURE_TYPES, BROCHURE_SIZES } from "@/lib/digital-product/constants";

export default function BrochureGeneratorPage() {
  return (
    <GeneratorForm
      type="brochure"
      category="tri_fold"
      title="AI Brochure Template Generator"
      description="Create tri-fold, bi-fold, and industry-specific brochures with print-ready export."
      categories={BROCHURE_TYPES.map((t) => ({
        value: t,
        label: t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      }))}
      sizes={BROCHURE_SIZES.map((s) => ({ value: s.id, label: s.label }))}
    />
  );
}
