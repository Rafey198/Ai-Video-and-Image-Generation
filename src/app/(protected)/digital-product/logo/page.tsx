"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { GenerationDataMode } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";
import { toast } from "@/components/ui/toast";
import { LOGO_SERVICE_DESCRIPTION, CANVA_HELPER_TEXT } from "@/lib/digital-product/constants";
import type { LogoConcept } from "@/lib/digital-product/types";
import { parseApiJson } from "@/lib/utils/parse-api-json";

const STYLES = ["modern", "classic", "luxury", "minimal", "tech", "playful", "corporate"];

export default function LogoGeneratorPage() {
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("modern");
  const [iconIdea, setIconIdea] = useState("");
  const [colors, setColors] = useState("");
  const [randomMode, setRandomMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [concepts, setConcepts] = useState<LogoConcept[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [productId, setProductId] = useState<string | null>(null);

  async function handleGenerate() {
    if (!businessName.trim()) {
      toast({ title: "Business name required", variant: "destructive" });
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/digital-product/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "logo",
          category: "logo",
          dataMode: randomMode ? GenerationDataMode.random_seed : GenerationDataMode.user_provided,
          idea: businessName,
          industry,
          audience,
          stylePreference: style,
          logoOptions: {
            businessName,
            tagline,
            industry,
            targetAudience: audience,
            iconIdea,
            stylePreference: style,
            preferredColors: colors ? colors.split(",").map((c) => c.trim()) : undefined,
            conceptCount: 8,
          },
        }),
      });

      const data = await parseApiJson<{ products: { id: string }[]; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setProductId(data.products[0].id);

      const logoRes = await fetch(`/api/digital-product/${data.products[0].id}`);
      const logoData = await parseApiJson<{
        product?: { logoProject?: { conceptsJson?: LogoConcept[] } };
      }>(logoRes);
      const projectConcepts = logoData.product?.logoProject?.conceptsJson as LogoConcept[];
      setConcepts(projectConcepts ?? []);
      setSelectedIndex(0);

      toast({ title: "Logo concepts generated!" });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  }

  const selected = concepts[selectedIndex];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Logo & Branding Kit Generator</h1>
        <p className="text-muted-foreground">SVG-first logo design with editable vector output.</p>
      </div>

      <Card className="border-border/60 bg-card/40">
        <CardContent className="pt-6">
          <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
            {LOGO_SERVICE_DESCRIPTION}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Brand Brief</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Random backend data mode</Label>
              <Switch checked={randomMode} onCheckedChange={setRandomMode} />
            </div>
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Slogan / Tagline</Label>
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon Idea</Label>
              <Textarea value={iconIdea} onChange={(e) => setIconIdea(e.target.value)} placeholder="Describe your ideal icon or symbol..." />
            </div>
            <div className="space-y-2">
              <Label>Preferred Colors (comma-separated)</Label>
              <Input value={colors} onChange={(e) => setColors(e.target.value)} placeholder="#3B82F6, #1E293B" />
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Logo Concepts
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {selected ? (
            <>
              <Card className="border-border/60 bg-card/50">
                <CardContent className="flex flex-col items-center p-8">
                  <div
                    className="mb-4 flex w-full items-center justify-center rounded-xl bg-white p-8"
                    dangerouslySetInnerHTML={{ __html: selected.svg }}
                  />
                  <h3 className="font-semibold">{selected.name}</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">{selected.rationale}</p>
                  <div className="mt-3 flex gap-1">
                    {selected.colors.map((c) => (
                      <div key={c} className="h-5 w-5 rounded-full border" style={{ background: c }} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-2">
                {concepts.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIndex(i)}
                    className={`rounded-lg border p-2 transition-all ${i === selectedIndex ? "border-primary ring-2 ring-primary/30" : "border-border/60"}`}
                  >
                    <div className="flex h-12 items-center justify-center bg-white rounded" dangerouslySetInnerHTML={{ __html: c.svg }} />
                  </button>
                ))}
              </div>

              {productId && <ExportDropdown productId={productId} />}
            </>
          ) : (
            <Card className="flex h-96 items-center justify-center border-dashed border-border/60 bg-card/30">
              <p className="text-muted-foreground">Logo concepts will appear here</p>
            </Card>
          )}
          <p className="text-xs text-muted-foreground">{CANVA_HELPER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}
