"use client";

import dynamic from "next/dynamic";
import { createElement, type ComponentType } from "react";

import type { CreativeEngine3DProps } from "./CreativeEngine3D";
import type { ModelOrbit3DProps } from "./ModelOrbit3D";
import type { AudioWaveRings3DProps } from "./AudioWaveRings3D";
import type { MotionTimeline3DProps } from "./MotionTimeline3D";
import type { FloatingMediaCards3DProps } from "./FloatingMediaCards3D";

function createDynamic3D<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
) {
  return dynamic(loader, {
    ssr: false,
    loading: () =>
      createElement(
        "div",
        {
          className:
            "flex h-full min-h-[200px] w-full items-center justify-center rounded-2xl border border-white/5 bg-[#0a0a0f]",
        },
        createElement("div", {
          className:
            "h-8 w-8 animate-spin rounded-full border-2 border-violet-glow/30 border-t-cyan-aurora",
        }),
      ),
  });
}

export const CreativeEngine3DDynamic = createDynamic3D<CreativeEngine3DProps>(
  () => import("./CreativeEngine3D"),
);

export const ModelOrbit3DDynamic = createDynamic3D<ModelOrbit3DProps>(
  () => import("./ModelOrbit3D"),
);

export const AudioWaveRings3DDynamic = createDynamic3D<AudioWaveRings3DProps>(
  () => import("./AudioWaveRings3D"),
);

export const MotionTimeline3DDynamic = createDynamic3D<MotionTimeline3DProps>(
  () => import("./MotionTimeline3D"),
);

export const FloatingMediaCards3DDynamic = createDynamic3D<FloatingMediaCards3DProps>(
  () => import("./FloatingMediaCards3D"),
);
