import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VISUAL_CONFIG } from '../config/visuals';
import type { MotionInput } from '../hooks/useMotionState';

interface HeroModelProps {
  motion: MotionInput;
  paused: boolean;
}

function CarvedArcRibbon({ motion, paused }: HeroModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 1.45 - Math.PI * 0.72;
      const x = Math.sin(t) * 2.15;
      const y = Math.cos(t * 0.85) * 0.95 - 0.1;
      const z = Math.sin(t * 1.5) * 0.75;
      points.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 128, 0.16, 24, false);
  }, []);

  useFrame((state, delta) => {
    if (paused || !groupRef.current || !innerRef.current) return;
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;

    const targetRotY =
      motion.pointerX * 0.55 + motion.scroll * Math.PI * 1.1 + Math.sin(elapsed * 0.4) * 0.12;
    const targetRotX =
      motion.pointerY * 0.35 - motion.scroll * 0.45 + Math.cos(elapsed * 0.35) * 0.08;

    groupRef.current.rotation.y +=
      (targetRotY - groupRef.current.rotation.y) * (1 - Math.exp(-6 * dt));
    groupRef.current.rotation.x +=
      (targetRotX - groupRef.current.rotation.x) * (1 - Math.exp(-6 * dt));
    groupRef.current.position.y = -motion.scroll * 1.4 + Math.sin(elapsed * 0.9) * 0.08;

    const warpScale = 1 + Math.min(0.14, motion.velocity * 0.08);
    innerRef.current.scale.set(warpScale, 1 / Math.sqrt(warpScale), warpScale);
  });

  return (
    <group ref={groupRef} position={[1.15, 0.1, 0]}>
      <mesh ref={innerRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#c8b6ff"
          emissive="#5900ff"
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.1}
          transmission={0.72}
          thickness={1.4}
          ior={1.48}
          iridescence={0.85}
          iridescenceIOR={1.35}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
    </group>
  );
}

export function HeroModel({ motion, paused }: HeroModelProps) {
  if (VISUAL_CONFIG.heroGlbUrl) {
    return <CarvedArcRibbon motion={motion} paused={paused} />;
  }
  return <CarvedArcRibbon motion={motion} paused={paused} />;
}
