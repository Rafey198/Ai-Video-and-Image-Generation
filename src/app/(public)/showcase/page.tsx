import { CTASection } from "@/components/marketing/CTASection";
import { PageHero } from "@/components/marketing/PageHero";
import { ShowcaseGrid } from "@/components/marketing/ShowcaseGrid";
import { SHOWCASE_ITEMS } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Showcase — ${SITE_CONFIG.name}`,
  description: "Explore community creations across image, video, and audio on VireoMorph.",
};

export default function ShowcasePage() {
  return (
    <>
      <PageHero
        badge="Community"
        title="Community showcase"
        subtitle="Discover what creators are building with VireoMorph across every modality."
      />

      <ShowcaseGrid items={SHOWCASE_ITEMS} />

      <CTASection
        title="Share your work"
        subtitle="Publish to the showcase from your gallery—or keep projects private until launch day."
        primaryHref="/signup"
        secondaryLabel="Learn more"
        secondaryHref="/features"
      />
    </>
  );
}
