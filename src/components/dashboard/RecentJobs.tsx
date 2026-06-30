"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Image, Music, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { JobSummary } from "@/lib/types/components";

type RecentJobsProps = {
  jobs: JobSummary[];
  viewAllHref?: string;
};

const STATUS_STYLES: Record<string, string> = {
  queued: "bg-muted text-muted-foreground",
  processing: "bg-cyan-aurora/20 text-cyan-aurora",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-destructive/20 text-destructive",
  canceled: "bg-muted text-muted-foreground",
};

function getTypeIcon(type: string) {
  if (type.includes("video")) return Video;
  if (type.includes("audio")) return Music;
  return Image;
}

export function RecentJobs({ jobs, viewAllHref = "/history" }: RecentJobsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Jobs</CardTitle>
          <CardDescription>Your latest generation activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Image}
            title="No generations yet"
            description="Start in Image Studio or Video Studio to see your jobs here."
            actionLabel="Open Image Studio"
            actionHref="/studio/image"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Prompt</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Credits</th>
                  <th className="pb-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const TypeIcon = getTypeIcon(job.type);
                  const isActive = job.status === "processing" || job.status === "queued";

                  return (
                    <tr key={job.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">{job.type.replace(/_/g, " ")}</span>
                        </div>
                      </td>
                      <td className="max-w-[200px] truncate py-3 pr-4 text-muted-foreground">
                        {job.prompt ?? "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            variant="secondary"
                            className={cn("w-fit capitalize", STATUS_STYLES[job.status])}
                          >
                            {job.status}
                          </Badge>
                          {isActive && <Progress value={job.progress} className="h-1 w-20" />}
                        </div>
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{job.creditsCost}</td>
                      <td className="py-3 text-muted-foreground">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
