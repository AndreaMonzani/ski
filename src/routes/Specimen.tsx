import { useState } from 'react';
import { Link } from 'react-router';

type PairingKey = 'A' | 'B';

const PAIRINGS: Record<
  PairingKey,
  {
    name: string;
    fonts: string;
    display: string;
    accent: string;
    body: string;
  }
> = {
  A: {
    name: 'Pairing A — Editorial Precision',
    fonts: 'Big Shoulders Display · Syne · Inter',
    display: 'var(--font-display-a)',
    accent: 'var(--font-accent-a)',
    body: 'var(--font-body-a)',
  },
  B: {
    name: 'Pairing B — Cyber-Alpine Brutalist',
    fonts: 'Anton · Unbounded · Geist Sans',
    display: 'var(--font-display-b)',
    accent: 'var(--font-accent-b)',
    body: 'var(--font-body-b)',
  },
};

export function Specimen() {
  const [active, setActive] = useState<PairingKey>('A');
  const p = PAIRINGS[active];

  return (
    <div
      className="min-h-[100dvh] bg-surface text-ink px-5 py-12 sm:px-10"
      style={{ fontFamily: p.body }}
    >
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Link to="/" className="text-xs uppercase tracking-widest text-slate hover:text-ink">
              ← Back to MONZ
            </Link>
            <h1 className="mt-2 text-lg font-semibold">Phase 1 — Live Typography Specimen</h1>
          </div>
          <div className="flex gap-2">
            {(['A', 'B'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`min-h-[44px] rounded-full px-5 text-sm font-medium transition-colors ${
                  active === key
                    ? 'bg-accent-primary text-ink'
                    : 'border border-white/20 text-slate hover:text-ink'
                }`}
              >
                Pairing {key}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-primary">{p.name}</p>
          <p className="text-sm text-slate">{p.fonts}</p>

          <div
            className="pt-4 uppercase leading-[0.88] tracking-tight halation-text"
            style={{ fontFamily: p.display, fontSize: 'clamp(4rem, 14vw, 10rem)', fontWeight: 900 }}
          >
            MONZ / CARVING
          </div>

          <h2
            className="pt-4 text-2xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: p.accent }}
          >
            Sentilo. Misuralo. Vedilo. — Feel it. Measure it. See it.
          </h2>

          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-ink-muted">
            Coaching privato per sciatori avanzati in Lombardia. Durante la discesa ricevi input
            vocali via radio Whisper, misuri ogni curva con la telemetria Carv e rivedi la sessione
            frame-by-frame su Frame.io in giornata.
          </p>
        </section>

        <section className="grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          {['01 / WHISPER', '02 / CARV', '03 / FRAME.IO'].map((label) => (
            <div key={label} className="rounded-xl border border-white/10 bg-surface-elevated p-6">
              <p className="text-xs tracking-[0.2em] text-accent-primary" style={{ fontFamily: p.accent }}>
                {label}
              </p>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                Contrasto WCAG AA verificato su superficie #0F0F0F / #17171A.
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
