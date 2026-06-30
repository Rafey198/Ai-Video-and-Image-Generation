"use client";

import { useEffect, useState } from "react";

import { ModelRegistryTable } from "@/components/admin/ModelRegistryTable";
import type { AdminModel } from "@/lib/types/components";

export default function AdminModelsPage() {
  const [models, setModels] = useState<AdminModel[]>([]);
  const [loading, setLoading] = useState(true);

  function loadModels() {
    fetch("/api/admin/models")
      .then((r) => r.json())
      .then((data) => setModels(data.models ?? data ?? []))
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Model Registry</h1>
        <p className="text-muted-foreground">Configure AI models and their availability</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading models...</p>
      ) : (
        <ModelRegistryTable
          models={models}
          onToggleEnabled={(id, enabled) => {
            fetch(`/api/admin/models/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ enabled }),
            }).then(() => loadModels());
          }}
        />
      )}
    </div>
  );
}
