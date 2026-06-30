"use client";

import { useEffect, useState } from "react";

import { JobQueueTable } from "@/components/admin/JobQueueTable";
import type { AdminJob } from "@/lib/types/components";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);

  function loadJobs() {
    fetch("/api/jobs?admin=true")
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs ?? data ?? []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Queue</h1>
        <p className="text-muted-foreground">Monitor and manage platform-wide generation jobs</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading jobs...</p>
      ) : (
        <JobQueueTable
          jobs={jobs}
          onCancel={(id) => {
            fetch(`/api/jobs/${id}`, { method: "DELETE" }).then(() => loadJobs());
          }}
          onRetry={(id) => {
            fetch(`/api/jobs/${id}/retry`, { method: "POST" }).then(() => loadJobs());
          }}
        />
      )}
    </div>
  );
}
