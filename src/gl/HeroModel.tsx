import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VISUAL_CONFIG } from '../config/visuals';
import type { MotionInput } from '../hooks/useMotionState';

interface HeroModelProps {
  motion: MotionInput;
  paused: boolean;
}

/**
 * Concept A — The Carved Arc (Sculptural Loop):
 * Continuous aerodynamic twisted loop evoking high-G carving lines,
 * with dark-glass/chrome finish and electric-purple inner core glow.
 */
function CarvedArcSculpture({ motion, paused }: HeroModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const { outerGeo, coreGeo } = useMemo(() => {
    const outer = new THREE.TorusKnotGeometry(1.08, 0.145, 220, 32, 2, 3);
    const core = new THREE.TorusKnotGeometry(1.08, 0.045, 160, 16, 2, 3);
    return { outerGeo: outer, coreGeo: core };
  }, []);

  useFrame((state, delta) => {
    if (paused || !groupRef.current || !outerRef.current || !coreRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const rotY = t * 0.22 + motion.pointerX * 0.65 + motion.scroll * Math.PI * 1.4;
    const rotX = 0.25 + motion.pointerY * 0.45 - motion.scroll * 0.5 + Math.sin(t * 0.4) * 0.12;
    const rotZ = -0.18 + Math.cos(t * 0.3) * 0.08;

    const smooth = 1 - Math.exp(-6.5 * dt);
    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * smooth;
    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * smooth;
    groupRef.current.rotation.z += (rotZ - groupRef.current.rotation.z) * smooth;
    groupRef.current.position.y = 0.05 - motion.scroll * 0.95 + Math.sin(t * 0.9) * 0.07;

    const pulse = 1 + Math.min(0.1, motion.velocity * 0.07);
    outerRef.current.scale.setScalar(pulse);
    coreRef.current.scale.setScalar(pulse * 1.01);
  });

  return (
    <group ref={groupRef} position={[1.35, 0.05, -0.25]}>
      {/* Outer refractive dark-chrome shell */}
      <mesh ref={outerRef} geometry={outerGeo}>
        <meshPhysicalMaterial
          color="#1b1429"
          emissive="#5900ff"
          emissiveIntensity={0.45}
          roughness={0.07}
          metalness={0.65}
          transmission={0.42}
          thickness={1.4}
          ior={1.5}
          iridescence={1}
          iridescenceIOR={1.45}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>
      {/* Luminous electric-purple inner filament */}
      <mesh ref={coreRef} geometry={coreGeo}>
        <meshBasicMaterial color="#b967ff" transparent opacity={0.85} />
      </mesh>
      {/* Local halo light to cast specular highlights on the sculpture */}
      <pointLight position={[0, 0, 1.5]} intensity={6} distance={7} color="#a855f7" />
    </group>
  );
}

export function HeroModel({ motion, paused }: HeroModelProps) {
  if (VISUAL_CONFIG.heroGlbUrl) {
    return <CarvedArcSculpture motion={motion} paused={paused} />;
  }
  return <CarvedArcSculpture motion={motion} paused={paused} />;
}
