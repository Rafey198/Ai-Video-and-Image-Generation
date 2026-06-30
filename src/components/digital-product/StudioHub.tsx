"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Package,
  Palette,
  Table,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STUDIO_SECTIONS } from "@/lib/digital-product/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Briefcase,
  BookOpen,
  Palette,
  Table,
  Calendar,
  Package,
  LayoutGrid,
  LayoutDashboard,
};

export function StudioHub() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card/80 to-violet-500/10 p-8 backdrop-blur-xl"
      >
        <div className="relative z-10">
          <Badge className="mb-4 bg-primary/20 text-primary">New Module</Badge>
          <h1 className="text-3xl font-bold tracking-tight">AI Digital Product Studio</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Generate professional one-pagers, business templates, brochures, logos, Excel workbooks,
            planners, and complete digital product packs — powered by AI.
          </p>
        </div>
        <Sparkles className="absolute -right-4 -top-4 h-32 w-32 text-primary/10" />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STUDIO_SECTIONS.map((section, i) => {
          const Icon = ICON_MAP[section.icon] ?? FileText;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={section.href}>
                <Card className="group h-full border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-neon-sm">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
