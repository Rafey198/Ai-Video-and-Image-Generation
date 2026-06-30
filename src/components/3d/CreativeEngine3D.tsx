"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { cn } from "@/lib/utils";
import { BG_DARK, GLOW_CYAN, GLOW_VIOLET, getSizeClass } from "./constants";
import type { EngineMode, EngineSize } from "./types";
import { use3DFallback } from "./use3DFallback";
import { LowMotionFallback } from "./LowMotionFallback";

export interface CreativeEngine3DProps {
  mode?: EngineMode;
  size?: EngineSize;
  className?: string;
}

function CoreMesh({ mode }: { mode: EngineMode }) {
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Mesh>(null);
  const frameRef = useRef<Mesh>(null);

  const colors = useMemo(
    () => ({
      primary: GLOW_VIOLET,
      secondary: GLOW_CYAN,
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;

    const speed =
      mode === "ignition" ? 2.5 :
      mode === "export" ? 1.8 :
      mode === "audio-sync" ? 1.2 :
      0.4;

    groupRef.current.rotation.y = t * speed * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;

    if (innerRef.current) {
      const pulse =
        mode === "audio-sync" ? 1 + Math.sin(t * 6) * 0.15 :
        mode === "ignition" ? 1 + Math.sin(t * 8) * 0.2 :
        1 + Math.sin(t * 2) * 0.08;
      innerRef.current.scale.setScalar(pulse);
    }

    if (frameRef.current) {
      const showFrame =
        mode === "prompt-to-frame" ||
        mode === "frame-to-motion" ||
        mode === "export";
      frameRef.current.visible = showFrame;
      if (showFrame) {
        const s =
          mode === "prompt-to-frame"
            ? 0.6 + Math.sin(t * 2) * 0.1
            : mode === "frame-to-motion"
              ? 0.8 + Math.sin(t * 4 + 1) * 0.05
              : 1 + Math.sin(t * 3) * 0.12;
        frameRef.current.scale.set(s, s * 0.75, 0.08);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={innerRef}>
        <torusGeometry args={[0.9, 0.22, 12, 32]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.primary}
          emissiveIntensity={mode === "ignition" ? 1.2 : 0.6}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      <mesh ref={frameRef} position={[0, 0, 0.5]} visible={false}>
        <boxGeometry args={[1.4, 1, 0.06]} />
        <meshStandardMaterial
          color={colors.secondary}
          emissive={colors.secondary}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {mode === "audio-sync" &&
        [0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.1 + i * 0.25, 1.2 + i * 0.25, 32]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? colors.primary : colors.secondary}
              transparent
              opacity={0.25 - i * 0.05}
              side={2}
            />
          </mesh>
        ))}

      {mode === "export" &&
        [0, 1].map((i) => (
          <mesh key={`exp-${i}`} rotation={[Math.PI / 2, 0, i * 0.5]}>
            <ringGeometry args={[1.4 + i * 0.3, 1.45 + i * 0.3, 24]} />
            <meshBasicMaterial
              color={colors.secondary}
              transparent
              opacity={0.2}
              side={2}
            />
          </mesh>
        ))}
    </group>
  );
}

function EngineScene({ mode }: { mode: EngineMode }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1} color={GLOW_VIOLET} />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color={GLOW_CYAN} />
      <Float speed={mode === "idle" ? 1 : 2} rotationIntensity={0.2} floatIntensity={0.4}>
        <CoreMesh mode={mode} />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function CreativeEngine3D({
  mode = "idle",
  size = "md",
  className,
}: CreativeEngine3DProps) {
  const useFallback = use3DFallback();

  if (useFallback) {
    return (
      <LowMotionFallback
        variant="engine"
        size={size}
        className={className}
        mode={mode}
      />
    );
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
          <EngineScene mode={mode} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-neon-sm" />
    </div>
  );
}

export default CreativeEngine3D;
