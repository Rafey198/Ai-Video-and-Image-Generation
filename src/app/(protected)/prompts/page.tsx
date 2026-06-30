"use client";

import { useState } from "react";
import { BookOpen, Copy, Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";

const MOCK_PROMPTS = [
  { id: "1", title: "Cinematic landscape", category: "image", prompt: "Misty mountain valley at golden hour, volumetric light, 8k cinematic", uses: 12 },
  { id: "2", title: "Product hero shot", category: "image", prompt: "Minimal product photography, soft studio lighting, white backdrop, premium feel", uses: 8 },
  { id: "3", title: "Ambient loop", category: "audio", prompt: "Ethereal ambient soundscape, slow evolving pads, 60bpm, seamless loop", uses: 5 },
  { id: "4", title: "Character walk cycle", category: "video", prompt: "Stylized character walking through neon city, side view, smooth motion", uses: 3 },
];

export default function PromptsPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = MOCK_PROMPTS.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.prompt.toLowerCase().includes(query.toLowerCase());
    const matchesTab = tab === "all" || p.category === tab;
    return matchesQuery && matchesTab;
  });

  function copyPrompt(prompt: string) {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Copied to clipboard" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground">Save and reuse your best prompts</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Plus className="mr-2 h-4 w-4" />
          New prompt
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-border/60 bg-background/50 pl-9"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-card/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.id} className="border-border/60 bg-card/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-violet-electric" />
                  {item.title}
                </CardTitle>
                <Badge variant="secondary" className="capitalize">{item.category}</Badge>
              </div>
              <CardDescription>{item.uses} uses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="line-clamp-3 text-sm text-muted-foreground">{item.prompt}</p>
              <Button variant="outline" size="sm" onClick={() => copyPrompt(item.prompt)}>
                <Copy className="mr-2 h-3 w-3" />
                Copy prompt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
