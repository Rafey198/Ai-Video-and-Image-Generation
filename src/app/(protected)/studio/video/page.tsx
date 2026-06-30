"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { MotionTimeline3DDynamic } from "@/components/3d/dynamic";
import { GenerationSettingsPanel } from "@/components/studio/GenerationSettingsPanel";
import { JobProgressCard } from "@/components/studio/JobProgressCard";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { PromptEditor } from "@/components/studio/PromptEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import type { ActiveJob, AiModelOption, GenerationSettings, MediaItem } from "@/lib/types/components";

const VIDEO_MODES = [
  { id: "text-to-video", label: "Text to Video", description: "Generate video from a prompt" },
  { id: "image-to-video", label: "Image to Video", description: "Animate a still image" },
  { id: "video-to-video", label: "Video to Video", description: "Transform existing footage" },
];

export default function VideoStudioPage() {
  const [mode, setMode] = useState("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [modelSlug, setModelSlug] = useState<string>();
  const [model, setModel] = useState<AiModelOption | null>(null);
  const [duration, setDuration] = useState(5);
  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: "16:9",
    resolution: "1080p",
    fps: 24,
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
    setActiveJob({ id: "pending", status: "queued", progress: 0, type: "video", prompt });

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "video",
          modelSlug,
          prompt,
          negativePrompt: negativePrompt || undefined,
          duration,
          aspectRatio: settings.aspectRatio,
          resolution: settings.resolution,
          fps: settings.fps,
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setActiveJob({
        id: data.job.id,
        status: data.job.status,
        progress: data.job.progress ?? 10,
        type: "video",
        prompt,
      });

      if (data.media) setResult(data.media);
      toast({ title: "Video generation started" });
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
        <h1 className="text-2xl font-bold tracking-tight">Video Studio</h1>
        <p className="text-muted-foreground">Create cinematic AI videos with motion control</p>
      </div>

      <Tabs value={mode} onValueChange={setMode}>
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          {VIDEO_MODES.map((m) => (
            <TabsTrigger key={m.id} value={m.id}>
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {VIDEO_MODES.map((m) => (
          <TabsContent key={m.id} value={m.id} className="mt-4">
            <p className="text-sm text-muted-foreground">{m.description}</p>
          </TabsContent>
        ))}
      </Tabs>

      <div className="h-48 overflow-hidden rounded-2xl border border-border/60">
        <MotionTimeline3DDynamic size="sm" className="h-full w-full" />
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
            category="video"
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
          />

          <Button
            className="w-full bg-aurora shadow-neon-sm"
            size="lg"
            onClick={handleGenerate}
            disabled={generating || !modelSlug}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate video
          </Button>
        </div>

        <div className="space-y-6">
          <JobProgressCard job={activeJob} />
          <MediaPreview item={result} loading={generating && !result} emptyMessage="Your video preview will appear here" />
        </div>
      </div>
    </div>
  );
}
