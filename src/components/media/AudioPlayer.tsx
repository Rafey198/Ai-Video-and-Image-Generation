"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn, formatDuration } from "@/lib/utils";
import { WaveformPreview } from "@/components/media/WaveformPreview";

type AudioPlayerProps = {
  src: string;
  title?: string;
  className?: string;
};

export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (value[0] / 100) * duration;
    setProgress(value[0]);
  };

  return (
    <div className={cn("rounded-lg border border-border/60 bg-card p-4", className)}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(duration ? (a.currentTime / duration) * 100 : 0);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />

      {title && <p className="mb-3 text-sm font-medium">{title}</p>}

      <WaveformPreview active={playing} className="mb-4" />

      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={togglePlay}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Slider value={[progress]} max={100} step={0.1} onValueChange={handleSeek} className="flex-1" />
        <Button variant="ghost" size="icon" onClick={toggleMute}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDuration((progress / 100) * duration)} / {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
}
