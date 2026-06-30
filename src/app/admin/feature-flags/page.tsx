"use client";

import { useEffect, useState } from "react";

import { FeatureFlagToggle } from "@/components/admin/FeatureFlagToggle";
import type { FeatureFlag } from "@/lib/types/components";

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  function loadFlags() {
    fetch("/api/admin/feature-flags")
      .then((r) => r.json())
      .then((data) => setFlags(data.flags ?? data ?? []))
      .catch(() => setFlags([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadFlags();
  }, []);

  async function handleToggle(key: string, enabled: boolean) {
    const res = await fetch("/api/admin/feature-flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flags: [{ key, enabled }] }),
    });

    if (!res.ok) {
      loadFlags();
      return;
    }

    setFlags((f) => f.map((flag) => (flag.key === key ? { ...flag, enabled } : flag)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
        <p className="text-muted-foreground">Toggle platform features without deploying</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading flags...</p>
      ) : flags.length === 0 ? (
        <div className="space-y-3">
          {[
            { id: "1", key: "video_studio", name: "Video Studio", description: "Enable video generation studio", enabled: true },
            { id: "2", key: "api_access", name: "API Access", description: "Allow users to create API keys", enabled: true },
            { id: "3", key: "team_workspaces", name: "Team Workspaces", description: "Enable multi-user workspaces", enabled: false },
          ].map((flag) => (
            <FeatureFlagToggle
              key={flag.key}
              flag={flag}
              onToggle={handleToggle}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <FeatureFlagToggle key={flag.key} flag={flag} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
