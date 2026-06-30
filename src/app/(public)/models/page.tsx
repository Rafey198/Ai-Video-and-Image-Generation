import { ModelsCatalog } from "@/components/marketing/ModelsCatalog";
import { PageHero } from "@/components/marketing/PageHero";
import { CTASection } from "@/components/marketing/CTASection";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Models — ${SITE_CONFIG.name}`,
  description: "Browse the VireoMorph model catalogue—image, video, audio, and sync models in one place.",
};

export default function ModelsPage() {
  return (
    <>
      <PageHero
        badge="Model Registry"
        title="Every model, one platform"
        subtitle="Filter by category, task type, and featured status. Credits shown per generation."
      />

      <ModelsCatalog />

      <CTASection
        title="Ready to generate?"
        subtitle="Pick a model in the studio and start creating with your free credits."
        primaryHref="/register"
        secondaryHref="/pricing"
        secondaryLabel="View pricing"
      />
    </>
  );
}
