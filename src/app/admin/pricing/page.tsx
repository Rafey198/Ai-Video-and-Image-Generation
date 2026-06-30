"use client";

import { useState } from "react";
import { DollarSign, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_PRICING = [
  { id: "image-base", label: "Image generation (base)", credits: 10 },
  { id: "video-per-sec", label: "Video (per second)", credits: 5 },
  { id: "audio-per-sec", label: "Audio (per second)", credits: 2 },
  { id: "upscale", label: "Upscale 4x", credits: 15 },
  { id: "sync", label: "Lip sync (per minute)", credits: 20 },
];

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  function updateCredits(id: string, credits: number) {
    setPricing((p) => p.map((item) => (item.id === id ? { ...item, credits } : item)));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pricing Configuration</h1>
          <p className="text-muted-foreground">Set credit costs for generation types</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Save className="mr-2 h-4 w-4" />
          Save changes
        </Button>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Credit costs
          </CardTitle>
          <CardDescription>Base credit pricing for each operation type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pricing.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <Label className="min-w-[200px] flex-1">{item.label}</Label>
              <Input
                type="number"
                value={item.credits}
                onChange={(e) => updateCredits(item.id, Number(e.target.value))}
                className="w-24 border-border/60 bg-background/50"
              />
              <span className="text-sm text-muted-foreground">credits</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
