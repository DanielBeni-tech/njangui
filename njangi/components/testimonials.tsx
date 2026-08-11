import { Quote } from 'lucide-react'
import { Reveal } from './reveal'

const testimonials = [
  {
    quote:
      "Dans notre tontine familiale, il y avait toujours quelqu'un pour dire qu'il avait déjà payé. Avec Njangi, tout est écrit noir sur blanc. On se dispute enfin pour de bonnes raisons !",
    name: 'Solange M.',
    role: 'Tontine familiale · Douala',
    initials: 'S',
  },
  {
    quote:
      'On gère la tontine du bureau à douze. Avant, je passais mes soirées à relancer les collègues. Maintenant les rappels partent tout seuls et je vois qui a cotisé en deux secondes.',
    name: 'Yannick T.',
    role: 'Tontine de collègues · Yaoundé',
    initials: 'Y',
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
          Ils organisent déjà leur tontine autrement
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal as="article" key={t.name} delay={i * 120} className="h-full">
            <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7">
              <Quote className="size-8 text-mint" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-pretty text-base leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                  {t.initials}
                </span>
                <span>
                  <span className="block font-display font-semibold text-foreground">{t.name}</span>
                  <span className="block text-sm text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
