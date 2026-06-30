"use client";

import { useEffect, useMemo, useState } from "react";

import { FloatingMediaCards3DDynamic } from "@/components/3d/dynamic";
import { GalleryFilters, type GalleryFilterState } from "@/components/media/GalleryFilters";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaPreviewModal } from "@/components/media/MediaPreviewModal";
import type { MediaItem } from "@/lib/types/components";

export default function GalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [filters, setFilters] = useState<GalleryFilterState>({
    query: "",
    type: "all",
    sort: "newest",
  });

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? data ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...items];
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((i) => i.title?.toLowerCase().includes(q));
    }
    if (filters.type !== "all") {
      result = result.filter((i) => i.type === filters.type);
    }
    result.sort((a, b) => {
      const aDate = new Date(a.createdAt ?? 0).getTime();
      const bDate = new Date(b.createdAt ?? 0).getTime();
      return filters.sort === "newest" ? bDate - aDate : aDate - bDate;
    });
    return result;
  }, [items, filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
        <p className="text-muted-foreground">Browse and manage your generated media</p>
      </div>

      <div className="h-48 overflow-hidden rounded-2xl border border-border/60">
        <FloatingMediaCards3DDynamic size="sm" className="h-full w-full" />
      </div>

      <GalleryFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Loading gallery...</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No media found</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
        </div>
      )}

      <MediaPreviewModal item={selected} open={!!selected} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  );
}
