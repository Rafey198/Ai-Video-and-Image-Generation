"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { MediaCard } from "@/components/media/MediaCard";
import { Card, CardContent } from "@/components/ui/card";
import type { MediaItem } from "@/lib/types/components";

export default function FavoritesPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery?favorites=true")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground">Media you&apos;ve marked as favorites</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading favorites...</p>
      ) : items.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/30">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="font-medium">No favorites yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Heart media in your gallery to save it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
