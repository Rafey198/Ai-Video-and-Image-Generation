"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface PageHeroProps {
  badge?: string;
  title: string;
  subtitle: string;
}

export function PageHero({ badge, title, subtitle }: PageHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border/40 py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2 rounded-full bg-violet-glow/10 blur-[100px]" />
        <div className="absolute right-0 top-1/2 h-[280px] w-[280px] rounded-full bg-cyan-aurora/10 blur-[80px]" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {badge && (
            <Badge variant="violet" className="mb-4">
              {badge}
            </Badge>
          )}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>
      </div>
    </section>
  );
}
