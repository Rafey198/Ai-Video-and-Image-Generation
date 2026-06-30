"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import { cn } from "@/lib/utils";
import { BG_DARK, GLOW_CYAN, GLOW_VIOLET, getSizeClass } from "./constants";
import type { EngineSize } from "./types";
import { use3DFallback } from "./use3DFallback";
import { LowMotionFallback } from "./LowMotionFallback";

const KEYFRAME_COUNT = 8;

export interface MotionTimeline3DProps {
  keyframeCount?: number;
  size?: EngineSize;
  className?: string;
}

function TimelineTrack({ count }: { count: number }) {
  const playheadRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (playheadRef.current) {
      const progress = (Math.sin(t * 0.8) + 1) / 2;
      playheadRef.current.position.x = -2.4 + progress * 4.8;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[5.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#1a1a2e" emissive={GLOW_VIOLET} emissiveIntensity={0.2} />
      </mesh>

      {Array.from({ length: count }, (_, i) => {
        const x = -2.4 + (i / Math.max(count - 1, 1)) * 4.8;
        const height = 0.3 + (i % 3) * 0.15;
        const color = i % 2 === 0 ? GLOW_VIOLET : GLOW_CYAN;

        return (
          <mesh key={i} position={[x, -0.6 + height / 2, 0]}>
            <boxGeometry args={[0.12, height, 0.12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}

      <group ref={playheadRef} position={[-2.4, 0.2, 0]}>
        <mesh>
          <coneGeometry args={[0.1, 0.2, 4]} />
          <meshStandardMaterial
            color={GLOW_CYAN}
            emissive={GLOW_CYAN}
            emissiveIntensity={1}
          />
        </mesh>
      </group>
    </group>
  );
}

export function MotionTimeline3D({
  keyframeCount = KEYFRAME_COUNT,
  size = "lg",
  className,
}: MotionTimeline3DProps) {
  const useFallback = use3DFallback();

  if (useFallback) {
    return <LowMotionFallback variant="timeline" size={size} className={className} />;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5",
        getSizeClass(size),
        className,
      )}
    >
      <Canvas
        camera={{ position: [0, 1, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: BG_DARK }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <pointLight position={[2, 3, 4]} intensity={0.7} color={GLOW_VIOLET} />
          <pointLight position={[-2, 1, 2]} intensity={0.4} color={GLOW_CYAN} />
          <TimelineTrack count={keyframeCount} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

export default MotionTimeline3D;
