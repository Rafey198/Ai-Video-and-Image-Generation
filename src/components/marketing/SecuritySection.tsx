"use client";

import { motion } from "framer-motion";
import {
  Eye,
  FileKey,
  Lock,
  Server,
  Shield,
  ShieldCheck,
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

export interface SecurityHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_HIGHLIGHTS: SecurityHighlight[] = [
  {
    icon: Shield,
    title: "Content Moderation",
    description:
      "Multi-layer safety filters and human review workflows protect against harmful outputs.",
  },
  {
    icon: Lock,
    title: "Encryption at Rest",
    description:
      "All uploads and generated assets are encrypted with industry-standard AES-256.",
  },
  {
    icon: Eye,
    title: "Privacy Controls",
    description:
      "Granular visibility settings let you keep projects private, team-only, or public.",
  },
  {
    icon: Server,
    title: "SOC 2 Ready",
    description:
      "Enterprise-grade infrastructure with audit logs and compliance reporting.",
  },
  {
    icon: FileKey,
    title: "API Key Management",
    description:
      "Scoped API keys with rotation, rate limits, and usage analytics built in.",
  },
  {
    icon: ShieldCheck,
    title: "GDPR Compliant",
    description:
      "Data portability, right to deletion, and transparent data processing policies.",
  },
];

interface SecuritySectionProps {
  highlights?: SecurityHighlight[];
  title?: string;
  subtitle?: string;
}

export function SecuritySection({
  highlights = DEFAULT_HIGHLIGHTS,
  title = "Security & privacy first",
  subtitle = "Your creative work is protected with enterprise-grade security at every layer.",
}: SecuritySectionProps) {
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
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full border-border/50 bg-card/40 transition-all hover:border-cyan-aurora/30 hover:shadow-neon-sm">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-aurora/10 text-cyan-aurora">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
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
