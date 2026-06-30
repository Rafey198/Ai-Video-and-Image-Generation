import { CTASection } from "@/components/marketing/CTASection";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { PageHero } from "@/components/marketing/PageHero";
import { FAQ_ITEMS } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `FAQ — ${SITE_CONFIG.name}`,
  description: "Frequently asked questions about VireoMorph plans, credits, models, and safety.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        badge="Support"
        title="Frequently asked questions"
        subtitle="Everything you need to know about getting started with VireoMorph."
      />

      <FAQAccordion items={FAQ_ITEMS} />

      <CTASection
        title="Still have questions?"
        subtitle="Our team is happy to help with plans, compliance, or technical setup."
        primaryLabel="Contact us"
        primaryHref="/contact"
        secondaryLabel="View pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
