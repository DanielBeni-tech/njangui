'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NjangiLogo } from './njangi-logo'

const links = [
  { href: '#probleme', label: 'Le problème' },
  { href: '#etapes', label: 'Comment ça marche' },
  { href: '#fonctionnalites', label: 'Fonctionnalités' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <NjangiLogo className="size-9" />
          <span className="font-display text-xl font-bold text-primary">Njangi</span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#liste-attente"
          className="hidden rounded-xl bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:brightness-110 active:scale-[0.98] md:inline-flex"
        >
          Rejoindre la liste d&apos;attente
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav aria-label="Navigation mobile" className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#liste-attente"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-primary px-4 py-3 text-center font-display text-sm font-semibold text-primary-foreground"
            >
              Rejoindre la liste d&apos;attente
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
