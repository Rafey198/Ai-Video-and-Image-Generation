import { CTASection } from "@/components/marketing/CTASection";
import { PageHero } from "@/components/marketing/PageHero";
import { PricingCards } from "@/components/marketing/PricingCards";
import { PricingCreditMeter } from "@/components/marketing/PricingCreditMeter";
import { PRICING_TIERS } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Pricing — ${SITE_CONFIG.name}`,
  description: "Simple, transparent pricing for creators, teams, and enterprises.",
};

export default function PricingPage() {
  const displayTiers = PRICING_TIERS.map((tier) =>
    tier.id === "enterprise"
      ? { ...tier, price: 0, ctaLabel: "Contact sales", ctaHref: "/enterprise" }
      : tier,
  );

  return (
    <>
      <PageHero
        badge="Pricing"
        title="Simple, transparent pricing"
        subtitle="Start free and scale with credits that match your creative output."
      />

      <PricingCreditMeter />

      <PricingCards
        tiers={displayTiers.filter((t) => t.id !== "enterprise")}
        title="Choose your plan"
        subtitle="All plans include access to the full model catalogue. Enterprise pricing is custom."
      />

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <PricingCards
          tiers={displayTiers.filter((t) => t.id === "enterprise")}
          title="Need more scale?"
          subtitle="Custom deployments, SLAs, and dedicated support for large teams."
        />
      </div>

      <CTASection
        primaryHref="/register"
        secondaryHref="/enterprise"
        secondaryLabel="Talk to sales"
      />
    </>
  );
}
