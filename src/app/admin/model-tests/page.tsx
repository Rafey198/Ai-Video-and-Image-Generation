"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Play, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { parseApiJson } from "@/lib/utils/parse-api-json";

type ModelRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  providerSlug: string | null;
  mapped: boolean;
};

type TestResult = {
  modelSlug: string;
  modelName: string;
  status: string;
  mediaUrl?: string;
  error?: string;
  durationMs: number;
};

type Summary = {
  total: number;
  mapped: number;
  unmapped: number;
  demoMode: boolean;
  replicateConfigured: boolean;
};

const CATEGORIES = ["all", "image", "video", "audio", "sync", "safety"];

export default function AdminModelTestsPage() {
  const [models, setModels] = useState<ModelRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [category, setCategory] = useState("all");
  const [prompt, setPrompt] = useState(
    "A premium product photo of wireless earbuds on marble, soft studio lighting"
  );
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});

  const loadModels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/models/live-test?category=${category}`);
      const data = await parseApiJson<{ models: ModelRow[]; summary: Summary }>(res);
      setModels(data.models);
      setSummary(data.summary);
    } catch (error) {
      toast({
        title: "Could not load models",
        description: error instanceof Error ? error.message : "Request failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void loadModels();
  }, [loadModels]);

  async function runTest(modelSlug: string) {
    setCurrentSlug(modelSlug);
    try {
      const res = await fetch("/api/admin/models/live-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelSlug, prompt }),
      });
      const data = await parseApiJson<{ result: TestResult }>(res);
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Test failed");

      setResults((prev) => ({ ...prev, [modelSlug]: data.result }));
      return data.result;
    } finally {
      setCurrentSlug(null);
    }
  }

  async function runAllMapped() {
    const targets = models.filter((m) => m.mapped);
    if (!targets.length) {
      toast({ title: "No mapped models", description: "Expand Replicate mappings first.", variant: "destructive" });
      return;
    }

    if (summary?.demoMode) {
      toast({
        title: "Demo mode is ON",
        description: "Turn it OFF under Feature Flags before live tests.",
        variant: "destructive",
      });
      return;
    }

    setRunning(true);
    let passed = 0;
    let failed = 0;

    for (const model of targets) {
      try {
        const result = await runTest(model.slug);
        if (result.status === "completed") passed++;
        else failed++;
      } catch (error) {
        failed++;
        setResults((prev) => ({
          ...prev,
          [model.slug]: {
            modelSlug: model.slug,
            modelName: model.name,
            status: "failed",
            error: error instanceof Error ? error.message : "Request failed",
            durationMs: 0,
          },
        }));
      }
    }

    setRunning(false);
    toast({
      title: "Batch live test finished",
      description: `${passed} passed, ${failed} failed/skipped (${targets.length} mapped models).`,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live Model Tests</h1>
        <p className="text-muted-foreground">
          Run real prompts against every mapped model via Replicate. One model per request to avoid timeouts.
        </p>
      </div>

      {summary && (
        <div className="flex flex-wrap gap-2">
          <Badge variant={summary.demoMode ? "destructive" : "secondary"}>
            Demo mode: {summary.demoMode ? "ON" : "OFF"}
          </Badge>
          <Badge variant={summary.replicateConfigured ? "secondary" : "destructive"}>
            Replicate: {summary.replicateConfigured ? "configured" : "missing token"}
          </Badge>
          <Badge variant="outline">{summary.mapped} mapped / {summary.total} total</Badge>
        </div>
      )}

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Test prompt</CardTitle>
          <CardDescription>
            Used for all models in the batch. Image/video/audio models use category-specific defaults if empty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Category filter</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c === "all" ? "All categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={() => void loadModels()} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={() => void runAllMapped()} disabled={running || loading}>
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Run all mapped
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Models</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading models…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="p-3 font-medium">Model</th>
                    <th className="p-3 font-medium">Category</th>
                    <th className="p-3 font-medium">Provider</th>
                    <th className="p-3 font-medium">Live</th>
                    <th className="p-3 font-medium">Result</th>
                    <th className="p-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => {
                    const result = results[model.slug];
                    const isRunning = currentSlug === model.slug;

                    return (
                      <tr key={model.id} className="border-b border-border/40">
                        <td className="p-3">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.slug}</div>
                        </td>
                        <td className="p-3 capitalize">{model.category}</td>
                        <td className="p-3">{model.providerSlug ?? "—"}</td>
                        <td className="p-3">
                          <Badge variant={model.mapped ? "secondary" : "outline"}>
                            {model.mapped ? "mapped" : "unmapped"}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {result ? (
                            <div className="space-y-1">
                              <Badge
                                variant={
                                  result.status === "completed"
                                    ? "secondary"
                                    : result.status === "unsupported"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {result.status}
                              </Badge>
                              {result.error && (
                                <p className="max-w-xs text-xs text-destructive">{result.error}</p>
                              )}
                              {result.mediaUrl && (
                                <a
                                  href={result.mediaUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-xs text-primary hover:underline"
                                >
                                  View output
                                </a>
                              )}
                              {result.durationMs > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {(result.durationMs / 1000).toFixed(1)}s
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!model.mapped || running || isRunning}
                            onClick={() => void runTest(model.slug)}
                          >
                            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
