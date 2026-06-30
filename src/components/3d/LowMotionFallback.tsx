"use client";

import { cn } from "@/lib/utils";
import type { EngineSize, FallbackVariant } from "./types";
import { getSizeClass } from "./constants";

export interface LowMotionFallbackProps {
  variant: FallbackVariant;
  size?: EngineSize;
  className?: string;
  mode?: string;
}

const variantStyles: Record<FallbackVariant, string> = {
  engine: "bg-gradient-radial from-violet-glow/20 via-transparent to-cyan-aurora/10",
  orbit: "bg-gradient-radial from-cyan-aurora/15 via-transparent to-violet-glow/10",
  waves: "bg-gradient-radial from-violet-glow/25 via-cyan-aurora/5 to-transparent",
  timeline: "bg-gradient-to-r from-violet-glow/10 via-cyan-aurora/15 to-violet-glow/10",
  cards: "bg-gradient-radial from-violet-glow/15 via-transparent to-cyan-aurora/15",
};

export function LowMotionFallback({
  variant,
  size = "md",
  className,
  mode,
}: LowMotionFallbackProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0a0f]",
        getSizeClass(size),
        className,
      )}
      role="img"
      aria-label={mode ? `Creative engine ${mode} preview` : `${variant} animation preview`}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-80",
          variantStyles[variant],
        )}
      />

      {variant === "engine" && <EngineFallback mode={mode} />}
      {variant === "orbit" && <OrbitFallback />}
      {variant === "waves" && <WavesFallback />}
      {variant === "timeline" && <TimelineFallback />}
      {variant === "cards" && <CardsFallback />}

      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

function EngineFallback({ mode }: { mode?: string }) {
  const isActive = mode === "ignition" || mode === "export";
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={cn(
          "h-16 w-16 rounded-full border-2 border-violet-glow/60",
          isActive ? "motion-reduce:animate-none animate-pulse-glow" : "motion-reduce:animate-none animate-spin-slow",
        )}
        style={{
          boxShadow: "0 0 30px rgba(139, 92, 246, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.2)",
        }}
      />
      <div className="absolute h-8 w-8 rounded-md border border-cyan-aurora/50 bg-cyan-aurora/10 motion-reduce:animate-none animate-float" />
    </div>
  );
}

function OrbitFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-24 w-24 motion-reduce:animate-none animate-spin-slow">
        {[0, 120, 240].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 h-6 w-10 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-violet-glow/40 bg-violet-glow/20 shadow-neon-sm"
            style={{ transform: `rotate(${deg}deg) translateY(-36px)` }}
          />
        ))}
      </div>
      <div className="absolute h-4 w-4 rounded-full bg-cyan-aurora/80 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
    </div>
  );
}

function WavesFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-cyan-aurora/30 animate-pulse-glow"
          style={{
            width: `${60 + i * 40}px`,
            height: `${60 + i * 40}px`,
            animationDelay: `${i * 0.4}s`,
            opacity: 0.6 - i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function TimelineFallback() {
  return (
    <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 items-center gap-2">
      <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-violet-glow/50 to-cyan-aurora/50" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "h-3 w-3 shrink-0 rounded-sm border border-white/20",
            i % 2 === 0 ? "bg-violet-glow/40" : "bg-cyan-aurora/40",
            i === 2 && "animate-pulse-glow h-4 w-4",
          )}
        />
      ))}
      <div className="h-0.5 flex-1 bg-gradient-to-r from-cyan-aurora/50 via-violet-glow/50 to-transparent" />
    </div>
  );
}

function CardsFallback() {
  const offsets = [
    { x: -24, y: -12, rotate: -8 },
    { x: 0, y: 0, rotate: 0 },
    { x: 24, y: 12, rotate: 8 },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {offsets.map((o, i) => (
        <div
          key={i}
          className="absolute h-20 w-14 rounded-lg border border-white/10 bg-white/5 shadow-glass animate-float"
          style={{
            transform: `translate(${o.x}px, ${o.y}px) rotate(${o.rotate}deg)`,
            animationDelay: `${i * 0.8}s`,
            boxShadow: i === 1
              ? "0 0 20px rgba(139, 92, 246, 0.3)"
              : "0 4px 16px rgba(0,0,0,0.3)",
          }}
        />
      ))}
    </div>
  );
}
