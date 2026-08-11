import { Reveal } from './reveal'
import { StoreBadges } from './store-badges'
import { WaitlistForm } from './waitlist-form'

export function FinalCta() {
  return (
    <section id="liste-attente" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-4xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-mint/20 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-accent/25 blur-2xl"
          />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">
              Soyez les premiers à vivre la tontine sans conflit
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/85">
              Laissez votre numéro ou votre e-mail. On vous prévient dès que Njangi arrive sur
              votre téléphone.
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <WaitlistForm id="wl-final" variant="onColor" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                Applications en préparation
              </p>
              <StoreBadges className="justify-center" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
