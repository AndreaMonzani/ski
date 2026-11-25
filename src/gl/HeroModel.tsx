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
 * Concept A — The Carved Arc: sleek dark-obsidian refractive ribbon
 * with tapered tips and electric-purple specular edge.
 */
function CarvedArcRibbon({ motion, paused }: HeroModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const samples = 80;
    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const angle = (u - 0.5) * Math.PI * 1.25;
      const x = Math.sin(angle) * 2.1;
      const y = Math.cos(angle * 0.85) * 0.9 - 0.15;
      const z = Math.sin(angle * 1.7) * 0.7;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const path = new THREE.CatmullRomCurve3(pts);
    const tubularSegments = 140;
    const radialSegments = 24;
    const frames = path.computeFrenetFrames(tubularSegments, false);

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const p = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const vertex = new THREE.Vector3();

    for (let i = 0; i <= tubularSegments; i++) {
      const u = i / tubularSegments;
      path.getPointAt(u, p);
      const N = frames.normals[i];
      const B = frames.binormals[i];

      const taper = Math.sin(Math.PI * u);
      const radiusX = Math.max(0.001, 0.22 * Math.pow(taper, 0.75));
      const radiusY = Math.max(0.001, 0.055 * Math.pow(taper, 0.65));
      const twist = u * Math.PI * 0.85;

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cosV = Math.cos(v + twist);
        const sinV = Math.sin(v + twist);

        normal.set(
          cosV * N.x + sinV * B.x,
          cosV * N.y + sinV * B.y,
          cosV * N.z + sinV * B.z,
        ).normalize();

        vertex.set(
          p.x + radiusX * cosV * N.x + radiusY * sinV * B.x,
          p.y + radiusX * cosV * N.y + radiusY * sinV * B.y,
          p.z + radiusX * cosV * N.z + radiusY * sinV * B.z,
        );

        positions.push(vertex.x, vertex.y, vertex.z);
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(u, j / radialSegments);
      }
    }

    for (let i = 1; i <= tubularSegments; i++) {
      for (let j = 1; j <= radialSegments; j++) {
        const a = (radialSegments + 1) * (i - 1) + (j - 1);
        const b = (radialSegments + 1) * i + (j - 1);
        const c = (radialSegments + 1) * i + j;
        const d = (radialSegments + 1) * (i - 1) + j;
        indices.push(a, b, d, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (paused || !groupRef.current || !meshRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const rotY = motion.pointerX * 0.55 + motion.scroll * Math.PI * 1.15 + Math.sin(t * 0.35) * 0.1;
    const rotX = motion.pointerY * 0.35 - motion.scroll * 0.4 + Math.cos(t * 0.3) * 0.08;

    const smooth = 1 - Math.exp(-6.5 * dt);
    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * smooth;
    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * smooth;
    groupRef.current.position.y = 0.05 - motion.scroll * 1.1 + Math.sin(t * 0.8) * 0.06;

    const pulse = 1 + Math.min(0.09, motion.velocity * 0.06);
    meshRef.current.scale.set(pulse, 1 / Math.sqrt(pulse), pulse);
  });

  return (
    <group ref={groupRef} position={[1.35, 0.05, -0.3]} rotation={[0.18, -0.35, -0.22]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#16141f"
          emissive="#5900ff"
          emissiveIntensity={0.35}
          roughness={0.12}
          metalness={0.78}
          iridescence={0.9}
          iridescenceIOR={1.4}
          clearcoat={1}
          clearcoatRoughness={0.06}
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
