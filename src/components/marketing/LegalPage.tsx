import { PageHero } from "@/components/marketing/PageHero";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <>
      <PageHero badge="Legal" title={title} subtitle={`Last updated: ${lastUpdated}`} />
      <section className="py-16 lg:py-20">
        <div className="prose prose-invert mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </>
  );
}

export function createLegalMetadata(title: string): Metadata {
  return {
    title: `${title} — ${SITE_CONFIG.name}`,
    description: `${title} for ${SITE_CONFIG.name}.`,
  };
}

export { LegalPage };
