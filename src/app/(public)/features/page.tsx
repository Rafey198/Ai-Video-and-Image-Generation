import { CTASection } from "@/components/marketing/CTASection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { FeaturesEngineDemo } from "@/components/marketing/FeaturesEngineDemo";
import { PageHero } from "@/components/marketing/PageHero";
import { WorkflowSteps } from "@/components/marketing/WorkflowSteps";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Features — ${SITE_CONFIG.name}`,
  description: "Explore VireoMorph's modular AI creative pipeline for image, video, and audio.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        badge="Platform"
        title="Built for the full creative lifecycle"
        subtitle="From first prompt to final export—every modality, one premium workspace."
      />

      <FeaturesEngineDemo />

      <FeatureGrid
        title="Core capabilities"
        subtitle="Professional-grade tools for images, video, audio, and sync."
      />

      <WorkflowSteps />

      <CTASection
        title="Experience every module"
        subtitle="Start with 100 free credits and explore the full creative engine today."
        primaryHref="/signup"
        secondaryHref="/models"
        secondaryLabel="Browse models"
      />
    </>
  );
}
