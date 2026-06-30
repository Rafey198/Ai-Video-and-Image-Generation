"use client";

import { Download, FolderPlus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ResultActionsProps = {
  onSave?: () => void;
  onRemix?: () => void;
  onDownload?: () => void;
  disabled?: boolean;
  saving?: boolean;
  className?: string;
};

export function ResultActions({
  onSave,
  onRemix,
  onDownload,
  disabled,
  saving,
  className,
}: ResultActionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {onSave && (
        <Button variant="outline" onClick={onSave} disabled={disabled || saving}>
          <FolderPlus className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save to gallery"}
        </Button>
      )}
      {onRemix && (
        <Button variant="secondary" onClick={onRemix} disabled={disabled}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Remix
        </Button>
      )}
      {onDownload && (
        <Button variant="gradient" onClick={onDownload} disabled={disabled}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      )}
    </div>
  );
}
