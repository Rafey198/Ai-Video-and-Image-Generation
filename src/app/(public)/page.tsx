import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CreativeEngine3DDynamic } from "@/components/3d/dynamic";
import { CTASection } from "@/components/marketing/CTASection";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ModelShowcase } from "@/components/marketing/ModelShowcase";
import { PricingCards } from "@/components/marketing/PricingCards";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { ShowcaseGrid } from "@/components/marketing/ShowcaseGrid";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { WorkflowSteps } from "@/components/marketing/WorkflowSteps";
import { Button } from "@/components/ui/button";
import {
  FAQ_ITEMS,
  FEATURED_MODELS,
  PRICING_TIERS,
  SHOWCASE_ITEMS,
} from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection>
        <CreativeEngine3DDynamic mode="ignition" size="lg" className="h-full w-full border-0" />
      </HeroSection>

      <TrustedBy />

      <WorkflowSteps />

      <FeatureGrid />

      <ModelShowcase models={FEATURED_MODELS} />

      <SecuritySection />

      <PricingCards
        tiers={PRICING_TIERS.filter((t) => t.id !== "enterprise").slice(0, 3)}
        title="Plans for every creator"
        subtitle="Start free and upgrade as your studio grows. View full pricing for all tiers."
      />

      <div className="mx-auto max-w-7xl px-4 pb-8 text-center sm:px-6 lg:px-8">
        <Button variant="outline" asChild>
          <Link href="/pricing">
            View all pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ShowcaseGrid
        items={SHOWCASE_ITEMS.slice(0, 6)}
        title="Featured creations"
        subtitle="A preview from our community showcase."
      />

      <div className="mx-auto max-w-7xl px-4 pb-8 text-center sm:px-6 lg:px-8">
        <Button variant="outline" asChild>
          <Link href="/showcase">
            Explore full showcase
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <FAQAccordion
        items={FAQ_ITEMS.slice(0, 4)}
        title="Common questions"
        subtitle="Quick answers to get you started."
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 text-center sm:px-6 lg:px-8">
        <Button variant="ghost" asChild>
          <Link href="/faq">
            See all FAQs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <CTASection />
    </>
  );
}
