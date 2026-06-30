"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";
import { cn } from "@/lib/utils";
import { BG_DARK, GLOW_CYAN, GLOW_VIOLET, getSizeClass } from "./constants";
import type { EngineSize } from "./types";
import { use3DFallback } from "./use3DFallback";
import { LowMotionFallback } from "./LowMotionFallback";

const RING_COUNT = 5;

export interface AudioWaveRings3DProps {
  ringCount?: number;
  size?: EngineSize;
  className?: string;
}

function WaveRings({ count }: { count: number }) {
  const refs = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const wave = 1 + Math.sin(t * 3 + i * 0.8) * 0.12;
      mesh.scale.set(wave, wave, 1);
      const mat = mesh.material as { opacity?: number };
      if (mat.opacity !== undefined) {
        mat.opacity = 0.35 + Math.sin(t * 4 + i) * 0.15;
      }
    });
  });

  return (
    <group rotation={[Math.PI / 2.2, 0, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const inner = 0.5 + i * 0.28;
        const outer = inner + 0.08;
        const color = i % 2 === 0 ? GLOW_VIOLET : GLOW_CYAN;

        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
          >
            <ringGeometry args={[inner, outer, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} side={2} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial
          color={GLOW_CYAN}
          emissive={GLOW_CYAN}
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

export function AudioWaveRings3D({
  ringCount = RING_COUNT,
  size = "md",
  className,
}: AudioWaveRings3DProps) {
  const useFallback = use3DFallback();

  if (useFallback) {
    return <LowMotionFallback variant="waves" size={size} className={className} />;
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
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: BG_DARK }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[2, 2, 3]} intensity={0.6} color={GLOW_VIOLET} />
          <WaveRings count={ringCount} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

export default AudioWaveRings3D;
