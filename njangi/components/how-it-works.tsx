import { Bell, ListChecks, Settings2, UsersRound } from 'lucide-react'
import { Reveal } from './reveal'

const steps = [
  {
    icon: UsersRound,
    title: 'Créez ou rejoignez',
    text: "Lancez votre tontine en quelques secondes, ou rejoignez celle de vos proches avec un simple code d'invitation.",
  },
  {
    icon: Settings2,
    title: 'Définissez les règles',
    text: 'Montant, fréquence, nombre de membres, ordre de réception aléatoire ou défini : tout est clair dès le départ.',
  },
  {
    icon: ListChecks,
    title: 'Suivez les paiements',
    text: 'Voyez en un coup d’œil qui a cotisé et qui est en retard, et gardez un historique complet accessible à tous.',
  },
  {
    icon: Bell,
    title: 'Restez informés',
    text: 'Notifications automatiques à chaque dépôt, nouveau membre ou retard. Plus personne n’est oublié.',
  },
]

export function HowItWorks() {
  return (
    <section id="etapes" className="bg-muted/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
            Comment ça marche
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Votre tontine bien organisée, en 4 étapes
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-mint/40 text-primary">
                    <s.icon className="size-5" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-mint">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
