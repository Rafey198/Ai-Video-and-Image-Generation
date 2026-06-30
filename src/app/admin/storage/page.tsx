"use client";

import { HardDrive, Image, Music, Video } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";

const STORAGE_STATS = [
  { label: "Images", icon: Image, used: 12.4 * 1024 * 1024 * 1024, total: 50 * 1024 * 1024 * 1024, count: 8420 },
  { label: "Videos", icon: Video, used: 89.2 * 1024 * 1024 * 1024, total: 200 * 1024 * 1024 * 1024, count: 1240 },
  { label: "Audio", icon: Music, used: 3.1 * 1024 * 1024 * 1024, total: 20 * 1024 * 1024 * 1024, count: 3200 },
];

export default function AdminStoragePage() {
  const totalUsed = STORAGE_STATS.reduce((s, st) => s + st.used, 0);
  const totalCapacity = STORAGE_STATS.reduce((s, st) => s + st.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Storage</h1>
        <p className="text-muted-foreground">Monitor media storage usage across the platform</p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Total storage
          </CardTitle>
          <CardDescription>
            {formatFileSize(totalUsed)} of {formatFileSize(totalCapacity)} used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(totalUsed / totalCapacity) * 100} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {STORAGE_STATS.map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                {stat.label}
              </CardTitle>
              <CardDescription>{stat.count.toLocaleString()} files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm tabular-nums">
                {formatFileSize(stat.used)} / {formatFileSize(stat.total)}
              </p>
              <Progress value={(stat.used / stat.total) * 100} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
