"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TemplatePreview } from "@/components/digital-product/TemplatePreview";
import { ExportDropdown } from "@/components/digital-product/ExportDropdown";
import { toast } from "@/components/ui/toast";
import type { TemplateDesignJson } from "@/lib/digital-product/types";

export default function TemplateEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [design, setDesign] = useState<TemplateDesignJson | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/digital-product/${id}`);
      const data = await res.json();
      if (data.product) {
        setDesign(data.product.designJson as TemplateDesignJson);
        setTitle(data.product.title);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    if (!design) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/digital-product/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          designJson: { ...design, title },
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: "Saved", description: "Template updated successfully." });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!design) {
    return <p className="text-muted-foreground">Template not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Template Editor</h1>
          <p className="text-muted-foreground">Edit text, colors, and sections before export.</p>
        </div>
        <div className="flex gap-2">
          <ExportDropdown productId={id} />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader><CardTitle>Edit Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setDesign({ ...design, title: e.target.value });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Input
                value={design.subtitle}
                onChange={(e) => setDesign({ ...design, subtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CTA</Label>
              <Input
                value={design.cta}
                onChange={(e) => setDesign({ ...design, cta: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Style</Label>
              <Input
                value={design.brandStyle}
                onChange={(e) => setDesign({ ...design, brandStyle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={design.colorPalette[0] ?? "#3B82F6"}
                onChange={(e) => {
                  const palette = [...design.colorPalette];
                  palette[0] = e.target.value;
                  setDesign({ ...design, colorPalette: palette });
                }}
              />
            </div>
            {design.sections.map((section, i) => (
              <div key={section.id} className="space-y-2 rounded-lg border border-border/40 p-3">
                <Label>Section: {section.type}</Label>
                <Input
                  value={section.heading}
                  onChange={(e) => {
                    const sections = [...design.sections];
                    sections[i] = { ...section, heading: e.target.value };
                    setDesign({ ...design, sections });
                  }}
                />
                <Textarea
                  value={section.body}
                  onChange={(e) => {
                    const sections = [...design.sections];
                    sections[i] = { ...section, body: e.target.value };
                    setDesign({ ...design, sections });
                  }}
                  rows={2}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <TemplatePreview design={design} />
      </div>
    </div>
  );
}
