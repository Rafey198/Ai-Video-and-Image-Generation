"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditEstimator } from "@/components/studio/CreditEstimator";
import { DurationSlider } from "@/components/studio/DurationSlider";
import { ModelSelector } from "@/components/studio/ModelSelector";
import type { AiModelOption, GenerationSettings, StudioCategory } from "@/lib/types/components";

type GenerationSettingsPanelProps = {
  category: StudioCategory;
  modelSlug?: string;
  model: AiModelOption | null;
  duration: number;
  settings: GenerationSettings;
  creditBalance?: number;
  onModelChange: (slug: string, model: AiModelOption | null) => void;
  onDurationChange: (seconds: number) => void;
  onSettingsChange: (settings: GenerationSettings) => void;
  disabled?: boolean;
  showDuration?: boolean;
};

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"];
const RESOLUTIONS = ["480p", "720p", "1080p", "1440p", "4k", "512px", "768px", "1024px", "1536px"];

export function GenerationSettingsPanel({
  category,
  modelSlug,
  model,
  duration,
  settings,
  creditBalance,
  onModelChange,
  onDurationChange,
  onSettingsChange,
  disabled,
  showDuration = category !== "image",
}: GenerationSettingsPanelProps) {
  const aspectRatios =
    model?.supportedAspectRatios?.length
      ? model.supportedAspectRatios
      : ASPECT_RATIOS;

  const resolutions =
    model?.supportedResolutions?.length
      ? model.supportedResolutions
      : RESOLUTIONS;

  const update = (patch: Partial<GenerationSettings>) => {
    onSettingsChange({ ...settings, ...patch });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Generation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ModelSelector
          category={category}
          value={modelSlug}
          onChange={onModelChange}
          disabled={disabled}
        />

        {showDuration && (
          <DurationSlider
            model={model}
            value={duration}
            onChange={onDurationChange}
            disabled={disabled}
          />
        )}

        {category !== "audio" && (
          <div className="space-y-2">
            <Label>Aspect ratio</Label>
            <Select
              value={settings.aspectRatio ?? aspectRatios[0]}
              onValueChange={(v) => update({ aspectRatio: v })}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aspectRatios.map((ratio) => (
                  <SelectItem key={ratio} value={ratio}>
                    {ratio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {category !== "audio" && (
          <div className="space-y-2">
            <Label>Resolution</Label>
            <Select
              value={settings.resolution ?? resolutions[0]}
              onValueChange={(v) => update({ resolution: v })}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((res) => (
                  <SelectItem key={res} value={res}>
                    {res}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {category === "video" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>FPS</Label>
              <span className="text-sm tabular-nums">{settings.fps ?? 24}</span>
            </div>
            <Slider
              value={[settings.fps ?? 24]}
              min={12}
              max={60}
              step={1}
              disabled={disabled}
              onValueChange={([fps]) => update({ fps })}
            />
          </div>
        )}

        {category === "image" && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Batch size</Label>
              <span className="text-sm tabular-nums">{settings.batchSize ?? 1}</span>
            </div>
            <Slider
              value={[settings.batchSize ?? 1]}
              min={1}
              max={4}
              step={1}
              disabled={disabled}
              onValueChange={([batchSize]) => update({ batchSize })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="seed">Seed (optional)</Label>
          <Input
            id="seed"
            type="number"
            min={0}
            placeholder="Random"
            value={settings.seed ?? ""}
            onChange={(e) =>
              update({
                seed: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            disabled={disabled}
          />
        </div>

        <CreditEstimator
          model={model}
          durationSeconds={showDuration ? duration : 0}
          resolution={settings.resolution}
          batchSize={settings.batchSize}
          balance={creditBalance}
        />
      </CardContent>
    </Card>
  );
}
