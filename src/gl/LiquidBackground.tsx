import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { LIQUID_FRAGMENT_SHADER, LIQUID_VERTEX_SHADER } from './shaders/liquidMesh';
import { VISUAL_CONFIG } from '../config/visuals';
import type { MotionInput } from '../hooks/useMotionState';

interface LiquidBackgroundProps {
  motion: MotionInput;
  paused: boolean;
}

export function LiquidBackground({ motion, paused }: LiquidBackgroundProps) {
  const { size, gl } = useThree();
  const grainAccumRef = useRef(0);
  const grainStepRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGrainTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: 0 },
      uGrainIntensity: { value: VISUAL_CONFIG.grainIntensity },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);
  }, [size.width, size.height, gl, uniforms]);

  useFrame((_, delta) => {
    if (paused) return;
    const dt = Math.min(delta, 0.05);
    uniforms.uTime.value += dt;
    uniforms.uScroll.value = motion.scroll;
    uniforms.uPointer.value.set(motion.pointerX, motion.pointerY);
    uniforms.uVelocity.value = motion.velocity;

    const grainInterval = 1 / VISUAL_CONFIG.grainFps;
    grainAccumRef.current += dt;
    if (grainAccumRef.current >= grainInterval) {
      grainAccumRef.current %= grainInterval;
      grainStepRef.current += 1;
      uniforms.uGrainTime.value = grainStepRef.current;
    }
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={LIQUID_VERTEX_SHADER}
        fragmentShader={LIQUID_FRAGMENT_SHADER}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
