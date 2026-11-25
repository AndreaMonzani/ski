interface MobileBottomBarProps {
  ctaLabel: string;
  gyroPromptLabel?: string;
  showGyroPrompt?: boolean;
  onGyroClick?: () => void;
}

export function MobileBottomBar({
  ctaLabel,
  gyroPromptLabel,
  showGyroPrompt,
  onGyroClick,
}: MobileBottomBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-surface/90 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'max(10px, var(--safe-bottom))' }}
    >
      {showGyroPrompt && onGyroClick && gyroPromptLabel && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onGyroClick}
            className="min-h-[36px] rounded-full border border-accent-primary/60 bg-surface-elevated px-4 text-xs font-medium text-ink"
          >
            {gyroPromptLabel}
          </button>
        </div>
      )}
      <div className="mx-auto flex max-w-md items-center justify-between gap-2 px-4 pt-2">
        <a
          href="#booking"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-accent-primary px-4 text-sm font-semibold text-ink active:scale-[0.98] transition-transform"
        >
          {ctaLabel}
        </a>
        <a
          href="#phone-reveal"
          aria-label="Call"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-surface-elevated text-xs font-medium text-ink active:scale-[0.98]"
        >
          TEL
        </a>
        <a
          href="#whatsapp-reveal"
          aria-label="WhatsApp"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-surface-elevated text-xs font-medium text-ink active:scale-[0.98]"
        >
          WA
        </a>
      </div>
    </div>
  );
}
