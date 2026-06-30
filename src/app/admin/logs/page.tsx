"use client";

import { useEffect, useState } from "react";

import { LogsTable } from "@/components/admin/LogsTable";
import type { SystemLogEntry } from "@/lib/types/components";

const MOCK_LOGS: SystemLogEntry[] = [
  { id: "1", level: "info", category: "auth", message: "User login successful", createdAt: new Date().toISOString() },
  { id: "2", level: "warn", category: "jobs", message: "Job queue backlog detected (42 pending)", createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "3", level: "error", category: "provider", message: "Fal.ai timeout after 120s", createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "4", level: "info", category: "billing", message: "Subscription renewed for user_abc123", createdAt: new Date(Date.now() - 900000).toISOString() },
  { id: "5", level: "debug", category: "api", message: "Rate limit check passed for /api/jobs", createdAt: new Date(Date.now() - 1200000).toISOString() },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLogs(MOCK_LOGS);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground">Application events, errors, and audit trail</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading logs...</p>
      ) : (
        <LogsTable logs={logs} />
      )}
    </div>
  );
}
