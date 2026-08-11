function Badge({ store }: { store: 'play' | 'app' }) {
  return (
    <div
      role="img"
      aria-label={
        store === 'play'
          ? 'Google Play — bientôt disponible'
          : 'App Store — bientôt disponible'
      }
      className="relative inline-flex items-center gap-3 rounded-xl border border-foreground/15 bg-foreground/[0.03] px-4 py-2.5"
    >
      {store === 'play' ? (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <path d="M3.6 2.3 13.4 12 3.6 21.7c-.3-.2-.5-.6-.5-1.1V3.4c0-.5.2-.9.5-1.1Z" fill="#2E8B9A" />
          <path d="M16.9 8.5 5.9 2.3 15 11.1l1.9-2.6Z" fill="#2E9E6E" />
          <path d="M16.9 15.5 15 12.9 5.9 21.7l11-6.2Z" fill="#7B2D8B" />
          <path d="M20.4 11.1c.7.4.7 1.4 0 1.8l-2.4 1.4-2-2.3 2-2.3 2.4 1.4Z" fill="#90EED4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true" fill="currentColor">
          <path d="M16.4 12.7c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2 1 0 1.3-.6 2.5-.6 1.2 0 1.5.6 2.5.6s1.7-.9 2.3-1.9c.7-1 1-2 1-2.1-.1 0-2-.8-2-3.3Zm-2-6c.5-.7.9-1.6.8-2.5-.8 0-1.7.5-2.3 1.2-.5.6-.9 1.5-.8 2.4.9 0 1.8-.5 2.3-1.1Z" />
        </svg>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {store === 'play' ? 'Bientôt sur' : 'Bientôt sur'}
        </span>
        <span className="font-display text-sm font-semibold text-foreground">
          {store === 'play' ? 'Google Play' : "l'App Store"}
        </span>
      </span>
      <span className="ml-1 rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-mint-foreground">
        Bientôt
      </span>
    </div>
  )
}

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ''}`}>
      <Badge store="play" />
      <Badge store="app" />
    </div>
  )
}
