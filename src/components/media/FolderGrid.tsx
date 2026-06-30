"use client";

import { Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MediaFolder } from "@/lib/types/components";

type FolderGridProps = {
  folders: MediaFolder[];
  selectedId?: string | null;
  onSelect?: (folder: MediaFolder) => void;
  className?: string;
};

export function FolderGrid({ folders, selectedId, onSelect, className }: FolderGridProps) {
  if (folders.length === 0) {
    return (
      <p className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        No folders yet
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6", className)}>
      {folders.map((folder) => {
        const selected = selectedId === folder.id;
        const Icon = selected ? FolderOpen : Folder;

        return (
          <button
            key={folder.id}
            type="button"
            onClick={() => onSelect?.(folder)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border border-border/60 bg-card p-4 transition-all hover:border-violet-glow/40 hover:shadow-neon-sm",
              selected && "border-primary ring-1 ring-primary"
            )}
          >
            <Icon className="h-8 w-8 text-violet-electric" />
            <span className="w-full truncate text-center text-sm font-medium">{folder.name}</span>
            {folder.assetCount != null && (
              <span className="text-xs text-muted-foreground">{folder.assetCount} items</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
