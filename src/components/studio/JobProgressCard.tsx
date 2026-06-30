"use client";

import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { ActiveJob } from "@/lib/types/components";

type JobProgressCardProps = {
  job: ActiveJob | null;
  onCancel?: () => void;
};

const STATUS_CONFIG = {
  queued: { icon: Clock, label: "Queued", color: "text-muted-foreground" },
  processing: { icon: Loader2, label: "Processing", color: "text-cyan-aurora" },
  completed: { icon: CheckCircle2, label: "Completed", color: "text-emerald-400" },
  failed: { icon: XCircle, label: "Failed", color: "text-destructive" },
  canceled: { icon: AlertCircle, label: "Canceled", color: "text-muted-foreground" },
};

export function JobProgressCard({ job, onCancel }: JobProgressCardProps) {
  if (!job) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No active generation
        </CardContent>
      </Card>
    );
  }

  const config = STATUS_CONFIG[job.status];
  const Icon = config.icon;
  const isActive = job.status === "queued" || job.status === "processing";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Generation Progress</CardTitle>
        <Badge variant="secondary" className={cn("capitalize", config.color)}>
          <Icon className={cn("mr-1 h-3 w-3", job.status === "processing" && "animate-spin")} />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {job.prompt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{job.prompt}</p>
        )}

        {isActive && (
          <>
            <Progress value={job.progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{job.progress}% complete</span>
              {job.estimatedSeconds != null && (
                <span>~{job.estimatedSeconds}s remaining</span>
              )}
            </div>
          </>
        )}

        {job.status === "failed" && job.errorMessage && (
          <p className="text-sm text-destructive">{job.errorMessage}</p>
        )}

        {isActive && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Cancel generation
          </button>
        )}
      </CardContent>
    </Card>
  );
}
