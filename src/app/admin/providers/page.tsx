"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Server, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type HealthEntry = {
  ok: boolean;
  message: string;
  latencyMs?: number;
  mode?: string;
  pending?: number;
};

type HealthResponse = {
  checkedAt: string;
  demoMode: boolean;
  services: Record<string, HealthEntry>;
};

const SERVICE_LABELS: Record<string, string> = {
  neon: "Neon PostgreSQL",
  r2: "Cloudflare R2",
  openai: "OpenAI",
  replicate: "Replicate",
  huggingface: "Hugging Face",
  redis: "Redis Queue",
  stripe: "Stripe Billing",
  googleOAuth: "Google OAuth",
  comfyui: "ComfyUI",
  customWorker: "Custom Worker",
};

export default function AdminProvidersPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/providers/health");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load provider health");
      }
      setHealth(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Health check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  const services = health?.services ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Provider Health</h1>
          <p className="text-muted-foreground">
            Live status of production integrations
            {health?.demoMode && (
              <Badge variant="secondary" className="ml-2">
                Demo mode
              </Badge>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadHealth()} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {health?.checkedAt && (
        <p className="text-xs text-muted-foreground">
          Last checked: {new Date(health.checkedAt).toLocaleString()}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(SERVICE_LABELS).map(([key, label]) => {
          const entry = services[key];
          if (!entry) return null;

          const status = entry.ok ? "healthy" : key === "redis" || key === "stripe" ? "skipped" : "offline";

          return (
            <Card key={key} className="border-border/60 bg-card/50">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Server className="h-5 w-5" />
                    {label}
                  </CardTitle>
                  <CardDescription>
                    {entry.latencyMs != null ? `Latency: ${entry.latencyMs}ms` : entry.message}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    status === "healthy"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : status === "skipped"
                        ? "bg-muted text-muted-foreground"
                        : "bg-destructive/20 text-destructive"
                  }
                >
                  {status === "healthy" ? (
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {status === "healthy" ? "healthy" : status === "skipped" ? "skipped" : "offline"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{entry.message}</p>
                {entry.mode && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Queue mode: {entry.mode}
                    {entry.pending != null ? ` · pending: ${entry.pending}` : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
