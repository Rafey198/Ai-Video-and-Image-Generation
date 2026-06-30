"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import { cn } from "@/lib/utils";
import { BG_DARK, GLOW_CYAN, GLOW_VIOLET, getSizeClass } from "./constants";
import type { EngineSize } from "./types";
import { use3DFallback } from "./use3DFallback";
import { LowMotionFallback } from "./LowMotionFallback";

const CARD_COUNT = 5;

export interface FloatingMediaCards3DProps {
  cardCount?: number;
  size?: EngineSize;
  className?: string;
}

function MediaCards({ count }: { count: number }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 1.6;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 1.2) * 0.3;
        const color = i % 2 === 0 ? GLOW_VIOLET : GLOW_CYAN;

        return (
          <Float
            key={i}
            speed={1.5 + i * 0.2}
            rotationIntensity={0.15}
            floatIntensity={0.5}
          >
            <group position={[x, y, z]} rotation={[0, -angle, 0]}>
              <mesh>
                <boxGeometry args={[0.7, 0.95, 0.04]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.35}
                  metalness={0.2}
                  roughness={0.5}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[0.55, 0.35]} />
                <meshBasicMaterial
                  color={i % 2 === 0 ? GLOW_CYAN : GLOW_VIOLET}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

export function FloatingMediaCards3D({
  cardCount = CARD_COUNT,
  size = "lg",
  className,
}: FloatingMediaCards3DProps) {
  const useFallback = use3DFallback();

  if (useFallback) {
    return <LowMotionFallback variant="cards" size={size} className={className} />;
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
        camera={{ position: [0, 0.5, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: BG_DARK }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[3, 4, 5]} intensity={0.8} color={GLOW_VIOLET} />
          <pointLight position={[-3, -1, 3]} intensity={0.5} color={GLOW_CYAN} />
          <MediaCards count={cardCount} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

export default FloatingMediaCards3D;
