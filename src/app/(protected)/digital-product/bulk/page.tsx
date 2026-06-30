"use client";

import { useState } from "react";
import { Loader2, Package } from "lucide-react";
import { GenerationDataMode } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";
import { toast } from "@/components/ui/toast";
import { parseApiJson } from "@/lib/utils/parse-api-json";
import { BULK_PACK_TYPES } from "@/lib/digital-product/constants";

export default function BulkPackPage() {
  const [packType, setPackType] = useState("business_startup_kit");
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("");
  const [randomMode, setRandomMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/digital-product/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bulk_pack",
          category: packType,
          dataMode: randomMode ? GenerationDataMode.random_seed : GenerationDataMode.user_provided,
          idea,
          industry,
          exportFormats: ["zip", "pdf", "pptx", "xlsx", "svg", "png"],
        }),
      });

      const data = await parseApiJson<{ products: { id: string }[]; error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setProductId(data.products[0].id);
      toast({ title: "Digital pack generated!", description: "Export as ZIP for the complete bundle." });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bulk Digital Product Pack Generator</h1>
        <p className="text-muted-foreground">Complete downloadable bundles with one-pagers, brochures, logos, and more.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Bundle Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Random backend data mode</Label>
              <Switch checked={randomMode} onCheckedChange={setRandomMode} />
            </div>
            <div className="space-y-2">
              <Label>Pack Type</Label>
              <Select value={packType} onValueChange={setPackType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BULK_PACK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Business / Niche</Label>
              <Textarea value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe your business or niche..." />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
              Generate Digital Pack
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Bundle Contents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["One-Pager", "Brochure", "Logo SVG", "Brand Guide", "Excel Workbook", "Planner PDF", "Instructions", "Preview Images"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2">
                <span className="text-sm">{item}</span>
                <Badge variant="outline" className="text-xs">Included</Badge>
              </div>
            ))}
            <div className="mt-4 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
              ZIP structure: /PDF, /Excel, /PPTX, /SVG, /PNG, /BrandKit, /Instructions, /PreviewImages, README
            </div>
            {productId && <ExportDropdown productId={productId} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
