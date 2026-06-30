"use client";

import { useEffect, useState } from "react";
import { Cpu, Search, Sparkles } from "lucide-react";

import { ModelOrbit3DDynamic } from "@/components/3d/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCredits } from "@/lib/utils";
import type { AiModelOption } from "@/lib/types/components";

export default function ModelLibraryPage() {
  const [models, setModels] = useState<AiModelOption[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then((data) => setModels(data.models ?? data ?? []))
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = models.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Library</h1>
        <p className="text-muted-foreground">Explore AI models available for your generations</p>
      </div>

      <div className="h-48 overflow-hidden rounded-2xl border border-border/60">
        <ModelOrbit3DDynamic size="sm" className="h-full w-full" />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search models..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-border/60 bg-background/50 pl-9"
        />
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading models...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <Card key={model.id} className="border-border/60 bg-card/50 transition-colors hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cpu className="h-5 w-5 text-violet-electric" />
                    {model.name}
                  </CardTitle>
                  {model.featured && (
                    <Badge className="bg-aurora">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardDescription className="capitalize">{model.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {model.description && (
                  <p className="line-clamp-2 text-muted-foreground">{model.description}</p>
                )}
                <p className="text-muted-foreground">
                  From {formatCredits(model.creditCostBase)} credits
                  {model.creditCostPerSecond > 0 && ` + ${model.creditCostPerSecond}/sec`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
