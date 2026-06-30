import { Building2, Check } from "lucide-react";
import { CTASection } from "@/components/marketing/CTASection";
import { ContactForm } from "@/components/marketing/ContactForm";
import { PageHero } from "@/components/marketing/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENTERPRISE_FEATURES } from "@/config/marketing";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Enterprise — ${SITE_CONFIG.name}`,
  description: "Enterprise AI creative infrastructure with SSO, compliance, and dedicated support.",
};

export default function EnterprisePage() {
  return (
    <>
      <PageHero
        badge="Enterprise"
        title="AI creative infrastructure at scale"
        subtitle="Deploy VireoMorph across your organization with security, compliance, and control."
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ENTERPRISE_FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 bg-card/40 backdrop-blur-sm transition-all hover:border-violet-glow/30"
              >
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-glow/10">
                    <Building2 className="h-5 w-5 text-violet-electric" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "99.9% uptime SLA",
              "Dedicated account manager",
              "Custom model routing",
              "Volume credit discounts",
              "SOC 2 & GDPR support",
              "On-premise options",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-cyan-aurora" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border/40 py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Contact our sales team</h2>
            <p className="mt-3 text-muted-foreground">
              Tell us about your team size, use cases, and compliance requirements.
              We&apos;ll tailor a plan and deployment option for you.
            </p>
          </div>
          <ContactForm variant="enterprise" />
        </div>
      </section>

      <CTASection
        title="Prefer to start small?"
        subtitle="Try VireoMorph with a free account, then upgrade when your team is ready."
        primaryLabel="Start free"
        primaryHref="/register"
        secondaryLabel="View pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
