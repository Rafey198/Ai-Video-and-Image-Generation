"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Film,
  Layers,
  Sparkles,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface WorkflowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_STEPS: WorkflowStep[] = [
  {
    icon: Upload,
    title: "Upload or Prompt",
    description: "Start with a text prompt, reference image, or existing asset.",
  },
  {
    icon: Sparkles,
    title: "Generate",
    description: "AI models create your image, video, or audio in seconds.",
  },
  {
    icon: Layers,
    title: "Refine",
    description: "Adjust parameters, apply styles, and iterate on results.",
  },
  {
    icon: Film,
    title: "Animate",
    description: "Transform stills into motion with frame-to-video pipelines.",
  },
  {
    icon: FileText,
    title: "Sync Audio",
    description: "Generate and align audio tracks to your visual content.",
  },
  {
    icon: Download,
    title: "Export",
    description: "Download in your preferred format or publish to your gallery.",
  },
];

interface WorkflowStepsProps {
  steps?: WorkflowStep[];
  title?: string;
  subtitle?: string;
}

export function WorkflowSteps({
  steps = DEFAULT_STEPS,
  title = "From idea to export in six steps",
  subtitle = "A streamlined creative workflow built for speed and quality.",
}: WorkflowStepsProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-violet-glow/40 to-transparent lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative text-center"
              >
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full border border-border/50 bg-card/60 backdrop-blur-sm",
                      "shadow-glass"
                    )}
                  />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-glow/20 to-cyan-aurora/20">
                    <step.icon className="h-6 w-6 text-violet-electric" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-aurora text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
