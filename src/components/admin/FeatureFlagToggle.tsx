"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { FeatureFlag } from "@/lib/types/components";

type FeatureFlagToggleProps = {
  flag: FeatureFlag;
  onToggle: (key: string, enabled: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function FeatureFlagToggle({
  flag,
  onToggle,
  disabled,
  className,
}: FeatureFlagToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-border/60 bg-card p-4",
        className
      )}
    >
      <div className="space-y-1 pr-4">
        <Label htmlFor={`flag-${flag.key}`} className="text-sm font-medium">
          {flag.name}
        </Label>
        <p className="text-xs text-muted-foreground">
          {flag.description ?? flag.key}
        </p>
      </div>
      <Switch
        id={`flag-${flag.key}`}
        checked={flag.enabled}
        disabled={disabled}
        onCheckedChange={(checked) => onToggle(flag.key, checked)}
      />
    </div>
  );
}
