"use client";

import { useState } from "react";
import { Plus, Shield, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const SAFETY_RULES = [
  { id: "1", pattern: "explicit content", action: "block", enabled: true, hits: 142 },
  { id: "2", pattern: "violence", action: "flag", enabled: true, hits: 38 },
  { id: "3", pattern: "celebrity likeness", action: "block", enabled: true, hits: 89 },
  { id: "4", pattern: "copyrighted characters", action: "flag", enabled: false, hits: 12 },
];

export default function AdminModerationPage() {
  const [rules, setRules] = useState(SAFETY_RULES);
  const [newPattern, setNewPattern] = useState("");

  function toggleRule(id: string) {
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Safety & Moderation</h1>
        <p className="text-muted-foreground">Configure content safety rules and moderation policies</p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Safety rules
          </CardTitle>
          <CardDescription>Patterns matched against prompts before generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New pattern..."
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="border-border/60 bg-background/50"
            />
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add rule
            </Button>
          </div>

          <div className="divide-y divide-border/40">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm">{rule.pattern}</p>
                  <p className="text-xs text-muted-foreground">{rule.hits} hits this month</p>
                </div>
                <Badge
                  className={
                    rule.action === "block"
                      ? "bg-destructive/20 text-destructive"
                      : "bg-orange-500/20 text-orange-400"
                  }
                >
                  {rule.action}
                </Badge>
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                <Button variant="ghost" size="icon">
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
