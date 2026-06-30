"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileIcon } from "lucide-react";

import { UploadDropzone } from "@/components/studio/UploadDropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFileSize } from "@/lib/utils";

type UploadItem = {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  url: string;
  createdAt: string;
};

export default function UploadsPage() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [loading, setLoading] = useState(true);

  function loadUploads() {
    fetch("/api/uploads")
      .then((r) => r.json())
      .then((data) => setUploads(data.uploads ?? data ?? []))
      .catch(() => setUploads([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUploads();
  }, []);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/api/uploads", { method: "POST", body: formData });
    loadUploads();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Uploads</h1>
        <p className="text-muted-foreground">Upload reference images, video, and audio for your projects</p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Upload media</CardTitle>
          <CardDescription>Drag and drop or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <UploadDropzone accept="any" onFileSelect={handleUpload} />
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle>Your uploads</CardTitle>
          <CardDescription>{uploads.length} files</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading uploads...</p>
          ) : uploads.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No uploads yet</p>
          ) : (
            <div className="divide-y divide-border/40">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center gap-4 py-3">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{upload.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(upload.fileSize)} · {upload.mimeType}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(upload.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
