"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";

export function use3DFallback(): boolean {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  return reducedMotion || isMobile;
}
