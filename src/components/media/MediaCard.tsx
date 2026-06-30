"use client";

import Image from "next/image";
import { Music, Play, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn, formatDuration } from "@/lib/utils";
import type { MediaItem } from "@/lib/types/components";

type MediaCardProps = {
  item: MediaItem;
  compact?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function MediaCard({ item, compact, selected, onClick, className }: MediaCardProps) {
  const previewUrl = item.thumbnailUrl ?? item.url;
  const isVideo = item.type === "video";
  const isAudio = item.type === "audio";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/60 bg-card text-left transition-all hover:border-violet-glow/40 hover:shadow-neon-sm",
        selected && "ring-2 ring-primary",
        compact ? "aspect-square" : "aspect-[4/3]",
        className
      )}
    >
      {isAudio ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-glow/20 to-cyan-aurora/10">
          <Music className="h-10 w-10 text-violet-electric opacity-80" />
        </div>
      ) : (
        <Image
          src={previewUrl}
          alt={item.title ?? "Media"}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes={compact ? "160px" : "320px"}
          unoptimized
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="absolute left-2 top-2">
        <Badge variant="secondary" className="bg-black/50 text-xs capitalize backdrop-blur-sm">
          {isVideo ? <Video className="mr-1 h-3 w-3" /> : isAudio ? <Music className="mr-1 h-3 w-3" /> : null}
          {item.type}
        </Badge>
      </div>

      {(isVideo || isAudio) && item.duration != null && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white backdrop-blur-sm">
          {isVideo && <Play className="h-3 w-3" />}
          {formatDuration(item.duration)}
        </div>
      )}

      {item.title && (
        <div className="absolute bottom-0 left-0 right-0 truncate p-2 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {item.title}
        </div>
      )}
    </button>
  );
}
