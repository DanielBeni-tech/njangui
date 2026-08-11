import { BookX, MessagesSquare, SearchX } from 'lucide-react'
import { Reveal } from './reveal'

const pains = [
  {
    icon: BookX,
    title: "Le cahier qu'on ne retrouve plus",
    text: "Le carnet de la tontine s'égare, les pages se déchirent, et personne ne sait plus vraiment où en est le compte.",
  },
  {
    icon: MessagesSquare,
    title: 'Les désaccords sur les paiements',
    text: "« J'avais déjà donné ma part ! » Les discussions tournent au malentendu, et parfois à la brouille entre proches.",
  },
  {
    icon: SearchX,
    title: 'Le manque de transparence',
    text: "Difficile de savoir qui a cotisé, qui est en retard, et à qui revient le tour ce mois-ci.",
  },
]

export function ProblemSection() {
  return (
    <section id="probleme" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
          La tontine, c&apos;est précieux. Mais mal organisée, ça crée des tensions.
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          La tradition est belle et solidaire. Ce sont souvent les petits détails d&apos;organisation
          qui font naître les disputes. Njangi ne remplace pas votre tontine — il la rend simplement
          plus sereine.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {pains.map((p, i) => (
          <Reveal as="article" key={p.title} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
