import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { VISUAL_CONFIG } from '../config/visuals';
import type { MotionInput } from '../hooks/useMotionState';

interface HeroModelProps {
  motion: MotionInput;
  paused: boolean;
}

const HERO_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uVelocity;

  varying vec3 vNormalWorld;
  varying vec3 vViewDir;
  varying float vDisplacement;

  void main() {
    vec3 pos = position;

    // Kinetic carving ripple driven by time & pointer velocity
    float wave = sin(pos.x * 3.2 + uTime * 1.4) * cos(pos.y * 2.8 - uTime * 1.1);
    float disp = wave * (0.045 + uVelocity * 0.09);
    pos += normal * disp;
    vDisplacement = disp;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const HERO_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2 uPointer;
  uniform float uVelocity;
  uniform float uScroll;

  varying vec3 vNormalWorld;
  varying vec3 vViewDir;
  varying float vDisplacement;

  void main() {
    vec3 N = normalize(vNormalWorld);
    vec3 V = normalize(vViewDir);

    // Key light tracks the mouse cursor for responsive metallic-glass reflections
    vec3 L1 = normalize(vec3(uPointer.x * 2.4 + 0.6, uPointer.y * 2.0 + 0.9, 1.8));
    vec3 L2 = normalize(vec3(-1.4, -0.8, 1.0));

    vec3 H1 = normalize(L1 + V);
    vec3 H2 = normalize(L2 + V);

    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fresnel = pow(1.0 - ndv, 3.0);
    float spec1 = pow(max(dot(N, H1), 0.0), 72.0);
    float spec2 = pow(max(dot(N, H2), 0.0), 28.0);

    // Chromatic aberration bands along the Fresnel rim
    float rimR = pow(1.0 - clamp(dot(N, V) - 0.04, 0.0, 1.0), 3.2);
    float rimG = fresnel;
    float rimB = pow(1.0 - clamp(dot(N, V) + 0.04, 0.0, 1.0), 2.6);

    vec3 obsidian = vec3(0.055, 0.045, 0.085);
    vec3 purple = vec3(0.541, 0.169, 0.886);
    vec3 electric = vec3(0.349, 0.0, 1.0);
    vec3 iceWhite = vec3(0.96, 0.94, 1.0);

    // Dark reflective core + chromatic liquid-glass rim
    vec3 rimColor = vec3(rimR * 0.9, rimG * 0.28, rimB * 1.0) * (1.15 + uVelocity * 0.45);
    vec3 envRefl = mix(electric, purple, clamp(N.y * 0.5 + 0.5 + uScroll * 0.3, 0.0, 1.0));

    vec3 color = obsidian;
    color += envRefl * (0.22 + fresnel * 0.55);
    color += rimColor * 0.85;
    color += iceWhite * spec1 * 1.35;
    color += purple * spec2 * 0.65;
    color += vec3(0.25, 0.05, 0.45) * max(vDisplacement * 4.0, 0.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Concept A — The Carved Arc: sleek sculptural twisted ribbon with custom
 * obsidian-chrome / refractive GLSL shader reacting directly to pointer & scroll.
 */
function CarvedArcSculpture({ motion, paused }: HeroModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    return new THREE.TorusKnotGeometry(1.02, 0.19, 220, 48, 2, 3);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uVelocity: { value: 0 },
      uScroll: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (paused || !groupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    uniforms.uTime.value = t;
    uniforms.uPointer.value.set(motion.pointerX, motion.pointerY);
    uniforms.uVelocity.value = motion.velocity;
    uniforms.uScroll.value = motion.scroll;

    const rotY = t * 0.18 + motion.pointerX * 0.85 + motion.scroll * Math.PI * 1.4;
    const rotX = 0.22 + motion.pointerY * 0.55 - motion.scroll * 0.45;
    const smooth = 1 - Math.exp(-7 * dt);

    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * smooth;
    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * smooth;
    groupRef.current.position.x = 1.35 + motion.pointerX * 0.22;
    groupRef.current.position.y = 0.04 - motion.scroll * 0.9 + motion.pointerY * 0.18;
  });

  return (
    <group ref={groupRef} position={[1.35, 0.04, -0.35]}>
      <mesh geometry={geometry}>
        <shaderMaterial
          vertexShader={HERO_VERTEX_SHADER}
          fragmentShader={HERO_FRAGMENT_SHADER}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  );
}

export function HeroModel({ motion, paused }: HeroModelProps) {
  if (VISUAL_CONFIG.heroGlbUrl) {
    return <CarvedArcSculpture motion={motion} paused={paused} />;
  }
  return <CarvedArcSculpture motion={motion} paused={paused} />;
}
