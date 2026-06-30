"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreativeEngine3D, type EngineMode } from "@/components/3d";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const MODULES: { mode: EngineMode; label: string; description: string }[] = [
  {
    mode: "prompt-to-frame",
    label: "Prompt → Frame",
    description: "Transform text into stunning keyframes with diffusion models.",
  },
  {
    mode: "frame-to-motion",
    label: "Frame → Motion",
    description: "Animate still images into fluid, cinematic video sequences.",
  },
  {
    mode: "audio-sync",
    label: "Audio Sync",
    description: "Generate and align audio that matches your visual rhythm.",
  },
  {
    mode: "export",
    label: "Export",
    description: "Render final assets in your preferred format and resolution.",
  },
];

export function FeaturesEngineDemo() {
  const [activeMode, setActiveMode] = useState<EngineMode>("prompt-to-frame");
  const reducedMotion = useReducedMotion();
  const active = MODULES.find((m) => m.mode === activeMode) ?? MODULES[0];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Modular creative pipeline
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Each stage of the VireoMorph workflow is a composable module. Select a
              module to preview the engine visualization.
            </p>

            <div className="mt-8 space-y-3">
              {MODULES.map((mod) => (
                <button
                  key={mod.mode}
                  type="button"
                  onClick={() => setActiveMode(mod.mode)}
                  className={cn(
                    "w-full rounded-xl border p-4 text-left transition-all",
                    activeMode === mod.mode
                      ? "border-violet-glow/50 bg-violet-glow/10 shadow-neon-sm"
                      : "border-border/50 bg-card/30 hover:border-violet-glow/30",
                  )}
                >
                  <p className="font-semibold text-foreground">{mod.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{mod.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-2 shadow-glass backdrop-blur-md">
              <div className="relative aspect-square min-h-[360px] w-full overflow-hidden rounded-xl">
                <CreativeEngine3D mode={activeMode} size="lg" className="h-full w-full border-0" />
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Active module: <span className="text-violet-electric">{active.label}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
