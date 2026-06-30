import { CTASection } from "@/components/marketing/CTASection";
import { PageHero } from "@/components/marketing/PageHero";
import { SITE_CONFIG } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${SITE_CONFIG.name}`,
  description: `Learn about ${SITE_CONFIG.name} and our mission to unify AI creative workflows.`,
};

const VALUES = [
  {
    title: "Creator-first",
    description:
      "We build tools that respect creative intent—fast iteration, transparent pricing, and control over every output.",
  },
  {
    title: "Model-agnostic",
    description:
      "The best model for each task, not vendor lock-in. We integrate leading providers and route intelligently.",
  },
  {
    title: "Safety by design",
    description:
      "Responsible AI isn't optional. Moderation, licensing clarity, and privacy controls are built into every layer.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        badge="Company"
        title={`About ${SITE_CONFIG.name}`}
        subtitle={SITE_CONFIG.description}
      />

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Our mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {SITE_CONFIG.name} was founded to solve a simple problem: creative professionals
            shouldn&apos;t need five different tools to go from idea to finished media. We unify
            image generation, video animation, audio synthesis, and sync in one premium studio—
            with the security and compliance teams expect.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Our tagline—<span className="text-violet-electric">{SITE_CONFIG.tagline}</span>
            —captures the full creative loop. Generate stills, animate motion, remix styles,
            and sync soundtracks without leaving the workspace.
          </p>
        </div>
      </section>

      <section className="border-y border-border/40 bg-card/20 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">What we believe</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm"
              >
                <h3 className="font-semibold text-violet-electric">{value.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
