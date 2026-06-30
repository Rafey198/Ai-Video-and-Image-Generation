"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  credits: number;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  /** When set, replaces numeric price display (e.g. "Custom") */
  priceLabel?: string;
}

interface PricingCardsProps {
  tiers: PricingTier[];
  title?: string;
  subtitle?: string;
}

export function PricingCards({
  tiers,
  title = "Simple, transparent pricing",
  subtitle = "Start free and scale as your creative needs grow.",
}: PricingCardsProps) {
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

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={cn(
                  "relative flex h-full flex-col border-border/50 bg-card/40 backdrop-blur-sm",
                  tier.highlighted &&
                    "border-violet-glow/50 shadow-neon ring-1 ring-violet-glow/20"
                )}
              >
                {tier.highlighted && (
                  <Badge variant="gradient" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    {tier.priceLabel ? (
                      <span className="text-4xl font-bold">{tier.priceLabel}</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">${tier.price}</span>
                        <span className="text-muted-foreground">/{tier.interval}</span>
                      </>
                    )}
                  </div>
                  {tier.credits > 0 && (
                    <p className="text-sm text-cyan-aurora">
                      {tier.credits.toLocaleString()} credits included
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-electric" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={tier.highlighted ? "gradient" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href={tier.ctaHref ?? "/signup"}>
                      {tier.ctaLabel ?? "Get started"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
