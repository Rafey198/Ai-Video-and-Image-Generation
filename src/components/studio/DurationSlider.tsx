"use client";

import { useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { AiModelOption } from "@/lib/types/components";

type DurationSliderProps = {
  model: AiModelOption | null;
  value: number;
  onChange: (seconds: number) => void;
  disabled?: boolean;
  className?: string;
};

export function DurationSlider({
  model,
  value,
  onChange,
  disabled,
  className,
}: DurationSliderProps) {
  const min = model?.minDuration ?? 1;
  const max = model?.maxDuration ?? 60;
  const fixed = model?.fixedDuration;
  const isFixed = fixed != null;

  useEffect(() => {
    if (isFixed) {
      if (fixed !== value) onChange(fixed);
      return;
    }
    if (value < min) onChange(min);
    else if (value > max) onChange(max);
    // Clamp when model bounds change, not on every keystroke from parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.id, min, max, fixed, isFixed]);

  if (!model) return null;

  if (isFixed) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>Duration</Label>
        <p className="text-sm text-muted-foreground">
          Fixed at <span className="font-medium text-foreground">{fixed}s</span> for this model
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>Duration</Label>
        <span className="text-sm font-medium tabular-nums">{value}s</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        disabled={disabled}
        onValueChange={([v]) => onChange(v)}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}s</span>
        <span>{max}s</span>
      </div>
    </div>
  );
}
