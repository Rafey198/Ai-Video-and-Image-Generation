"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AdminModel } from "@/lib/types/components";

type ModelRegistryTableProps = {
  models: AdminModel[];
  onToggleEnabled?: (id: string, enabled: boolean) => void;
  onEdit?: (model: AdminModel) => void;
};

export function ModelRegistryTable({
  models,
  onToggleEnabled,
  onEdit,
}: ModelRegistryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Registry</CardTitle>
        <CardDescription>Manage AI models and their availability</CardDescription>
      </CardHeader>
      <CardContent>
        {models.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No models registered</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 pr-4 font-medium">Provider</th>
                  <th className="pb-3 pr-4 font-medium">Credits</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-b border-border/40 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        {model.featured && (
                          <Badge variant="secondary" className="text-[10px]">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{model.slug}</span>
                    </td>
                    <td className="py-3 pr-4 capitalize">{model.category}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {model.providerName ?? "—"}
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {model.creditCostBase}
                      {model.creditCostPerSecond > 0 && ` +${model.creditCostPerSecond}/s`}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={model.enabled}
                          onCheckedChange={(checked) => onToggleEnabled?.(model.id, checked)}
                        />
                        <span
                          className={cn(
                            "text-xs",
                            model.enabled ? "text-emerald-400" : "text-muted-foreground"
                          )}
                        >
                          {model.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(model)}>
                          Edit
                        </Button>
                      )}
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
