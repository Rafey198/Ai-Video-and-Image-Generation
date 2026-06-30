"use client";

import { ImageIcon, Music, Video } from "lucide-react";

import { AudioPlayer } from "@/components/media/AudioPlayer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/lib/types/components";

type MediaPreviewProps = {
  item?: MediaItem | null;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
};

export function MediaPreview({
  item,
  loading,
  emptyMessage = "Your generated media will appear here",
  className,
}: MediaPreviewProps) {
  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-0">
          <Skeleton className="aspect-video w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!item) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="flex aspect-video flex-col items-center justify-center gap-3 text-muted-foreground">
          <ImageIcon className="h-12 w-12 opacity-40" />
          <p className="text-sm">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {item.type === "video" && (
          <VideoPlayer
            src={item.url}
            poster={item.thumbnailUrl ?? undefined}
            className="aspect-video w-full"
          />
        )}
        {item.type === "audio" && (
          <div className="p-4">
            <AudioPlayer src={item.url} title={item.title ?? undefined} />
          </div>
        )}
        {item.type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.title ?? "Generated image"}
            className="aspect-video w-full object-contain bg-black/20"
          />
        )}
        {item.type === "other" && (
          <div className="flex aspect-video items-center justify-center">
            {item.url.includes("video") ? (
              <Video className="h-12 w-12 text-muted-foreground" />
            ) : item.url.includes("audio") ? (
              <Music className="h-12 w-12 text-muted-foreground" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
