"use client";

import { CheckCircle2, GitBranch, Rocket, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DEPLOYMENTS = [
  { id: "1", env: "production", version: "v0.1.0", status: "live", deployedAt: "2 hours ago", commit: "a3f8c21" },
  { id: "2", env: "staging", version: "v0.1.1-rc1", status: "deploying", deployedAt: "In progress", commit: "b7d2e94" },
  { id: "3", env: "preview", version: "pr-42", status: "live", deployedAt: "30 min ago", commit: "c9e1f03" },
];

export default function AdminDeploymentPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deployment</h1>
          <p className="text-muted-foreground">Environment status and release management</p>
        </div>
        <Button className="bg-aurora shadow-neon-sm">
          <Rocket className="mr-2 h-4 w-4" />
          Trigger deploy
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Production</p>
            <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Healthy</Badge>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Uptime (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">99.97%</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active instances</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">3</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Recent deployments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {DEPLOYMENTS.map((dep) => (
            <div key={dep.id} className="flex items-center gap-4 rounded-lg border border-border/60 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium capitalize">{dep.env}</p>
                  <Badge variant="secondary">{dep.version}</Badge>
                  {dep.status === "live" ? (
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Live
                    </Badge>
                  ) : (
                    <Badge className="bg-cyan-aurora/20 text-cyan-aurora">Deploying</Badge>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  {dep.commit} · {dep.deployedAt}
                </p>
              </div>
              {dep.status === "deploying" && <Progress value={65} className="w-24" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
