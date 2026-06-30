"use client";

import { useState } from "react";
import { FileText, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONFIG } from "@/config/site";

export default function AdminContentPage() {
  const [heroTitle, setHeroTitle] = useState(`Create with ${SITE_CONFIG.name}`);
  const [heroSubtitle, setHeroSubtitle] = useState(SITE_CONFIG.tagline);
  const [metaDescription, setMetaDescription] = useState(SITE_CONFIG.description);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Content</h1>
          <p className="text-muted-foreground">Edit marketing and public-facing content</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Save className="mr-2 h-4 w-4" />
          Publish changes
        </Button>
      </div>

      <Tabs defaultValue="homepage">
        <TabsList className="bg-card/50">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="mt-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Hero section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="border-border/60 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Subheadline</Label>
                <Input
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="border-border/60 bg-background/50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle>SEO metadata</CardTitle>
              <CardDescription>Meta tags for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta description</Label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="border-border/60 bg-background/50 resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle>Legal pages</CardTitle>
              <CardDescription>Edit terms, privacy, and policy content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Legal page editor connects to your CMS or markdown files in the repository.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
