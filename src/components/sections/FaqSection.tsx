import { useState } from 'react';
import type { SiteContent } from '../../content/types';

export function FaqSection({ content }: { content: SiteContent['faq'] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 border-t border-white/10 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="font-accent text-xs uppercase tracking-[0.25em] text-accent-primary">
          {content.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-5xl sm:text-6xl uppercase tracking-tight">
          {content.title}
        </h2>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {content.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="py-5">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex min-h-[44px] w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-base sm:text-lg font-medium text-ink">{item.question}</span>
                  <span className="font-mono text-xl text-accent-primary" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 pr-8 text-sm sm:text-base text-ink-muted leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
