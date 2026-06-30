import { formatDistanceToNow } from "date-fns";
import { Image as ImageIcon, Music, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { safeDbQuery } from "@/lib/db/safe-query";
import { cn, formatCredits } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  queued: "bg-muted text-muted-foreground",
  processing: "bg-cyan-aurora/20 text-cyan-aurora",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-destructive/20 text-destructive",
  canceled: "bg-muted text-muted-foreground",
};

function TypeIcon({ type }: { type: string }) {
  if (type.includes("video")) return <Video className="h-4 w-4" />;
  if (type.includes("audio")) return <Music className="h-4 w-4" />;
  return <ImageIcon className="h-4 w-4" aria-hidden="true" />;
}

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) return null;

  const jobs = await safeDbQuery(
    () =>
      prisma.generationJob.findMany({
        where: { userId: session.user.id },
        include: { model: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Generation History</h1>
        <p className="text-muted-foreground">All your past and in-progress generations</p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>{jobs.length} generations</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No generation history yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Type</th>
                    <th className="pb-3 pr-4 font-medium">Prompt</th>
                    <th className="pb-3 pr-4 font-medium">Model</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Credits</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 pr-4">
                        <TypeIcon type={job.type} />
                      </td>
                      <td className="max-w-xs truncate py-3 pr-4">{job.prompt ?? "—"}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{job.model.name}</td>
                      <td className="py-3 pr-4">
                        <Badge className={cn("capitalize", STATUS_STYLES[job.status])}>
                          {job.status}
                        </Badge>
                        {(job.status === "processing" || job.status === "queued") && (
                          <Progress value={job.progress} className="mt-1 h-1 w-20" />
                        )}
                      </td>
                      <td className="py-3 pr-4 tabular-nums">{formatCredits(job.creditsCost)}</td>
                      <td className="py-3 text-muted-foreground">
                        {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
