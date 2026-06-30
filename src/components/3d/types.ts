export type EngineMode =
  | "idle"
  | "ignition"
  | "prompt-to-frame"
  | "frame-to-motion"
  | "audio-sync"
  | "export";

export type EngineSize = "sm" | "md" | "lg";

export type FallbackVariant =
  | "engine"
  | "orbit"
  | "waves"
  | "timeline"
  | "cards";

export interface SizeDimensions {
  width: number;
  height: number;
}
