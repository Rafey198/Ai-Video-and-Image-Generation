"use client";

import { useEffect, useState } from "react";
import { Cpu, Loader2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiModelOption, StudioCategory } from "@/lib/types/components";

type ModelSelectorProps = {
  category: StudioCategory;
  value?: string;
  onChange: (modelSlug: string, model: AiModelOption | null) => void;
  disabled?: boolean;
  apiBasePath?: string;
};

export function ModelSelector({
  category,
  value,
  onChange,
  disabled,
  apiBasePath = "/api/models",
}: ModelSelectorProps) {
  const [models, setModels] = useState<AiModelOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchModels() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBasePath}?category=${category}`);
        if (!res.ok) throw new Error("Failed to load models");
        const data = (await res.json()) as { models?: AiModelOption[] };
        if (!cancelled) {
          setModels(data.models ?? []);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load models");
          setModels([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchModels();
    return () => {
      cancelled = true;
    };
  }, [category, apiBasePath]);

  const selected = models.find((m) => m.slug === value) ?? null;
  const featured = models.filter((m) => m.featured);
  const others = models.filter((m) => !m.featured);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Model</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Model</Label>
      <Select
        value={value}
        onValueChange={(slug) => {
          const model = models.find((m) => m.slug === slug) ?? null;
          onChange(slug, model);
        }}
        disabled={disabled || models.length === 0}
      >
        <SelectTrigger className="border-border/60 bg-background/50">
          <SelectValue placeholder={error ?? "Select a model"}>
            {selected && (
              <span className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-violet-electric" />
                {selected.name}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {featured.length > 0 && (
            <SelectGroup>
              <SelectLabel className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </SelectLabel>
              {featured.map((model) => (
                <SelectItem key={model.id} value={model.slug}>
                  <ModelOptionLabel model={model} />
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {others.length > 0 && (
            <SelectGroup>
              <SelectLabel>All models</SelectLabel>
              {others.map((model) => (
                <SelectItem key={model.id} value={model.slug}>
                  <ModelOptionLabel model={model} />
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      {selected?.description && (
        <p className="text-xs text-muted-foreground">{selected.description}</p>
      )}
      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  );
}

function ModelOptionLabel({ model }: { model: AiModelOption }) {
  return (
    <span className="flex items-center gap-2">
      {model.name}
      {model.featured && (
        <Badge variant="secondary" className="text-[10px]">
          Featured
        </Badge>
      )}
    </span>
  );
}
