import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  AudioLines,
  CreditCard,
  Image,
  Music,
  Sparkles,
  Upload,
  Video,
} from "lucide-react";

import { GalleryPreview } from "@/components/dashboard/GalleryPreview";
import { RecentJobs } from "@/components/dashboard/RecentJobs";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { safeDbQuery } from "@/lib/db/safe-query";
import { formatCredits } from "@/lib/utils";
import type { JobSummary, MediaItem, UsageDataPoint } from "@/lib/types/components";

export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/studio/image", label: "Image Studio", icon: Image, color: "text-violet-electric" },
  { href: "/studio/video", label: "Video Studio", icon: Video, color: "text-cyan-aurora" },
  { href: "/studio/audio", label: "Audio Studio", icon: Music, color: "text-emerald-400" },
  { href: "/studio/sync", label: "Sync Studio", icon: AudioLines, color: "text-orange-400" },
  { href: "/uploads", label: "Upload Media", icon: Upload, color: "text-muted-foreground" },
  { href: "/billing", label: "Buy Credits", icon: CreditCard, color: "text-muted-foreground" },
];

function buildUsageData(transactions: { amount: number; createdAt: Date }[]): UsageDataPoint[] {
  const map = new Map<string, UsageDataPoint>();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    map.set(key, {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      credits: 0,
      jobs: 0,
    });
  }

  for (const tx of transactions) {
    const key = tx.createdAt.toISOString().slice(0, 10);
    const day = map.get(key);
    if (day && tx.amount < 0) {
      day.credits += Math.abs(tx.amount);
    }
  }

  return Array.from(map.values());
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [wallet, jobs, media, transactions, jobCount] = await Promise.all([
    safeDbQuery(
      () => prisma.creditWallet.findUnique({ where: { userId: session.user.id } }),
      null
    ),
    safeDbQuery(
      () =>
        prisma.generationJob.findMany({
          where: { userId: session.user.id },
          include: { model: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      []
    ),
    safeDbQuery(
      () =>
        prisma.mediaAsset.findMany({
          where: { userId: session.user.id },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
      []
    ),
    safeDbQuery(
      () =>
        prisma.creditTransaction.findMany({
          where: { userId: session.user.id, createdAt: { gte: weekAgo } },
          select: { amount: true, createdAt: true },
        }),
      []
    ),
    safeDbQuery(
      () =>
        prisma.generationJob.count({
          where: { userId: session.user.id, createdAt: { gte: weekAgo } },
        }),
      0
    ),
  ]);

  const jobSummaries: JobSummary[] = jobs.map((job) => ({
    id: job.id,
    type: job.type,
    status: job.status,
    prompt: job.prompt,
    modelName: job.model.name,
    creditsCost: job.creditsCost,
    progress: job.progress,
    createdAt: job.createdAt,
  }));

  const mediaItems: MediaItem[] = media.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    url: item.url,
    thumbnailUrl: item.thumbnailUrl,
    duration: item.duration,
    width: item.width,
    height: item.height,
    createdAt: item.createdAt,
  }));

  const usageData = buildUsageData(transactions);
  const name = session.user.name ?? session.user.email?.split("@")[0] ?? "Creator";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {name}
          </h1>
          <p className="text-muted-foreground">
            Your creative command center — {formatCredits(wallet?.balance ?? 0)} credits available
          </p>
        </div>
        <Button asChild className="bg-aurora shadow-neon-sm">
          <Link href="/studio/image">
            <Sparkles className="mr-2 h-4 w-4" />
            New generation
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{formatCredits(wallet?.balance ?? 0)}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jobs this week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{jobCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Media assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{media.length}+</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {jobs[0]
                ? formatDistanceToNow(jobs[0].createdAt, { addSuffix: true })
                : "Just getting started"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="border-border/60 bg-card/50 transition-colors hover:border-primary/30 hover:bg-card/80">
                <CardContent className="flex items-center gap-3 p-4">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChart data={usageData} />
        <RecentJobs jobs={jobSummaries} />
      </div>

      <GalleryPreview items={mediaItems} />
    </div>
  );
}
