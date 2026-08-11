import { PhoneMockup } from './phone-mockup'
import { Reveal } from './reveal'
import { StoreBadges } from './store-badges'
import { WaitlistForm } from './waitlist-form'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft mint backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-mint/25 via-background to-background"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-20">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <span className="size-2 rounded-full bg-success" />
              Faite au Cameroun, pour vos tontines
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              La tontine, <span className="text-primary">sans conflit</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Fini les malentendus sur qui a payé et qui reçoit. Njangi met tout le monde
              d&apos;accord : des règles claires, un suivi en temps réel et des rappels
              automatiques, pour que votre tontine reste une histoire de confiance.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 max-w-md">
              <WaitlistForm id="wl-hero" />
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Les applications arrivent
              </p>
              <StoreBadges />
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  )
}
