'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from './reveal'

const faqs = [
  {
    q: 'Njangi est-il gratuit ?',
    a: "Oui, vous pouvez créer et gérer votre tontine gratuitement. Notre objectif est d'abord d'aider les groupes à s'organiser sereinement.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "La connexion se fait par votre numéro de téléphone (+237) et un code reçu par SMS. Vos informations de tontine ne sont visibles que par les membres que vous invitez.",
  },
  {
    q: 'Puis-je gérer plusieurs tontines à la fois ?',
    a: "Bien sûr. Vous pouvez participer à plusieurs tontines en même temps — la familiale, celle des collègues, celle du quartier — et basculer de l'une à l'autre facilement.",
  },
  {
    q: 'Le paiement Mobile Money est-il intégré ?',
    a: "Pas encore. Aujourd'hui, Njangi vous aide à organiser et suivre les cotisations ; les paiements se font comme d'habitude entre vous. Le paiement Mobile Money (MTN MoMo, Orange Money) est en cours de développement.",
  },
  {
    q: 'Comment inviter des membres ?',
    a: "Chaque tontine dispose d'un code d'invitation unique. Il vous suffit de le partager avec vos proches : ils rejoignent le groupe en quelques secondes.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-base font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-primary transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="bg-muted/60">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <Reveal className="text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Les questions que vous vous posez
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 70}>
              <FaqItem q={f.q} a={f.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
