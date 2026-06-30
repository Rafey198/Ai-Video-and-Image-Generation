"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface HeroSectionProps {
  children?: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-glow/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-aurora/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="violet" className="mb-6">
            AI Creative Studio
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-foreground via-violet-electric to-cyan-aurora bg-clip-text text-transparent">
              {SITE_CONFIG.name}
            </span>
          </h1>
          <p className="mt-4 text-xl font-medium text-violet-electric">
            {SITE_CONFIG.tagline}
          </p>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/register">
                Start creating free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/showcase">
                <Play className="mr-1 h-4 w-4" />
                View showcase
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-2 shadow-glass backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-glow/5 to-cyan-aurora/5" />
            <div className="relative aspect-square min-h-[320px] w-full overflow-hidden rounded-xl lg:min-h-[420px]">
              {children ?? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  3D Engine Slot
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
