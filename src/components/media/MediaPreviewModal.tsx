"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/media/AudioPlayer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import type { MediaItem } from "@/lib/types/components";

type MediaPreviewModalProps = {
  item: MediaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MediaPreviewModal({ item, open, onOpenChange }: MediaPreviewModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border/60 bg-card">
        <DialogHeader>
          <DialogTitle>{item.title ?? `${item.type} preview`}</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          {item.type === "video" && (
            <VideoPlayer src={item.url} poster={item.thumbnailUrl ?? undefined} className="aspect-video w-full" />
          )}
          {item.type === "audio" && (
            <AudioPlayer src={item.url} title={item.title ?? undefined} />
          )}
          {item.type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.title ?? "Image preview"}
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
