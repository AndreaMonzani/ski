import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../hooks/useI18n';
import { shouldUseWebGL, useMotionState } from '../hooks/useMotionState';
import { Preloader } from '../components/layout/Preloader';
import { MobileBottomBar } from '../components/layout/MobileBottomBar';
import { MethodSection } from '../components/sections/MethodSection';
import { FaqSection } from '../components/sections/FaqSection';
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
        y: 24,
        opacity: 0,
        duration: 0.8,
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
        className="pointer-events-none fixed inset-0 z-[1] css-film-grain opacity-60"
      />

      {webglSupported && mount3D && (
        <Suspense fallback={null}>
          <LazyWebGLScene
            motion={motionState}
            onWebGLError={() => setWebglSupported(false)}
          />
        </Suspense>
      )}

      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-surface/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to={isEn ? '/en/' : '/'} className="font-display text-3xl tracking-wider uppercase">
            MONZ
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest text-slate">
            <a href="#about" className="hover:text-ink transition-colors">{t.nav.links.about}</a>
            <a href="#method" className="hover:text-ink transition-colors">{t.nav.links.method}</a>
            <a href="#services" className="hover:text-ink transition-colors">{t.nav.links.services}</a>
            <a href="#faq" className="hover:text-ink transition-colors">{t.nav.links.faq}</a>
          </nav>
          <div className="flex items-center gap-3">
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

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="flex min-h-[92dvh] flex-col justify-center px-5 pt-28 pb-16 sm:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="hero-reveal font-accent text-xs uppercase tracking-[0.25em] text-slate">
              {t.hero.eyebrow}
            </p>
            <h1 className="hero-reveal mt-4 font-display text-[clamp(5rem,18vw,14rem)] leading-[0.86] tracking-tight uppercase halation-text">
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
              <a
                href="#method"
                className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 bg-surface/50 px-7 text-sm font-medium text-ink hover:border-accent-primary transition-colors"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-white/10 bg-surface/65 backdrop-blur-sm py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
                {t.about.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-5xl sm:text-6xl uppercase leading-[0.94]">
                {t.about.title}
              </h2>
            </div>
            <div className="md:col-span-7 space-y-6">
              {t.about.paragraphs.map((p) => (
                <p key={p} className="text-base sm:text-lg text-ink-muted leading-relaxed">
                  {p}
                </p>
              ))}
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                {t.about.highlights.map((h) => (
                  <div key={h.label} className="rounded-xl border border-white/10 bg-surface-elevated/80 p-4">
                    <p className="text-xs uppercase tracking-widest text-slate">{h.label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{h.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* METHOD: WHISPER / CARV / FRAME.IO */}
        <MethodSection content={t.method} />

        {/* SERVICES */}
        <section id="services" className="border-t border-white/10 bg-surface/65 backdrop-blur-sm py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
              {t.services.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-5xl sm:text-6xl uppercase leading-[0.94]">
              {t.services.title}
            </h2>
            <p className="mt-3 text-sm text-slate">{t.services.rateNote}</p>

            <div className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 -mx-5 px-5 md:mx-0 md:px-0">
              {t.services.items.map((item) => (
                <article
                  key={item.title}
                  className="min-w-[80vw] snap-center md:min-w-0 rounded-2xl border border-white/10 bg-surface-elevated/85 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="font-accent text-[11px] uppercase tracking-[0.2em] text-accent-primary">
                      {item.tag}
                    </span>
                    <h3 className="mt-3 font-display text-3xl uppercase">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted leading-relaxed">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PREMIUM GEAR (BUZZETTI SPORT) */}
        <section id="gear" className="border-t border-white/10 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="rounded-3xl border border-accent-primary/35 bg-surface-elevated/85 p-8 sm:p-12 backdrop-blur-md">
              <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
                {t.gear.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl uppercase leading-[0.95]">
                {t.gear.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base text-ink-muted leading-relaxed">
                {t.gear.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-6">
                {t.gear.partnerUrl ? (
                  <a
                    href={t.gear.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-ink hover:text-accent-primary"
                  >
                    {t.gear.partnerName} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-slate">
                    {t.gear.partnerName} — TODO_ANDREA: URL ufficiale Buzzetti Sport
                  </span>
                )}
                <a
                  href="#booking"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 px-5 text-sm font-medium hover:border-accent-primary transition-colors"
                >
                  {t.gear.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* WHERE I WORK (LOMBARDIA) */}
        <section id="locations" className="border-t border-white/10 bg-surface/65 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
              {t.locations.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl uppercase">{t.locations.title}</h2>
            <p className="mt-4 max-w-2xl text-base text-ink-muted leading-relaxed">
              {t.locations.description}
            </p>
            <p className="mt-6 inline-block rounded-lg border border-white/15 bg-surface-elevated px-4 py-2 text-xs font-mono text-slate">
              {t.locations.todoNote}
            </p>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="border-t border-white/10 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
              {t.gallery.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl uppercase">{t.gallery.title}</h2>
            <div className="mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible -mx-5 px-5 md:mx-0 md:px-0">
              {[1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="min-w-[80vw] snap-center md:min-w-0 aspect-[4/5] rounded-2xl border border-dashed border-white/20 bg-surface-elevated/60 p-6 flex items-end"
                >
                  <span className="text-xs font-mono text-slate">
                    0{slot} · {t.gallery.placeholderCaption}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="process" className="border-t border-white/10 bg-surface/65 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
              {t.process.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl uppercase">{t.process.title}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {t.process.steps.map((step) => (
                <div key={step.number} className="rounded-2xl border border-white/10 bg-surface-elevated/85 p-6">
                  <span className="font-display text-4xl text-accent-primary">{step.number}</span>
                  <h3 className="mt-3 font-accent text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FaqSection content={t.faq} />

        {/* BOOKING PLACEHOLDER (PHASE 4) */}
        <section id="booking" className="border-t border-white/10 bg-surface/80 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
            <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
              {t.bookingPlaceholder.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-5xl sm:text-7xl uppercase">
              {t.bookingPlaceholder.title}
            </h2>
            <p className="mt-4 text-base text-ink-muted">{t.bookingPlaceholder.subtitle}</p>
            <p className="mt-6 inline-block rounded-full border border-accent-primary/50 px-5 py-2 text-xs font-mono text-ink">
              {t.bookingPlaceholder.ctaNote}
            </p>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-surface/90 backdrop-blur-md px-5 py-8 pb-24 md:pb-8 text-xs text-slate sm:px-8">
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
