"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Edit, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GALLERY_FILTERS } from "@/lib/digital-product/constants";

type GalleryTemplate = {
  id: string;
  name: string;
  description: string | null;
  productType: string;
  difficulty: string;
  defaultSize: string | null;
  pageCount: number;
  tabCount: number;
  exportFormats: string[];
  featured: boolean;
  category: { name: string; slug: string };
};

export default function TemplateGalleryPage() {
  const [templates, setTemplates] = useState<GalleryTemplate[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      const filterDef = GALLERY_FILTERS.find((f) => f.id === filter);
      if (filterDef?.type) params.set("type", filterDef.type);
      const res = await fetch(`/api/digital-product/gallery?${params}`);
      const data = await res.json();
      setTemplates(data.templates ?? []);
      setLoading(false);
    }
    load();
  }, [filter]);

  const filtered = templates.filter(
    (t) => !search || t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Template Gallery</h1>
        <p className="text-muted-foreground">Browse professional templates across all categories.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {GALLERY_FILTERS.map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-card/30" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className="group h-full border-border/60 bg-card/50 transition-all hover:border-primary/40 hover:shadow-neon-sm">
                <div
                  className="h-32 rounded-t-lg"
                  style={{
                    background: `linear-gradient(135deg, hsl(${i * 40}, 60%, 20%) 0%, hsl(${i * 40 + 60}, 50%, 30%) 100%)`,
                  }}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.featured && <Badge className="text-xs">Featured</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">{template.category.name}</Badge>
                    <Badge variant="outline" className="text-xs">{template.difficulty}</Badge>
                    {template.tabCount > 1 && (
                      <Badge variant="outline" className="text-xs">{template.tabCount} tabs</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/digital-product/${template.productType === "one_pager" ? "one-pager" : template.productType === "spreadsheet" ? "excel" : template.productType === "business_template" ? "business" : template.productType}`}>
                        <Sparkles className="mr-1 h-3 w-3" /> Generate
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
