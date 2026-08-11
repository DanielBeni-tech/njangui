import { HeartHandshake, Phone, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { Reveal } from './reveal'

const values = [
  {
    icon: ShieldCheck,
    title: 'Transparence totale',
    text: "Chaque cotisation est tracée et visible par tous les membres. Les comptes ne sont plus une source de doute.",
  },
  {
    icon: Phone,
    title: 'Connexion sécurisée par téléphone',
    text: "Authentification par numéro (+237) et code SMS. Votre compte reste protégé, votre tontine aussi.",
  },
  {
    icon: HeartHandshake,
    title: 'Pensée pour le Cameroun',
    text: 'Cotisations en FCFA, tontines familiales ou entre collègues : Njangi épouse vos habitudes, sans les bousculer.',
  },
]

export function TrustSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/5">
            <Image
              src="/njangi-community.png"
              alt="Un groupe d'amis et de proches réunis autour de leur tontine, souriants et solidaires"
              width={720}
              height={720}
              className="h-full w-full object-cover"
              priority={false}
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">
              La confiance, remise au centre de la tontine
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-primary-foreground/85">
              Njangi ne change pas l&apos;esprit de la tontine : il protège ce qui compte, la confiance
              entre vous. Chacun voit la même chose, au même moment.
            </p>
          </Reveal>

          <ul className="mt-8 space-y-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 90}>
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-mint">
                    <v.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-primary-foreground/80">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
