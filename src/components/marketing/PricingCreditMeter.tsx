"use client";

import { CreativeEngine3D } from "@/components/3d";
import { Progress } from "@/components/ui/progress";
import { PRICING_TIERS } from "@/config/marketing";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { motion } from "framer-motion";

const METER_TIERS = PRICING_TIERS.filter((t) => t.credits > 0).slice(0, 4);

export function PricingCreditMeter() {
  const reducedMotion = useReducedMotion();
  const maxCredits = Math.max(...METER_TIERS.map((t) => t.credits));

  return (
    <section className="border-y border-border/40 bg-card/20 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold sm:text-3xl">Credit meter preview</h2>
            <p className="mt-3 text-muted-foreground">
              Visualize how monthly credit pools scale across plans. The engine pulses
              in sync with your creative throughput.
            </p>

            <div className="mt-8 space-y-6">
              {METER_TIERS.map((tier) => (
                <div key={tier.id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">{tier.name}</span>
                    <span className="text-cyan-aurora">
                      {tier.credits.toLocaleString()} credits
                    </span>
                  </div>
                  <Progress
                    value={(tier.credits / maxCredits) * 100}
                    className="h-2 bg-muted/50"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-2 shadow-glass"
          >
            <div className="relative aspect-square min-h-[320px] overflow-hidden rounded-xl">
              <CreativeEngine3D
                mode="audio-sync"
                size="lg"
                className="h-full w-full border-0"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
