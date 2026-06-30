"use client";

import { motion } from "framer-motion";
import {
  AudioLines,
  FileText,
  Film,
  Image,
  Layers,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: Image,
    title: "Image Generation",
    description:
      "Create stunning visuals from text prompts with state-of-the-art diffusion models.",
  },
  {
    icon: Film,
    title: "Video Animation",
    description:
      "Transform still frames into fluid motion with cinematic quality and control.",
  },
  {
    icon: AudioLines,
    title: "Audio Sync",
    description:
      "Generate and synchronize audio that perfectly matches your visual content.",
  },
  {
    icon: Wand2,
    title: "Smart Remix",
    description:
      "Blend, restyle, and remix existing assets with intelligent AI pipelines.",
  },
  {
    icon: Layers,
    title: "Multi-Modal Studio",
    description:
      "Work across image, video, and audio in one unified creative workspace.",
  },
  {
    icon: Sparkles,
    title: "Style Presets",
    description:
      "Apply curated style presets or build your own for consistent brand output.",
  },
  {
    icon: FileText,
    title: "AI Digital Product Studio",
    description:
      "Generate one-pagers, brochures, logos, Excel templates, planners, and complete digital product packs.",
  },
];

interface FeatureGridProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
}

export function FeatureGrid({
  features = DEFAULT_FEATURES,
  title = "Everything you need to create",
  subtitle = "A complete AI creative toolkit designed for professionals and teams.",
}: FeatureGridProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="group h-full border-border/50 bg-card/40 transition-all hover:border-violet-glow/30 hover:shadow-neon-sm">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-glow/20 to-cyan-aurora/20 text-violet-electric transition-colors group-hover:from-violet-glow/30 group-hover:to-cyan-aurora/30">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
