import { Bell, CalendarClock, Eye, History, KeyRound, SlidersHorizontal } from 'lucide-react'
import { Reveal } from './reveal'

const features = [
  {
    icon: SlidersHorizontal,
    title: 'Règles claires et personnalisables',
    text: 'Montant, fréquence, ordre de réception, nombre de membres. Vous fixez les règles, tout le monde les voit.',
  },
  {
    icon: KeyRound,
    title: "Code d'invitation sécurisé",
    text: 'Chaque tontine a son code unique. Vous invitez uniquement les personnes de confiance, personne d’autre.',
  },
  {
    icon: Eye,
    title: 'Suivi des statuts en un coup d’œil',
    text: 'Payé, en attente, en retard : la situation de chaque membre est visible et mise à jour en temps réel.',
  },
  {
    icon: Bell,
    title: 'Notifications automatiques',
    text: 'Nouveau membre, dépôt reçu, retard de cotisation : chacun est prévenu au bon moment, sans relance gênante.',
  },
  {
    icon: History,
    title: 'Historique transparent',
    text: 'Toutes les cotisations sont enregistrées et consultables par l’ensemble des membres. Aucune ambiguïté.',
  },
  {
    icon: CalendarClock,
    title: 'Tours et échéances suivis',
    text: 'Sachez toujours à qui revient le tour et quand tombe la prochaine échéance de la tontine.',
  },
]

export function Features() {
  return (
    <section id="fonctionnalites" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
          Fonctionnalités clés
        </span>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
          Tout ce qu&apos;il faut pour une tontine sereine
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal as="article" key={f.title} delay={(i % 3) * 90} className="h-full">
            <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
