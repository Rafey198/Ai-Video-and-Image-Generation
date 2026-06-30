"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Film, ImageIcon, Music } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export interface ShowcaseItem {
  id: string;
  title: string;
  type: "image" | "video" | "audio";
  thumbnail: string;
  author?: string;
  tags?: string[];
}

interface ShowcaseGridProps {
  items: ShowcaseItem[];
  title?: string;
  subtitle?: string;
}

type FilterType = "all" | "image" | "video" | "audio";

const TYPE_ICONS = {
  image: ImageIcon,
  video: Film,
  audio: Music,
};

export function ShowcaseGrid({
  items,
  title = "Community showcase",
  subtitle = "Explore creations from artists and creators worldwide.",
}: ShowcaseGridProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.type === filter)),
    [items, filter]
  );

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

        <div className="mt-10 flex justify-center">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList className="bg-card/40 backdrop-blur-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <motion.div layout className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const Icon = TYPE_ICONS[item.type];
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 shadow-glass backdrop-blur-sm"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <Badge
                      variant="secondary"
                      className="absolute left-3 top-3 gap-1 bg-background/60 backdrop-blur-sm"
                    >
                      <Icon className="h-3 w-3" />
                      {item.type}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.author && (
                      <p className="mt-1 text-sm text-muted-foreground">by {item.author}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className={cn("mt-3 flex flex-wrap gap-1.5")}>
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
