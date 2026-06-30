"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PromptEditorProps = {
  prompt: string;
  negativePrompt?: string;
  onPromptChange: (value: string) => void;
  onNegativePromptChange?: (value: string) => void;
  showNegative?: boolean;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
};

export function PromptEditor({
  prompt,
  negativePrompt = "",
  onPromptChange,
  onNegativePromptChange,
  showNegative = true,
  maxLength = 4000,
  className,
  disabled,
}: PromptEditorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="prompt">Prompt</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {prompt.length}/{maxLength}
          </span>
        </div>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value.slice(0, maxLength))}
          placeholder="Describe what you want to create..."
          rows={5}
          disabled={disabled}
          className="resize-none border-border/60 bg-background/50"
        />
      </div>

      {showNegative && onNegativePromptChange && (
        <div className="space-y-2">
          <Label htmlFor="negative-prompt">Negative prompt</Label>
          <Textarea
            id="negative-prompt"
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value.slice(0, 2000))}
            placeholder="What to avoid in the output..."
            rows={2}
            disabled={disabled}
            className="resize-none border-border/60 bg-background/50"
          />
        </div>
      )}
    </div>
  );
}
