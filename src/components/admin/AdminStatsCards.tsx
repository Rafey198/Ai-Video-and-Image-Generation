"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AdminStat } from "@/lib/types/components";

type AdminStatsCardsProps = {
  stats: AdminStat[];
};

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            {stat.trend && <TrendIcon trend={stat.trend} />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
            {stat.change && (
              <p
                className={cn(
                  "mt-1 text-xs",
                  stat.trend === "up" && "text-emerald-400",
                  stat.trend === "down" && "text-destructive",
                  stat.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-emerald-400" />;
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}
