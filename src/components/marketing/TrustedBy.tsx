"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface TrustedByProps {
  logos?: string[];
  title?: string;
}

const DEFAULT_LOGOS = [
  "Studio Alpha",
  "Neon Labs",
  "Pixel Forge",
  "Aurora Media",
  "Synthwave Co",
  "Creative Axis",
];

export function TrustedBy({
  logos = DEFAULT_LOGOS,
  title = "Trusted by creative teams worldwide",
}: TrustedByProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="border-y border-border/40 bg-card/20 py-12 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground"
        >
          {title}
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {logos.map((logo, i) => (
            <div
              key={logo}
              className="flex h-10 items-center justify-center rounded-lg border border-border/30 bg-background/40 px-6 backdrop-blur-sm"
            >
              <span
                className="text-sm font-semibold text-muted-foreground/60"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {logo}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
