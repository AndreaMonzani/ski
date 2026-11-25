import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { shouldUseWebGL, useMotionState } from '../hooks/useMotionState';
import { Preloader } from '../components/layout/Preloader';
import { MobileBottomBar } from '../components/layout/MobileBottomBar';
import { VISUAL_CONFIG } from '../config/visuals';

gsap.registerPlugin(ScrollTrigger);

const LazyWebGLScene = lazy(() =>
  import('../gl/Scene').then((mod) => ({ default: mod.Scene })),
);

export function Home() {
  const t = useI18n();
  const isEn = t.locale === 'en';
  const altLangPath = isEn ? '/' : '/en/';
  const containerRef = useRef<HTMLDivElement>(null);

  const motionState = useMotionState();
  const [webglSupported, setWebglSupported] = useState(false);
  const [mount3D, setMount3D] = useState(false);

  useEffect(() => {
    const supported = shouldUseWebGL();
    setWebglSupported(supported);
    if (!supported) return;

    const winIdle = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    let idleId: number | undefined;
    let fallbackTimer: number | undefined;

    if (typeof winIdle.requestIdleCallback === 'function') {
      idleId = winIdle.requestIdleCallback(() => setMount3D(true), { timeout: 1200 });
    } else {
      fallbackTimer = window.setTimeout(() => setMount3D(true), 250);
    }

    return () => {
      if (idleId !== undefined && typeof winIdle.cancelIdleCallback === 'function') {
        winIdle.cancelIdleCallback(idleId);
      }
      if (fallbackTimer !== undefined) {
        clearTimeout(fallbackTimer);
      }
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;

    let lenis: Lenis | null = null;
    if (!reduced && isDesktop) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from('.hero-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    }, containerRef);

    return () => {
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

  const showStaticFallback = !webglSupported || !mount3D;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col bg-surface text-ink overflow-x-clip"
    >
      <Preloader />

      {showStaticFallback && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 fallback-liquid-bg"
        />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] css-film-grain opacity-70"
      />

      {webglSupported && mount3D && (
        <Suspense fallback={null}>
          <LazyWebGLScene
            motion={motionState}
            onWebGLError={() => setWebglSupported(false)}
          />
        </Suspense>
      )}

      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-surface/65 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to={isEn ? '/en/' : '/'} className="font-display text-3xl tracking-wider uppercase">
            MONZ
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/specimen"
              className="text-xs uppercase tracking-widest text-slate hover:text-ink transition-colors"
            >
              {t.nav.specimenLink}
            </Link>
            <Link
              to={altLangPath}
              className="min-h-[36px] inline-flex items-center rounded-full border border-white/15 px-3 text-xs font-medium tracking-wider hover:border-accent-primary transition-colors"
            >
              {t.nav.switchLang}
            </Link>
            <a
              href="#booking"
              className="hidden sm:inline-flex min-h-[44px] items-center rounded-full bg-accent-primary px-5 text-sm font-medium text-ink hover:bg-accent-electric transition-colors"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col justify-center px-5 pt-28 pb-28 sm:px-8 md:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <p className="hero-reveal font-accent text-xs uppercase tracking-[0.25em] text-slate">
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-reveal mt-4 font-display text-[clamp(4.5rem,16vw,13rem)] leading-[0.88] tracking-tight uppercase halation-text">
            {t.hero.headline}
          </h1>

          {VISUAL_CONFIG.heroCutoutImageUrl && (
            <img
              src={VISUAL_CONFIG.heroCutoutImageUrl}
              alt="Andrea Monzani"
              loading="lazy"
              className="pointer-events-none select-none"
            />
          )}

          <p className="hero-reveal mt-6 font-accent text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            {t.hero.tagline}
          </p>
          <p className="hero-reveal mt-4 max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed">
            {t.hero.subcopy}
          </p>
          <div className="hero-reveal mt-10 flex flex-wrap gap-4">
            <a
              href="#booking"
              className="inline-flex min-h-[48px] items-center rounded-full bg-accent-primary px-7 text-sm font-semibold tracking-wide text-ink hover:bg-accent-electric transition-colors"
            >
              {t.hero.primaryCta}
            </a>
            <Link
              to="/specimen"
              className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-surface/50 px-7 text-sm font-medium text-ink hover:border-accent-primary transition-colors"
            >
              {t.nav.specimenLink}
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-surface/80 backdrop-blur-md px-5 py-8 pb-24 md:pb-8 text-xs text-slate sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights}</p>
          <nav className="flex gap-6">
            <Link to={isEn ? '/en/privacy' : '/privacy'} className="hover:text-ink">
              {t.footer.privacy}
            </Link>
            <Link to={isEn ? '/en/cookie' : '/cookie'} className="hover:text-ink">
              {t.footer.cookie}
            </Link>
            <Link to={isEn ? '/en/legal-notice' : '/note-legali'} className="hover:text-ink">
              {t.footer.legal}
            </Link>
          </nav>
        </div>
      </footer>

      <MobileBottomBar
        ctaLabel={t.nav.cta}
        gyroPromptLabel={isEn ? 'Enable motion' : 'Attiva giroscopio'}
        showGyroPrompt={motionState.needsGyroPrompt}
        onGyroClick={motionState.requestGyro}
      />
    </div>
  );
}
