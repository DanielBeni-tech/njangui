import { NjangiLogo } from './njangi-logo'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.3-1.3 1.4-1.3h1.4V5.9c-.7-.1-1.4-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4V14H11v7h2.5Z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6.1L5.7 21H2.6l7-8-6.8-10h6.1l4.2 5.6L17.5 3Zm-1 16h1.7L7.6 4.8H5.8L16.5 19Z" />
    </svg>
  )
}

const columns = [
  {
    title: 'Njangi',
    links: [
      { label: 'À propos', href: '#top' },
      { label: 'Comment ça marche', href: '#etapes' },
      { label: 'Fonctionnalités', href: '#fonctionnalites' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#liste-attente' },
      { label: 'Mentions légales', href: '#' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <NjangiLogo className="size-9" />
              <span className="font-display text-xl font-bold text-primary">Njangi</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              La tontine, sans conflit. L&apos;application camerounaise qui remet la transparence et la
              confiance au cœur de vos tontines.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { Icon: FacebookIcon, label: 'Facebook' },
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: XIcon, label: 'X (Twitter)' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Njangi. Tous droits réservés.</p>
          <p>Fait avec soin au Cameroun 🇨🇲</p>
        </div>
      </div>
    </footer>
  )
}
