"use client";

import { useState } from "react";
import { Copy, Plus, Trash2, Webhook } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";

const MOCK_WEBHOOKS = [
  { id: "1", url: "https://api.example.com/webhooks/jobs", events: ["job.completed", "job.failed"], enabled: true },
  { id: "2", url: "https://hooks.slack.com/services/...", events: ["job.failed"], enabled: false },
];

export default function AdminApiPage() {
  const [webhooks, setWebhooks] = useState(MOCK_WEBHOOKS);
  const [rateLimit, setRateLimit] = useState(60);

  function copyWebhookSecret() {
    navigator.clipboard.writeText("whsec_mock_secret_key_abc123");
    toast({ title: "Webhook secret copied" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API & Webhooks</h1>
        <p className="text-muted-foreground">Configure platform API settings and webhook endpoints</p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>API rate limits</CardTitle>
          <CardDescription>Default requests per minute per API key</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Input
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(Number(e.target.value))}
            className="w-24 border-border/60 bg-background/50"
          />
          <span className="text-sm text-muted-foreground">requests / minute</span>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>Outbound event notifications</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add webhook
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
            <Label className="text-sm">Signing secret</Label>
            <code className="flex-1 truncate font-mono text-xs text-muted-foreground">
              whsec_••••••••••••••••
            </code>
            <Button variant="ghost" size="icon" onClick={copyWebhookSecret}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="divide-y divide-border/40">
            {webhooks.map((wh) => (
              <div key={wh.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">{wh.url}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {wh.events.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
                <Switch
                  checked={wh.enabled}
                  onCheckedChange={() =>
                    setWebhooks((w) =>
                      w.map((hook) => (hook.id === wh.id ? { ...hook, enabled: !hook.enabled } : hook))
                    )
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setWebhooks((w) => w.filter((hook) => hook.id !== wh.id))}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
