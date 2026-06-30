"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title = `Ready to create with ${SITE_CONFIG.name}?`,
  subtitle = "Join thousands of creators generating stunning AI content. Start with free credits today.",
  primaryLabel = "Start for free",
  primaryHref = "/signup",
  secondaryLabel = "Talk to sales",
  secondaryHref = "/enterprise",
}: CTASectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-violet-glow/30 bg-gradient-to-br from-violet-glow/10 via-card/60 to-cyan-aurora/10 p-8 text-center shadow-neon backdrop-blur-md sm:p-12 lg:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="gradient" size="lg" asChild>
                <Link href={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
