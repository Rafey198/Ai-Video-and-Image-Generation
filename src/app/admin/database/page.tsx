"use client";

import { Database, HardDrive, RefreshCw, Table2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TABLE_STATS = [
  { name: "User", rows: 2840, size: "1.2 MB" },
  { name: "GenerationJob", rows: 142000, size: "48 MB" },
  { name: "MediaAsset", rows: 89000, size: "12 MB" },
  { name: "CreditTransaction", rows: 320000, size: "24 MB" },
  { name: "Notification", rows: 45000, size: "8 MB" },
];

export default function AdminDatabasePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Database</h1>
          <p className="text-muted-foreground">Database health and maintenance tools</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh stats
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Database className="h-4 w-4" />
              Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">PostgreSQL</p>
            <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Connected</Badge>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <HardDrive className="h-4 w-4" />
              Database size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">93.2 MB</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Migrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Up to date</p>
            <p className="text-xs text-muted-foreground">Last: 2026-06-28</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Table statistics
          </CardTitle>
          <CardDescription>Row counts and approximate sizes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Table</th>
                  <th className="pb-3 pr-4 font-medium">Rows</th>
                  <th className="pb-3 font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_STATS.map((table) => (
                  <tr key={table.name} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4 font-mono">{table.name}</td>
                    <td className="py-3 pr-4 tabular-nums">{table.rows.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{table.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>Database operations — use with caution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Run Prisma migrate</Button>
          <Button variant="outline">Seed database</Button>
          <Button variant="destructive">Purge old jobs (90d+)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
