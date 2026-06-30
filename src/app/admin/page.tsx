import { CreativeEngine3DDynamic } from "@/components/3d/dynamic";
import { AdminStatsCards } from "@/components/admin/AdminStatsCards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import type { AdminStat } from "@/lib/types/components";

export default async function AdminOverviewPage() {
  const [userCount, jobCount, activeJobs, totalCredits] = await Promise.all([
    prisma.user.count(),
    prisma.generationJob.count(),
    prisma.generationJob.count({ where: { status: { in: ["queued", "processing"] } } }),
    prisma.creditWallet.aggregate({ _sum: { balance: true } }),
  ]);

  const stats: AdminStat[] = [
    { label: "Total Users", value: userCount, change: "+12% this month", trend: "up" },
    { label: "Total Jobs", value: jobCount, change: "+8% this week", trend: "up" },
    { label: "Active Jobs", value: activeJobs, trend: "neutral" },
    {
      label: "Credits in circulation",
      value: (totalCredits._sum.balance ?? 0).toLocaleString(),
      trend: "neutral",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">Platform health and creative engine control room</p>
      </div>

      <AdminStatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle>Creative Engine Control Room</CardTitle>
            <CardDescription>Real-time visualization of platform generation activity</CardDescription>
          </CardHeader>
          <CardContent className="h-80 overflow-hidden rounded-xl border border-border/60 p-0">
            <CreativeEngine3DDynamic mode="ignition" size="lg" className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
