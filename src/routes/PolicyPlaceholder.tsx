import { Link } from 'react-router';

interface PolicyPlaceholderProps {
  title: string;
}

export function PolicyPlaceholder({ title }: PolicyPlaceholderProps) {
  return (
    <main className="min-h-[100dvh] bg-surface text-ink px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link to="/" className="text-xs uppercase tracking-widest text-slate hover:text-ink">
          ← MONZ
        </Link>
        <h1 className="font-display text-5xl uppercase">{title}</h1>
        <p className="text-ink-muted">
          TODO_ANDREA: Draft legal document will be generated in Phase 5 (Compliance) once legal
          identifiers and retention period are confirmed.
        </p>
      </div>
    </main>
  );
}