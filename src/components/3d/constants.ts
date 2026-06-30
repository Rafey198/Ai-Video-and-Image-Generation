import type { EngineSize, SizeDimensions } from "./types";

export const GLOW_VIOLET = "#8B5CF6";
export const GLOW_CYAN = "#22D3EE";
export const BG_DARK = "#0a0a0f";

export const SIZE_MAP: Record<EngineSize, SizeDimensions> = {
  sm: { width: 200, height: 200 },
  md: { width: 320, height: 320 },
  lg: { width: 480, height: 480 },
};

export function getSizeClass(size: EngineSize): string {
  const map: Record<EngineSize, string> = {
    sm: "h-[200px] w-[200px]",
    md: "h-[320px] w-[320px]",
    lg: "h-[480px] w-[480px]",
  };
  return map[size];
}
