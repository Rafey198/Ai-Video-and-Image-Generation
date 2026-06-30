"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { AudioWaveRings3DDynamic } from "@/components/3d/dynamic";
import { GenerationSettingsPanel } from "@/components/studio/GenerationSettingsPanel";
import { JobProgressCard } from "@/components/studio/JobProgressCard";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { PromptEditor } from "@/components/studio/PromptEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { useJobPoller } from "@/hooks/use-job-poller";
import type { AiModelOption, GenerationSettings, MediaItem } from "@/lib/types/components";

export default function AudioStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [modelSlug, setModelSlug] = useState<string>();
  const [model, setModel] = useState<AiModelOption | null>(null);
  const [duration, setDuration] = useState(30);
  const [settings, setSettings] = useState<GenerationSettings>({ stylePreset: "ambient" });
  const [generating, setGenerating] = useState(false);

  const { activeJob, result, setResult, startJob, polling } = useJobPoller({
    maxAttempts: 60,
    intervalMs: 2500,
    onComplete: () => toast({ title: "Audio ready", description: "Your track has finished rendering." }),
    onError: (msg) => toast({ title: "Generation failed", description: msg, variant: "destructive" }),
  });

  async function handleGenerate() {
    if (!prompt.trim() || !modelSlug) {
      toast({ title: "Missing fields", description: "Enter a prompt and select a model.", variant: "destructive" });
      return;
    }

    setGenerating(true);
    setResult(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "audio",
          modelSlug,
          prompt,
          duration,
          stylePreset: settings.stylePreset,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      if (data.media) {
        setResult(data.media as MediaItem);
        toast({ title: "Audio ready", description: "Your track has finished rendering." });
      } else if (data.job?.id) {
        if (data.job.status === "failed") {
          throw new Error(data.job.errorMessage ?? "Generation failed");
        }
        startJob({
          id: data.job.id,
          status: data.job.status,
          progress: data.job.progress ?? 10,
          type: "audio",
          prompt,
        });
        toast({ title: "Audio generation started", description: "Rendering on Replicate…" });
      }
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  const isBusy = generating || polling;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audio Studio</h1>
        <p className="text-muted-foreground">Generate music, voice, and sound effects with AI</p>
      </div>

      <div className="h-56 overflow-hidden rounded-2xl border border-border/60">
        <AudioWaveRings3DDynamic size="md" className="h-full w-full" />
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
                onPromptChange={setPrompt}
                showNegative={false}
                disabled={isBusy}
              />
            </CardContent>
          </Card>

          <GenerationSettingsPanel
            category="audio"
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
            disabled={isBusy}
          />

          <Button
            className="w-full bg-aurora shadow-neon-sm"
            size="lg"
            onClick={handleGenerate}
            disabled={isBusy || !modelSlug}
          >
            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate audio
          </Button>
        </div>

        <div className="space-y-6">
          <JobProgressCard job={activeJob} />
          <MediaPreview item={result} loading={isBusy && !result} emptyMessage="Your audio preview will appear here" />
        </div>
      </div>
    </div>
  );
}
