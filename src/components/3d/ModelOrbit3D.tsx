"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import type { Group } from "three";
import { cn } from "@/lib/utils";
import { BG_DARK, GLOW_CYAN, GLOW_VIOLET, getSizeClass } from "./constants";
import type { EngineSize } from "./types";
import { use3DFallback } from "./use3DFallback";
import { LowMotionFallback } from "./LowMotionFallback";

const MODEL_CHIPS = ["Veo", "Sora", "Runway", "Pika", "Luma", "Kling"];

export interface ModelOrbit3DProps {
  models?: string[];
  size?: EngineSize;
  className?: string;
}

function OrbitChips({ labels }: { labels: string[] }) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {labels.map((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2;
        const radius = 1.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const color = i % 2 === 0 ? GLOW_VIOLET : GLOW_CYAN;

        return (
          <group key={label} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[0.9, 0.45, 0.08]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.14}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {label}
            </Text>
          </group>
        );
      })}

      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={GLOW_CYAN}
          emissive={GLOW_CYAN}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

export function ModelOrbit3D({
  models = MODEL_CHIPS,
  size = "md",
  className,
}: ModelOrbit3DProps) {
  const useFallback = use3DFallback();

  if (useFallback) {
    return <LowMotionFallback variant="orbit" size={size} className={className} />;
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
        camera={{ position: [0, 2.5, 5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: BG_DARK }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <pointLight position={[3, 3, 3]} intensity={0.8} color={GLOW_VIOLET} />
          <pointLight position={[-2, 1, 2]} intensity={0.5} color={GLOW_CYAN} />
          <OrbitChips labels={models} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

export default ModelOrbit3D;
