"use client";

import { cn } from "@/lib/utils";

type WaveformPreviewProps = {
  bars?: number;
  active?: boolean;
  className?: string;
};

export function WaveformPreview({ bars = 48, active = false, className }: WaveformPreviewProps) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const base = Math.sin(i * 0.4) * 0.3 + Math.cos(i * 0.15) * 0.2;
    return 0.25 + Math.abs(base) * 0.75;
  });

  return (
    <div className={cn("flex h-12 items-end gap-[2px]", className)} aria-hidden>
      {heights.map((h, i) => (
        <div
          key={i}
          className={cn(
            "w-full min-w-[2px] rounded-full bg-gradient-to-t from-violet-glow/60 to-cyan-aurora/80 transition-all",
            active && "animate-pulse"
          )}
          style={{
            height: `${h * 100}%`,
            animationDelay: active ? `${i * 30}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}
