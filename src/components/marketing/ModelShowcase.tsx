"use client";

import { motion } from "framer-motion";
import { Cpu, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export interface ModelCard {
  id: string;
  name: string;
  provider: string;
  type: "image" | "video" | "audio";
  description: string;
  credits: number;
  featured?: boolean;
}

interface ModelShowcaseProps {
  models: ModelCard[];
  title?: string;
  subtitle?: string;
}

const TYPE_COLORS = {
  image: "violet" as const,
  video: "cyan" as const,
  audio: "gradient" as const,
};

export function ModelShowcase({
  models,
  title = "Powered by leading models",
  subtitle = "Access the best AI models through a single, unified platform.",
}: ModelShowcaseProps) {
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model, i) => (
            <motion.div
              key={model.id}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="relative h-full overflow-hidden border-border/50 bg-card/40 transition-all hover:border-violet-glow/30 hover:shadow-neon-sm">
                {model.featured && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="gradient">
                      <Zap className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                    <Cpu className="h-5 w-5 text-violet-electric" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge variant={TYPE_COLORS[model.type]} className="capitalize">
                      {model.type}
                    </Badge>
                  </div>
                  <CardDescription>{model.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <p className="mt-4 text-sm font-medium text-cyan-aurora">
                    {model.credits} credits / generation
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
