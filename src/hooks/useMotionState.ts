import { useEffect, useRef, useState } from 'react';
import { VISUAL_CONFIG } from '../config/visuals';

export interface MotionInput {
  pointerX: number;
  pointerY: number;
  velocity: number;
  scroll: number;
  isTouch: boolean;
  gyroAllowed: boolean;
  needsGyroPrompt: boolean;
  requestGyro: () => Promise<void>;
}

export function useMotionState(): MotionInput {
  const stateRef = useRef({
    targetX: 0,
    targetY: 0,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    velocity: 0,
    scroll: 0,
  });

  const [snapshot, setSnapshot] = useState({
    pointerX: 0,
    pointerY: 0,
    velocity: 0,
    scroll: 0,
  });

  const [isTouch, setIsTouch] = useState(false);
  const [gyroAllowed, setGyroAllowed] = useState(false);
  const [needsGyroPrompt, setNeedsGyroPrompt] = useState(false);
  const interactedRef = useRef(false);

  useEffect(() => {
    const touchCapable =
      window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouch(touchCapable);

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      stateRef.current.scroll = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      stateRef.current.targetX = nx;
      stateRef.current.targetY = ny;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!interactedRef.current) {
        interactedRef.current = true;
        const winWithOrientation = window as unknown as {
          DeviceOrientationEvent?: {
            requestPermission?: () => Promise<'granted' | 'denied'>;
          };
        };
        if (typeof winWithOrientation.DeviceOrientationEvent?.requestPermission === 'function') {
          setNeedsGyroPrompt(true);
        }
      }
      if (e.touches[0]) {
        stateRef.current.prevX = e.touches[0].clientX;
        stateRef.current.prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (gyroAllowed || !e.touches[0]) return;
      const t = e.touches[0];
      const dx = (t.clientX - stateRef.current.prevX) / Math.max(1, window.innerWidth);
      const dy = (t.clientY - stateRef.current.prevY) / Math.max(1, window.innerHeight);
      stateRef.current.prevX = t.clientX;
      stateRef.current.prevY = t.clientY;
      stateRef.current.targetX = Math.max(-1, Math.min(1, stateRef.current.targetX + dx * 2.5));
      stateRef.current.targetY = Math.max(-1, Math.min(1, stateRef.current.targetY - dy * 2.5));
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      const gx = Math.max(-1, Math.min(1, e.gamma / 30));
      const gy = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      stateRef.current.targetX = gx;
      stateRef.current.targetY = gy;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });

    let rafId = 0;
    let lastTick = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTick) / 1000);
      lastTick = now;

      const s = stateRef.current;
      const driftX = Math.sin(now * 0.00045) * 0.22;
      const driftY = Math.cos(now * 0.00038) * 0.16;

      const goalX = touchCapable && !gyroAllowed ? s.targetX * 0.7 + driftX : s.targetX;
      const goalY = touchCapable && !gyroAllowed ? s.targetY * 0.7 + driftY : s.targetY;

      const lerpFactor = 1 - Math.exp(-7 * dt);
      const nextX = s.x + (goalX - s.x) * lerpFactor;
      const nextY = s.y + (goalY - s.y) * lerpFactor;

      const speed = Math.hypot(nextX - s.x, nextY - s.y) / Math.max(0.004, dt);
      s.velocity = s.velocity * 0.85 + Math.min(1.5, speed * 0.12) * 0.15;
      s.x = nextX;
      s.y = nextY;

      setSnapshot({
        pointerX: s.x,
        pointerY: s.y,
        velocity: s.velocity,
        scroll: s.scroll,
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
    };
  }, [gyroAllowed]);

  const requestGyro = async () => {
    const winWithOrientation = window as unknown as {
      DeviceOrientationEvent?: {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
    };
    const req = winWithOrientation.DeviceOrientationEvent?.requestPermission;
    if (typeof req === 'function') {
      try {
        const res = await req();
        setGyroAllowed(res === 'granted');
      } catch {
        setGyroAllowed(false);
      }
    } else {
      setGyroAllowed(true);
    }
    setNeedsGyroPrompt(false);
  };

  return {
    ...snapshot,
    isTouch,
    gyroAllowed,
    needsGyroPrompt,
    requestGyro,
  };
}

export function shouldUseWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData =
    (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  if (reduced || saveData) return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function getInitialDpr(isMobile: boolean): number {
  const raw = window.devicePixelRatio || 1;
  return Math.min(raw, isMobile ? VISUAL_CONFIG.mobileDprCap : VISUAL_CONFIG.desktopDprCap);
}
