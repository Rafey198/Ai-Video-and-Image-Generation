"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const USAGE_DATA = [
  { date: "Mon", users: 420, jobs: 1200, revenue: 2400 },
  { date: "Tue", users: 380, jobs: 980, revenue: 2100 },
  { date: "Wed", users: 510, jobs: 1450, revenue: 3200 },
  { date: "Thu", users: 490, jobs: 1320, revenue: 2800 },
  { date: "Fri", users: 620, jobs: 1680, revenue: 4100 },
  { date: "Sat", users: 580, jobs: 1540, revenue: 3600 },
  { date: "Sun", users: 440, jobs: 1100, revenue: 2600 },
];

const MODEL_USAGE = [
  { model: "Flux Pro", jobs: 4200 },
  { model: "Kling Video", jobs: 2800 },
  { model: "Suno Audio", jobs: 1900 },
  { model: "SDXL", jobs: 1500 },
  { model: "Other", jobs: 800 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform usage, growth, and revenue metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "DAU", value: "2,840" },
          { label: "Jobs today", value: "4,120" },
          { label: "Conversion", value: "3.2%" },
          { label: "MRR", value: "$48.2k" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Weekly activity</CardTitle>
            <CardDescription>Active users and jobs over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USAGE_DATA}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="jobs" stroke="#22D3EE" fill="url(#userGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>Model usage</CardTitle>
            <CardDescription>Jobs by model this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MODEL_USAGE} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis dataKey="model" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="jobs" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
