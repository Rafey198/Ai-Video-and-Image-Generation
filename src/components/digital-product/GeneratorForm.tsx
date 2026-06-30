"use client";

import { useState } from "react";
import { Loader2, Sparkles, Download, RefreshCw } from "lucide-react";
import { DigitalProductType, ExportFormat, GenerationDataMode } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { TemplatePreview } from "@/components/digital-product/TemplatePreview";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";
import { GENERATION_COUNTS, CANVA_HELPER_TEXT } from "@/lib/digital-product/constants";
import type { TemplateDesignJson } from "@/lib/digital-product/types";

type GeneratorFormProps = {
  type: DigitalProductType;
  category: string;
  title: string;
  description: string;
  categories?: { value: string; label: string }[];
  sizes?: { value: string; label: string }[];
  extraFields?: React.ReactNode;
  defaultExportFormats?: ExportFormat[];
};

export function GeneratorForm({
  type,
  category: defaultCategory,
  title,
  description,
  categories,
  sizes,
  extraFields,
  defaultExportFormats = ["pdf", "png", "pptx", "json"],
}: GeneratorFormProps) {
  const [idea, setIdea] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [colorPreference, setColorPreference] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [size, setSize] = useState(sizes?.[0]?.value ?? "us_letter");
  const [count, setCount] = useState(1);
  const [randomMode, setRandomMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [design, setDesign] = useState<TemplateDesignJson | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/digital-product/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category: selectedCategory,
          dataMode: randomMode ? GenerationDataMode.random_seed : GenerationDataMode.user_provided,
          count,
          idea,
          industry,
          audience,
          goal,
          colorPreference,
          stylePreference,
          size,
          exportFormats: defaultExportFormats,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      const product = data.products[0];
      setProductId(product.id);
      setDesign(product.designJson as TemplateDesignJson);
      toast({ title: "Generated!", description: `Created ${data.count} template(s).` });
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

  async function handleRegenerate(target: string) {
    if (!productId) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/digital-product/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDesign(data.design);
      toast({ title: "Regenerated", description: `Updated ${target.replace(/_/g, " ")}.` });
    } catch (err) {
      toast({
        title: "Regeneration failed",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card className="border-border/60 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="random-mode">Random backend data mode</Label>
                <Switch id="random-mode" checked={randomMode} onCheckedChange={setRandomMode} />
              </div>

              {categories && (
                <div className="space-y-2">
                  <Label>Template Type</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Your Idea / Business</Label>
                <Textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your business, niche, or template needs..."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. SaaS" />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Startups" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Goal</Label>
                  <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Raise funding" />
                </div>
                <div className="space-y-2">
                  <Label>Style Preference</Label>
                  <Input value={stylePreference} onChange={(e) => setStylePreference(e.target.value)} placeholder="e.g. Modern minimal" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Preference</Label>
                <Input value={colorPreference} onChange={(e) => setColorPreference(e.target.value)} placeholder="e.g. #3B82F6 or blue tones" />
              </div>

              {sizes && (
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {sizes.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {extraFields}

              <div className="space-y-2">
                <Label>Number of Templates</Label>
                <div className="flex flex-wrap gap-2">
                  {GENERATION_COUNTS.map((n) => (
                    <Button
                      key={n}
                      variant={count === n ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCount(n)}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={generating} className="w-full">
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Template{count > 1 ? `s (${count})` : ""}
              </Button>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">{CANVA_HELPER_TEXT}</p>
        </div>

        <div className="space-y-4">
          {design ? (
            <>
              <TemplatePreview design={design} />
              <div className="flex flex-wrap gap-2">
                <ExportDropdown productId={productId!} />
                {productId && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/digital-product/editor/${productId}`}>Edit Template</a>
                  </Button>
                )}
                {["headline", "sections", "pricing", "cta", "colors"].map((target) => (
                  <Button
                    key={target}
                    variant="outline"
                    size="sm"
                    disabled={regenerating}
                    onClick={() => handleRegenerate(target)}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    {target}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <Card className="flex h-96 items-center justify-center border-border/60 border-dashed bg-card/30">
              <div className="text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-40" />
                <p>Your generated template will appear here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
