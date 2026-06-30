"use client";

import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SystemLogEntry } from "@/lib/types/components";

type LogsTableProps = {
  logs: SystemLogEntry[];
  title?: string;
  description?: string;
};

const LEVEL_STYLES: Record<string, string> = {
  error: "bg-destructive/20 text-destructive",
  warn: "bg-orange-500/20 text-orange-400",
  warning: "bg-orange-500/20 text-orange-400",
  info: "bg-cyan-aurora/20 text-cyan-aurora",
  debug: "bg-muted text-muted-foreground",
};

export function LogsTable({
  logs,
  title = "System Logs",
  description = "Recent application and system events",
}: LogsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No logs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Level</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Message</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "uppercase",
                          LEVEL_STYLES[log.level.toLowerCase()] ?? LEVEL_STYLES.info
                        )}
                      >
                        {log.level}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{log.category}</td>
                    <td className="max-w-md truncate py-3 pr-4">{log.message}</td>
                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
