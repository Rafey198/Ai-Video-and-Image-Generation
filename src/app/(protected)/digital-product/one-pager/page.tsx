import { GeneratorForm } from "@/components/digital-product/GeneratorForm";
import { ONE_PAGER_TYPES, ONE_PAGER_SIZES } from "@/lib/digital-product/constants";

export default function OnePagerStudioPage() {
  return (
    <GeneratorForm
      type="one_pager"
      category="startup"
      title="AI One-Pager Studio"
      description="Create professional one-page business documents in any size."
      categories={ONE_PAGER_TYPES.map((t) => ({
        value: t,
        label: t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      }))}
      sizes={ONE_PAGER_SIZES.map((s) => ({ value: s.id, label: s.label }))}
    />
  );
}
