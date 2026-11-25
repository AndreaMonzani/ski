import { Link } from 'react-router';
import { useI18n } from '../hooks/useI18n';

export function Home() {
  const t = useI18n();
  const isEn = t.locale === 'en';
  const altLangPath = isEn ? '/' : '/en/';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-surface text-ink">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to={isEn ? '/en/' : '/'} className="font-display text-3xl tracking-wider uppercase">
            MONZ
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/specimen"
              className="text-xs uppercase tracking-widest text-slate hover:text-ink transition-colors"
            >
              {t.nav.specimenLink}
            </Link>
            <Link
              to={altLangPath}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium tracking-wider hover:border-accent-primary transition-colors"
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

      <main className="flex flex-1 flex-col justify-center px-5 pt-28 pb-20 sm:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="font-accent text-xs uppercase tracking-[0.25em] text-slate">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(4.5rem,16vw,13rem)] leading-[0.88] tracking-tight uppercase halation-text">
            {t.hero.headline}
          </h1>
          <p className="mt-6 font-accent text-2xl sm:text-4xl font-bold tracking-tight text-ink">
            {t.hero.tagline}
          </p>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-ink-muted leading-relaxed">
            {t.hero.subcopy}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#booking"
              className="inline-flex min-h-[48px] items-center rounded-full bg-accent-primary px-7 text-sm font-semibold tracking-wide text-ink hover:bg-accent-electric transition-colors"
            >
              {t.hero.primaryCta}
            </a>
            <Link
              to="/specimen"
              className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-7 text-sm font-medium text-ink hover:border-accent-primary transition-colors"
            >
              Compare Font Pairings (Phase 1)
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-5 py-8 text-xs text-slate sm:px-8">
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
    </div>
  );
}