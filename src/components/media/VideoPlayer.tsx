"use client";

import { useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn, formatDuration } from "@/lib/utils";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
};

export function VideoPlayer({ src, poster, className, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const time = (value[0] / 100) * duration;
    video.currentTime = time;
    setProgress(value[0]);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void video.requestFullscreen();
    }
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-lg bg-black", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-full w-full object-contain"
        autoPlay={autoPlay}
        playsInline
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setProgress(duration ? (v.currentTime / duration) * 100 : 0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="mb-2"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={togglePlay}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleMute}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <span className="text-xs text-white/80 tabular-nums">
              {formatDuration((progress / 100) * duration)} / {formatDuration(duration)}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
