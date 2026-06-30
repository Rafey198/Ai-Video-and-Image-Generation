"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Filter, Zap } from "lucide-react";
import { ModelOrbit3DDynamic } from "@/components/3d/dynamic";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FEATURED_MODELS } from "@/config/marketing";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface ApiModel {
  id: string;
  name: string;
  slug: string;
  category: string;
  taskType: string;
  description: string | null;
  creditCostBase: number;
  featured: boolean;
  supportsImage: boolean;
  supportsVideo: boolean;
  supportsAudio: boolean;
  provider: { name: string } | null;
}

type MediaType = "image" | "video" | "audio";

function inferType(model: ApiModel): MediaType {
  if (model.supportsVideo) return "video";
  if (model.supportsAudio && !model.supportsImage) return "audio";
  return "image";
}

const TYPE_COLORS = {
  image: "violet" as const,
  video: "cyan" as const,
  audio: "gradient" as const,
};

export function ModelsCatalog() {
  const reducedMotion = useReducedMotion();
  const [models, setModels] = useState<ApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [taskType, setTaskType] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (taskType !== "all") params.set("taskType", taskType);
      if (featuredOnly) params.set("featured", "true");

      const res = await fetch(`/api/models?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load models");

      const data = (await res.json()) as { models: ApiModel[] };
      setModels(data.models);
    } catch {
      setError("Unable to load live model registry. Showing featured catalogue.");
      setModels(
        FEATURED_MODELS.map((m) => ({
          id: m.id,
          name: m.name,
          slug: m.id,
          category: m.type,
          taskType: m.type,
          description: m.description,
          creditCostBase: m.credits,
          featured: m.featured ?? false,
          supportsImage: m.type === "image",
          supportsVideo: m.type === "video",
          supportsAudio: m.type === "audio",
          provider: { name: m.provider },
        })),
      );
    } finally {
      setLoading(false);
    }
  }, [category, taskType, featuredOnly]);

  useEffect(() => {
    void fetchModels();
  }, [fetchModels]);

  const categories = useMemo(
    () => ["all", ...new Set(models.map((m) => m.category))],
    [models],
  );

  const taskTypes = useMemo(
    () => ["all", ...new Set(models.map((m) => m.taskType))],
    [models],
  );

  const orbitLabels = useMemo(
    () => models.slice(0, 6).map((m) => m.name.split(" ")[0]),
    [models],
  );

  return (
    <>
      <section className="border-b border-border/40 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-2 shadow-glass">
            <ModelOrbit3DDynamic
              models={orbitLabels.length > 0 ? orbitLabels : undefined}
              size="lg"
              className="mx-auto w-full max-w-3xl"
            />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Model catalogue</h2>
              <p className="mt-1 text-muted-foreground">
                {loading ? "Loading..." : `${models.length} models available`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px] bg-card/40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger className="w-[160px] bg-card/40">
                  <SelectValue placeholder="Task type" />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "all" ? "All tasks" : t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={featuredOnly ? "gradient" : "outline"}
                size="sm"
                onClick={() => setFeaturedOnly((v) => !v)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Featured
              </Button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-muted-foreground">{error}</p>
          )}

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))
              : models.map((model, i) => {
                  const type = inferType(model);
                  return (
                    <motion.div
                      key={model.id}
                      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="relative h-full border-border/50 bg-card/40 transition-all hover:border-violet-glow/30 hover:shadow-neon-sm">
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
                          <div className="flex flex-wrap items-center gap-2">
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                            <Badge variant={TYPE_COLORS[type]} className="capitalize">
                              {type}
                            </Badge>
                          </div>
                          <CardDescription>
                            {model.provider?.name ?? "VireoMorph"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {model.description ?? "No description available."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {model.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {model.taskType}
                            </Badge>
                          </div>
                          <p className="mt-4 text-sm font-medium text-cyan-aurora">
                            {model.creditCostBase} credits / generation
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
          </div>

          {!loading && models.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">
              No models match your filters. Try adjusting category or task type.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
