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

  const { geometry, curve } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const samples = 96;
    for (let i = 0; i <= samples; i++) {
      const u = i / samples;
      const angle = (u - 0.5) * Math.PI * 1.35;
      const x = Math.sin(angle) * 2.25;
      const y = Math.cos(angle * 0.9) * 0.85 - 0.15;
      const z = Math.sin(angle * 1.6) * 0.85;
      pts.push(new THREE.Vector3(x, y, z));
    }
    const path = new THREE.CatmullRomCurve3(pts);

    const tubularSegments = 180;
    const radialSegments = 32;
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

      const taper = Math.sin(Math.PI * Math.pow(u, 0.85));
      const radiusX = Math.max(0.002, 0.24 * Math.pow(taper, 0.65));
      const radiusY = Math.max(0.002, 0.065 * Math.pow(taper, 0.55));
      const twist = u * Math.PI * 0.65;

      for (let j = 0; j <= radialSegments; j++) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cosV = Math.cos(v + twist);
        const sinV = Math.sin(v + twist);

        normal.x = cosV * N.x + sinV * B.x;
        normal.y = cosV * N.y + sinV * B.y;
        normal.z = cosV * N.z + sinV * B.z;
        normal.normalize();

        vertex.x = p.x + radiusX * cosV * N.x + radiusY * sinV * B.x;
        vertex.y = p.y + radiusX * cosV * N.y + radiusY * sinV * B.y;
        vertex.z = p.z + radiusX * cosV * N.z + radiusY * sinV * B.z;

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

    return { geometry: geo, curve: path };
  }, []);

  const edgeLineGeo = useMemo(() => {
    const pts = curve.getPoints(160);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [curve]);

  useFrame((state, delta) => {
    if (paused || !groupRef.current || !innerRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const rotY = motion.pointerX * 0.65 + motion.scroll * Math.PI * 1.25 + Math.sin(t * 0.45) * 0.14;
    const rotX = motion.pointerY * 0.42 - motion.scroll * 0.5 + Math.cos(t * 0.35) * 0.1;
    const rotZ = -0.18 + motion.pointerX * 0.12 + Math.sin(t * 0.3) * 0.05;

    const smooth = 1 - Math.exp(-7.5 * dt);
    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * smooth;
    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * smooth;
    groupRef.current.rotation.z += (rotZ - groupRef.current.rotation.z) * smooth;
    groupRef.current.position.y = -motion.scroll * 1.25 + Math.sin(t * 0.85) * 0.07;

    const pulse = 1 + Math.min(0.12, motion.velocity * 0.09);
    innerRef.current.scale.set(pulse, 1 / Math.sqrt(pulse), pulse);
  });

  return (
    <group ref={groupRef} position={[1.05, 0.05, 0]}>
      <mesh ref={innerRef} geometry={geometry}>
        <meshPhysicalMaterial
          color="#d8c7ff"
          emissive="#8a2be2"
          emissiveIntensity={0.62}
          roughness={0.08}
          metalness={0.22}
          transmission={0.78}
          thickness={1.6}
          ior={1.52}
          iridescence={1}
          iridescenceIOR={1.42}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <lineLoop geometry={edgeLineGeo}>
        <lineBasicMaterial color="#b36bff" transparent opacity={0.45} />
      </lineLoop>
    </group>
  );
}

export function HeroModel({ motion, paused }: HeroModelProps) {
  if (VISUAL_CONFIG.heroGlbUrl) {
    return <CarvedArcRibbon motion={motion} paused={paused} />;
  }
  return <CarvedArcRibbon motion={motion} paused={paused} />;
}
