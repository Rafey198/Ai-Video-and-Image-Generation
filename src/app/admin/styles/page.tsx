"use client";

import { useState } from "react";
import { Palette, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const STYLE_PRESETS = [
  { id: "1", name: "Cinematic", description: "Film-grade color grading and depth of field", enabled: true, category: "image" },
  { id: "2", name: "Anime", description: "Japanese animation style with vibrant colors", enabled: true, category: "image" },
  { id: "3", name: "Photorealistic", description: "Hyper-realistic photography look", enabled: true, category: "image" },
  { id: "4", name: "Motion blur", description: "Dynamic motion blur for action scenes", enabled: false, category: "video" },
  { id: "5", name: "Lo-fi beats", description: "Warm, nostalgic audio aesthetic", enabled: true, category: "audio" },
];

export default function AdminStylesPage() {
  const [styles, setStyles] = useState(STYLE_PRESETS);

  function toggleStyle(id: string) {
    setStyles((s) => s.map((style) => (style.id === id ? { ...style, enabled: !style.enabled } : style)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Style Presets</h1>
          <p className="text-muted-foreground">Manage visual and audio style presets for generations</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add preset
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {styles.map((style) => (
          <Card key={style.id} className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4 text-violet-electric" />
                  {style.name}
                </CardTitle>
                <CardDescription>{style.description}</CardDescription>
              </div>
              <Badge variant="secondary" className="capitalize">{style.category}</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={style.enabled} onCheckedChange={() => toggleStyle(style.id)} />
                <span className="text-sm text-muted-foreground">
                  {style.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
