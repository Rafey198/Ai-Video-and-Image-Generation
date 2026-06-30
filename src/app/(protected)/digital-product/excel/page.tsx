"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { GenerationDataMode } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";
import { toast } from "@/components/ui/toast";
import { SPREADSHEET_TEMPLATES } from "@/lib/digital-product/constants";

export default function ExcelTemplatePage() {
  const [templateType, setTemplateType] = useState("ultimate_project_manager");
  const [colorTheme, setColorTheme] = useState("#3B82F6");
  const [sampleData, setSampleData] = useState(true);
  const [formulas, setFormulas] = useState(true);
  const [sheetsCompatible, setSheetsCompatible] = useState(true);
  const [randomMode, setRandomMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [tabCount, setTabCount] = useState(0);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/digital-product/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "spreadsheet",
          category: templateType,
          dataMode: randomMode ? GenerationDataMode.random_seed : GenerationDataMode.user_provided,
          spreadsheetOptions: {
            templateType,
            colorTheme,
            sampleData,
            includeFormulas: formulas,
            sheetsCompatible,
            mode: "advanced",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProductId(data.products[0].id);

      const detail = await fetch(`/api/digital-product/${data.products[0].id}`);
      const detailData = await detail.json();
      setTabCount(detailData.product?.spreadsheet?.tabCount ?? 0);

      toast({ title: "Spreadsheet generated!", description: `${tabCount || "Multi-tab"} workbook ready.` });
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
        <h1 className="text-2xl font-bold tracking-tight">AI Excel Template Maker</h1>
        <p className="text-muted-foreground">Generate complete multi-tab Excel workbooks with formulas and dashboards.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Spreadsheet Options</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Random backend data mode</Label>
              <Switch checked={randomMode} onCheckedChange={setRandomMode} />
            </div>
            <div className="space-y-2">
              <Label>Template Type</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPREADSHEET_TEMPLATES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <Input type="color" value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include sample data</Label>
              <Switch checked={sampleData} onCheckedChange={setSampleData} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include formulas</Label>
              <Switch checked={formulas} onCheckedChange={setFormulas} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Google Sheets compatible</Label>
              <Switch checked={sheetsCompatible} onCheckedChange={setSheetsCompatible} />
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Workbook
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Workbook Preview</CardTitle></CardHeader>
          <CardContent>
            {productId ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tabCount > 0 ? `${tabCount} tabs generated` : "Workbook ready for export"}
                </p>
                <div className="rounded-lg border border-border/60 bg-muted/20 p-4 font-mono text-xs">
                  {templateType.replace(/_/g, " / ")}.xlsx
                </div>
                <ExportDropdown productId={productId} />
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                Generate a workbook to preview
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
