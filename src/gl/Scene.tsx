import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { LiquidBackground } from './LiquidBackground';
import { HeroModel } from './HeroModel';
import { getInitialDpr, type MotionInput } from '../hooks/useMotionState';
import { VISUAL_CONFIG } from '../config/visuals';

interface SceneProps {
  motion: MotionInput;
  onWebGLError: () => void;
}

export function Scene({ motion, onWebGLError }: SceneProps) {
  const [dpr, setDpr] = useState(() => getInitialDpr(motion.isTouch));
  const [tabHidden, setTabHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const frameSamplesRef = useRef<number[]>([]);
  const lastFrameRef = useRef<number>(performance.now());

  useEffect(() => {
    setDpr(getInitialDpr(motion.isTouch));
  }, [motion.isTouch]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting || window.scrollY < window.innerHeight * 2);
      },
      { threshold: 0.01 },
    );
    io.observe(document.documentElement);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
    };
  }, []);

  const paused = tabHidden || !inView;

  const sampleFrameCost = () => {
    const now = performance.now();
    const cost = now - lastFrameRef.current;
    lastFrameRef.current = now;
    if (paused || cost <= 0) return;

    const samples = frameSamplesRef.current;
    samples.push(cost);
    if (samples.length >= 30) {
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      samples.length = 0;
      const cap = motion.isTouch ? VISUAL_CONFIG.mobileDprCap : VISUAL_CONFIG.desktopDprCap;
      if (avg > VISUAL_CONFIG.targetFrameMs && dpr > 0.75) {
        setDpr((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
      } else if (avg < VISUAL_CONFIG.targetFrameMs * 0.65 && dpr < cap) {
        setDpr((prev) => Math.min(cap, Number((prev + 0.15).toFixed(2))));
      }
    }
  };

  return (
    <div
      aria-hidden="true"
      className="monz-gl-layer"
      onPointerMove={sampleFrameCost}
    >
      <Canvas
        dpr={dpr}
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [0, 0, 5.2], fov: 42, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault();
              onWebGLError();
            },
            false,
          );
        }}
      >
        <ambientLight intensity={0.5} color="#c8b6ff" />
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={3.5} color="#8a2be2" />
        <pointLight position={[3, 2, -2]} intensity={2.5} color="#5900ff" />

        <LiquidBackground motion={motion} paused={paused} />
        <HeroModel motion={motion} paused={paused} />
      </Canvas>
    </div>
  );
}