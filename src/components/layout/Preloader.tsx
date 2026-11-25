import { useEffect, useState } from 'react';

export function Preloader() {
  const [progress, setProgress] = useState(12);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setProgress(100);
      setDismissed(true);
      return;
    }

    const timer1 = window.setTimeout(() => setProgress(64), 80);
    const timer2 = window.setTimeout(() => setProgress(100), 220);
    const timer3 = window.setTimeout(() => setDismissed(true), 460);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface transition-opacity duration-300 ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="font-display text-6xl tracking-widest uppercase text-ink halation-text">
        MONZ
      </span>
      <div className="mt-4 h-[2px] w-40 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full bg-accent-primary transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-2 font-accent text-xs tracking-widest text-slate">{progress}%</span>
    </div>
  );
}
