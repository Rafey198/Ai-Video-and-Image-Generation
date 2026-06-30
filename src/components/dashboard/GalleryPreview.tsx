"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaCard } from "@/components/media/MediaCard";
import type { MediaItem } from "@/lib/types/components";

type GalleryPreviewProps = {
  items: MediaItem[];
  viewAllHref?: string;
  onItemClick?: (item: MediaItem) => void;
};

export function GalleryPreview({
  items,
  viewAllHref = "/gallery",
  onItemClick,
}: GalleryPreviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Media</CardTitle>
          <CardDescription>Latest creations from your gallery</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>
            Open gallery
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No media yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.slice(0, 8).map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                compact
                onClick={() => onItemClick?.(item)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
