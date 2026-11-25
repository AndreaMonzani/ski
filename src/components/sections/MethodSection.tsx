import { useState } from 'react';
import type { MethodTool, SiteContent } from '../../content/types';

function ToolIllustration({ id }: { id: MethodTool['id'] }) {
  if (id === 'whisper') {
    return (
      <svg viewBox="0 0 320 96" className="h-24 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="monzWave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5900FF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8A2BE2" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {[14, 26, 44, 22, 62, 78, 36, 84, 52, 68, 30, 58, 40, 20].map((h, i) => (
          <rect
            key={i}
            x={16 + i * 21}
            y={(96 - h) / 2}
            width="8"
            height={h}
            rx="4"
            fill="url(#monzWave)"
          />
        ))}
      </svg>
    );
  }
  if (id === 'carv') {
    return (
      <svg viewBox="0 0 320 96" className="h-24 w-full" aria-hidden="true">
        <line x1="12" y1="80" x2="308" y2="80" stroke="#8D99AE" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="12" y1="48" x2="308" y2="48" stroke="#8D99AE" strokeOpacity="0.2" strokeDasharray="4 4" />
        <path
          d="M12 72 C 58 68, 72 22, 118 28 C 164 34, 184 74, 228 24 C 258 10, 286 32, 308 18"
          fill="none"
          stroke="#8A2BE2"
          strokeWidth="3"
        />
        <circle cx="118" cy="28" r="4.5" fill="#FFFFFF" />
        <circle cx="228" cy="24" r="4.5" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 96" className="h-24 w-full" aria-hidden="true">
      <rect x="12" y="18" width="296" height="44" rx="8" fill="#17171A" stroke="#8D99AE" strokeOpacity="0.35" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x={20 + i * 41}
          y="26"
          width="33"
          height="28"
          rx="4"
          fill={i === 3 ? '#8A2BE2' : '#26262C'}
          fillOpacity={i === 3 ? 0.65 : 1}
        />
      ))}
      <line x1="160" y1="10" x2="160" y2="82" stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="160" cy="82" r="4" fill="#8A2BE2" />
    </svg>
  );
}

export function MethodSection({ content }: { content: SiteContent['method'] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="method" className="relative z-10 border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
          {content.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-5xl sm:text-7xl uppercase leading-[0.92] tracking-tight">
          {content.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-ink-muted leading-relaxed">
          {content.subtitle}
        </p>

        {/* Desktop interactive selector */}
        <div className="mt-12 hidden md:grid md:grid-cols-12 md:gap-8 items-start">
          <div className="md:col-span-5 space-y-3">
            {content.tools.map((tool, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left rounded-2xl border p-6 transition-all ${
                    active
                      ? 'border-accent-primary bg-surface-elevated/95 shadow-[0_0_32px_rgba(138,43,226,0.2)]'
                      : 'border-white/10 bg-surface/60 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-accent text-xs tracking-[0.2em] text-accent-primary">
                      {tool.index} · {tool.layer}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-4xl uppercase tracking-wide">{tool.name}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{tool.oneLiner}</p>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-7 sticky top-24 rounded-3xl border border-white/15 bg-surface-elevated/90 p-8 backdrop-blur-md">
            {(() => {
              const current = content.tools[activeIndex];
              return (
                <div className="space-y-6">
                  <span className="font-accent text-xs tracking-[0.22em] text-slate">
                    {current.layer}
                  </span>
                  <ToolIllustration id={current.id} />
                  <h3 className="font-display text-6xl uppercase tracking-tight">{current.name}</h3>
                  <p className="text-lg text-ink leading-relaxed">{current.oneLiner}</p>
                  <p className="text-base text-ink-muted leading-relaxed">{current.benefit}</p>
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                    {current.url ? (
                      <a
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-ink hover:text-accent-primary transition-colors"
                      >
                        {content.visitSite} ({current.name}) <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate">{current.urlPlaceholder}</span>
                    )}
                    <span className="text-[11px] text-slate/80">
                      TODO_ANDREA: producer press-kit images, if permitted
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Mobile horizontal swipe cards with CSS scroll-snap */}
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:hidden -mx-5 px-5">
          {content.tools.map((tool) => (
            <article
              key={tool.id}
              className="min-w-[85vw] snap-center rounded-2xl border border-white/15 bg-surface-elevated/95 p-6 space-y-4"
            >
              <span className="font-accent text-[11px] tracking-[0.2em] text-accent-primary">
                {tool.index} · {tool.layer}
              </span>
              <ToolIllustration id={tool.id} />
              <h3 className="font-display text-4xl uppercase">{tool.name}</h3>
              <p className="text-sm text-ink leading-relaxed">{tool.oneLiner}</p>
              <p className="text-sm text-ink-muted leading-relaxed">{tool.benefit}</p>
              {tool.url ? (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-accent-primary"
                >
                  {content.visitSite} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <p className="text-xs font-mono text-slate">{tool.urlPlaceholder}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
