"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { GenerationSettingsPanel } from "@/components/studio/GenerationSettingsPanel";
import { JobProgressCard } from "@/components/studio/JobProgressCard";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { PromptEditor } from "@/components/studio/PromptEditor";
import { ResultActions } from "@/components/studio/ResultActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { ActiveJob, AiModelOption, GenerationSettings, MediaItem } from "@/lib/types/components";

export default function ImageStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [modelSlug, setModelSlug] = useState<string>();
  const [model, setModel] = useState<AiModelOption | null>(null);
  const [duration, setDuration] = useState(1);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: "1:1",
    resolution: "1080p",
    batchSize: 1,
  });
  const [generating, setGenerating] = useState(false);
  const [activeJob, setActiveJob] = useState<ActiveJob | null>(null);
  const [result, setResult] = useState<MediaItem | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || !modelSlug) {
      toast({ title: "Missing fields", description: "Enter a prompt and select a model.", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setActiveJob({ id: "pending", status: "queued", progress: 0, type: "image", prompt });

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "image",
          modelSlug,
          prompt,
          negativePrompt: negativePrompt || undefined,
          aspectRatio: settings.aspectRatio,
          resolution: settings.resolution,
          seed: settings.seed,
          batchSize: settings.batchSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setActiveJob({
        id: data.job.id,
        status: data.job.status,
        progress: data.job.progress ?? 10,
        type: "image",
        prompt,
      });

      if (data.media) {
        setResult(data.media);
        setActiveJob((j) => (j ? { ...j, status: "completed", progress: 100 } : null));
      }

      toast({ title: "Generation started", description: "Your image is being created." });
    } catch (err) {
      setActiveJob(null);
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Image Studio</h1>
        <p className="text-muted-foreground">Generate stunning images from text prompts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <PromptEditor
                prompt={prompt}
                negativePrompt={negativePrompt}
                onPromptChange={setPrompt}
                onNegativePromptChange={setNegativePrompt}
                disabled={generating}
              />
            </CardContent>
          </Card>

          <GenerationSettingsPanel
            category="image"
            modelSlug={modelSlug}
            model={model}
            duration={duration}
            settings={settings}
            onModelChange={(slug, m) => {
              setModelSlug(slug);
              setModel(m);
            }}
            onDurationChange={setDuration}
            onSettingsChange={setSettings}
            disabled={generating}
            showDuration={false}
          />

          <Button
            className="w-full bg-aurora shadow-neon-sm"
            size="lg"
            onClick={handleGenerate}
            disabled={generating || !modelSlug}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate image
          </Button>
        </div>

        <div className="space-y-6">
          <JobProgressCard job={activeJob} />
          <MediaPreview item={result} loading={generating && !result} />
          {result && (
            <ResultActions
              onDownload={() => window.open(result.url, "_blank")}
              onSave={() => toast({ title: "Saved to gallery" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
