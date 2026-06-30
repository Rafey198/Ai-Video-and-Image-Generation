"use client";

import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MOCK_TEMPLATES = [
  { id: "1", name: "Cinematic opener", category: "video", prompt: "Sweeping aerial shot of futuristic city at dusk, cinematic lighting", public: true },
  { id: "2", name: "Podcast intro", category: "audio", prompt: "Upbeat electronic intro sting, 5 seconds, energetic", public: true },
  { id: "3", name: "Product flat lay", category: "image", prompt: "Top-down product photography, minimal props, soft shadows", public: false },
];

export default function AdminPromptsPage() {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt Templates</h1>
          <p className="text-muted-foreground">Manage platform-wide prompt templates</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((t) => (
          <Card key={t.id} className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4" />
                  {t.name}
                </CardTitle>
                <CardDescription className="capitalize">{t.category}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={t.public ? "default" : "secondary"}>
                  {t.public ? "Public" : "Private"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTemplates((ts) => ts.filter((x) => x.id !== t.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={t.prompt}
                readOnly
                rows={2}
                className="border-border/60 bg-background/50 resize-none text-sm"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-border/60 bg-card/30">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row">
          <Input placeholder="Template name" className="border-border/60 bg-background/50" />
          <Input placeholder="Category" className="border-border/60 bg-background/50 sm:w-32" />
          <Button variant="outline" className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Quick add
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
