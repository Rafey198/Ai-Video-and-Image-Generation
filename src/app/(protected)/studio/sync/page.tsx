"use client";

import { useState } from "react";
import { Pause, Play, Plus, Scissors, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const TRACKS = [
  { id: "video", label: "Video", color: "bg-violet-glow" },
  { id: "voice", label: "Voice", color: "bg-cyan-aurora" },
  { id: "music", label: "Music", color: "bg-emerald-500" },
  { id: "sfx", label: "SFX", color: "bg-orange-500" },
];

const MOCK_CLIPS = [
  { id: "1", track: "video", start: 0, width: 40, label: "Scene 01" },
  { id: "2", track: "voice", start: 5, width: 25, label: "Narration" },
  { id: "3", track: "music", start: 0, width: 80, label: "Ambient bed" },
  { id: "4", track: "sfx", start: 30, width: 10, label: "Whoosh" },
];

export default function SyncStudioPage() {
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState([0]);
  const [activeTab, setActiveTab] = useState("timeline");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sync Studio</h1>
          <p className="text-muted-foreground">Align video, voice, music, and effects on a unified timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPlaying(!playing)}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon">
            <Scissors className="h-4 w-4" />
          </Button>
          <Button className="bg-aurora shadow-neon-sm">
            <Plus className="mr-2 h-4 w-4" />
            Export sync
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card/50">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="mixer">Mixer</TabsTrigger>
          <TabsTrigger value="lipsync">Lip sync</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-4 space-y-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Multi-track timeline</CardTitle>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {playhead[0]!.toFixed(1)}s / 60.0s
                </span>
              </div>
              <CardDescription>Drag clips to align audio and video</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Slider
                value={playhead}
                onValueChange={setPlayhead}
                max={60}
                step={0.1}
                className="mb-4"
              />

              {TRACKS.map((track) => (
                <div key={track.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-14 font-medium">{track.label}</span>
                    <Volume2 className="h-3 w-3" />
                  </div>
                  <div className="relative h-12 rounded-lg border border-border/60 bg-background/50">
                    {MOCK_CLIPS.filter((c) => c.track === track.id).map((clip) => (
                      <div
                        key={clip.id}
                        className={cn(
                          "absolute top-1 flex h-10 cursor-grab items-center rounded-md px-2 text-xs font-medium text-white shadow-neon-sm",
                          track.color
                        )}
                        style={{ left: `${clip.start}%`, width: `${clip.width}%` }}
                      >
                        {clip.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mixer" className="mt-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle>Channel mixer</CardTitle>
              <CardDescription>Balance levels across tracks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-4">
              {TRACKS.map((track) => (
                <div key={track.id} className="space-y-2 text-center">
                  <p className="text-sm font-medium">{track.label}</p>
                  <Slider defaultValue={[75]} max={100} orientation="vertical" className="mx-auto h-32" />
                  <p className="text-xs text-muted-foreground">-6 dB</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lipsync" className="mt-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle>Lip sync alignment</CardTitle>
              <CardDescription>Auto-align voice track to character mouth movements</CardDescription>
            </CardHeader>
            <CardContent className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Upload a video and voice track to begin lip sync analysis
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
