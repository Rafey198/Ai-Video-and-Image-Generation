"use client";

import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AdminJob } from "@/lib/types/components";

type JobQueueTableProps = {
  jobs: AdminJob[];
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
};

const STATUS_STYLES: Record<string, string> = {
  queued: "bg-muted text-muted-foreground",
  processing: "bg-cyan-aurora/20 text-cyan-aurora",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-destructive/20 text-destructive",
  canceled: "bg-muted text-muted-foreground",
};

export function JobQueueTable({ jobs, onCancel, onRetry }: JobQueueTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Queue</CardTitle>
        <CardDescription>Monitor and manage generation jobs</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Queue is empty</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Job ID</th>
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Type</th>
                  <th className="pb-3 pr-4 font-medium">Model</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Credits</th>
                  <th className="pb-3 pr-4 font-medium">Created</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const isActive = job.status === "queued" || job.status === "processing";

                  return (
                    <tr key={job.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs">{job.id.slice(0, 8)}…</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {job.userEmail ?? job.userId.slice(0, 8)}
                      </td>
                      <td className="py-3 pr-4 capitalize">{job.type.replace(/_/g, " ")}</td>
                      <td className="py-3 pr-4">{job.modelName ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            variant="secondary"
                            className={cn("w-fit capitalize", STATUS_STYLES[job.status])}
                          >
                            {job.status}
                          </Badge>
                          {isActive && <Progress value={job.progress} className="h-1 w-16" />}
                        </div>
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{job.creditsCost}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {isActive && onCancel && (
                            <Button variant="ghost" size="sm" onClick={() => onCancel(job.id)}>
                              Cancel
                            </Button>
                          )}
                          {job.status === "failed" && onRetry && (
                            <Button variant="outline" size="sm" onClick={() => onRetry(job.id)}>
                              Retry
                            </Button>
                          )}
                        </div>
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
