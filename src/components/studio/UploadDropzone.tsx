"use client";

import { useCallback, useState } from "react";
import { FileUp, Image, Music, Upload, Video, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FILE_LIMITS } from "@/config/site";
import { cn, formatFileSize } from "@/lib/utils";

type AcceptedType = "image" | "video" | "audio" | "any";

type UploadDropzoneProps = {
  accept?: AcceptedType;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  previewUrl?: string | null;
  fileName?: string | null;
  disabled?: boolean;
  className?: string;
};

const ACCEPT_MAP: Record<AcceptedType, string[]> = {
  image: FILE_LIMITS.allowedImageTypes,
  video: FILE_LIMITS.allowedVideoTypes,
  audio: FILE_LIMITS.allowedAudioTypes,
  any: [
    ...FILE_LIMITS.allowedImageTypes,
    ...FILE_LIMITS.allowedVideoTypes,
    ...FILE_LIMITS.allowedAudioTypes,
  ],
};

const TYPE_ICONS: Record<AcceptedType, typeof Upload> = {
  image: Image,
  video: Video,
  audio: Music,
  any: FileUp,
};

export function UploadDropzone({
  accept = "any",
  onFileSelect,
  onClear,
  previewUrl,
  fileName,
  disabled,
  className,
}: UploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const Icon = TYPE_ICONS[accept];

  const validateAndSelect = useCallback(
    (file: File) => {
      const allowed = ACCEPT_MAP[accept];
      if (!allowed.includes(file.type)) return;

      const maxSize =
        accept === "image"
          ? FILE_LIMITS.maxImageSize
          : accept === "video"
            ? FILE_LIMITS.maxVideoSize
            : accept === "audio"
              ? FILE_LIMITS.maxAudioSize
              : Math.max(
                  FILE_LIMITS.maxImageSize,
                  FILE_LIMITS.maxVideoSize,
                  FILE_LIMITS.maxAudioSize
                );

      if (file.size > maxSize) return;
      onFileSelect(file);
    },
    [accept, onFileSelect]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  };

  if (previewUrl || fileName) {
    return (
      <div className={cn("relative overflow-hidden rounded-lg border border-border/60", className)}>
        {previewUrl && accept !== "audio" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Upload preview" className="h-40 w-full object-cover" />
        )}
        <div className="flex items-center justify-between bg-card/80 p-3">
          <span className="truncate text-sm">{fileName}</span>
          {onClear && (
            <Button variant="ghost" size="icon" onClick={onClear} disabled={disabled}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border/60 bg-background/30 p-8 transition-colors",
        dragOver && "border-violet-glow/50 bg-violet-glow/5",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="sr-only"
        accept={ACCEPT_MAP[accept].join(",")}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndSelect(file);
        }}
      />
      <div className="rounded-full bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-violet-electric" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          Drop file here or <span className="text-primary">browse</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Max {formatFileSize(
            accept === "image"
              ? FILE_LIMITS.maxImageSize
              : accept === "video"
                ? FILE_LIMITS.maxVideoSize
                : accept === "audio"
                  ? FILE_LIMITS.maxAudioSize
                  : FILE_LIMITS.maxVideoSize
          )}
        </p>
      </div>
    </label>
  );
}
