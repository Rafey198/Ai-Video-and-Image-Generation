"use client";

import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type GalleryFilterState = {
  query: string;
  type: "all" | "image" | "video" | "audio";
  sort: "newest" | "oldest" | "name";
};

type GalleryFiltersProps = {
  filters: GalleryFilterState;
  onChange: (filters: GalleryFilterState) => void;
  className?: string;
};

export function GalleryFilters({ filters, onChange, className }: GalleryFiltersProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search media..."
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          className="border-border/60 bg-background/50 pl-9"
        />
      </div>

      <Select
        value={filters.type}
        onValueChange={(type) =>
          onChange({ ...filters, type: type as GalleryFilterState["type"] })
        }
      >
        <SelectTrigger className="w-[140px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(sort) =>
          onChange({ ...filters, sort: sort as GalleryFilterState["sort"] })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="name">Name</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          onChange({ query: "", type: "all", sort: "newest" })
        }
      >
        Reset
      </Button>
    </div>
  );
}
