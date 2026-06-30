"use client";

import { useState } from "react";
import { CheckCircle2, Server, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const PROVIDERS = [
  { id: "mock", name: "Mock Provider", status: "healthy", latency: "12ms", enabled: true },
  { id: "replicate", name: "Replicate", status: "healthy", latency: "240ms", enabled: false },
  { id: "fal", name: "Fal.ai", status: "degraded", latency: "890ms", enabled: false },
  { id: "runpod", name: "RunPod", status: "offline", latency: "—", enabled: false },
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState(PROVIDERS);

  function toggleProvider(id: string) {
    setProviders((p) =>
      p.map((provider) =>
        provider.id === id ? { ...provider, enabled: !provider.enabled } : provider
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Providers</h1>
        <p className="text-muted-foreground">Manage external inference provider connections</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {providers.map((provider) => (
          <Card key={provider.id} className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Server className="h-5 w-5" />
                  {provider.name}
                </CardTitle>
                <CardDescription>Latency: {provider.latency}</CardDescription>
              </div>
              <Badge
                className={
                  provider.status === "healthy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : provider.status === "degraded"
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-destructive/20 text-destructive"
                }
              >
                {provider.status === "healthy" ? (
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                ) : (
                  <XCircle className="mr-1 h-3 w-3" />
                )}
                {provider.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={provider.enabled} onCheckedChange={() => toggleProvider(provider.id)} />
                <span className="text-sm text-muted-foreground">
                  {provider.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
