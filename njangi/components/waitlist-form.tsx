'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'

export function WaitlistForm({ id, variant = 'light', onSuccess }: { id?: string; variant?: 'light' | 'onColor'; onSuccess?: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate'>('idle')

  function isEmail(input: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())
  }

  function isPhone(input: string) {
    const v = input.trim()
    return /^\+237[0-9]{9}$/.test(v)
  }

  function isValid(input: string) {
    const v = input.trim()
    return isEmail(v) || isPhone(v)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const trimmed = value.trim()

    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value
    if (honeypot) {
      return
    }

    if (!isValid(trimmed)) {
      setError('Entre un numéro (+237XXXXXXXXX) ou un e-mail valide.')
      return
    }

    setError(null)
    setStatus('loading')

    try {
      const isEmailInput = isEmail(trimmed)
      const payload: Record<string, string | null> = {
        email: isEmailInput ? trimmed : null,
        phone: isEmailInput ? null : trimmed,
        countryCode: isEmailInput ? null : '+237',
        preferredNotificationMethod: isEmailInput ? 'email' : 'phone',
        source: 'landing-page',
        device: typeof window !== 'undefined' ? /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop' : undefined,
      }

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.status === 409) {
        setStatus('duplicate')
        setError(data.error)
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setStatus('success')
      setValue('')
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
      setStatus('idle')
    }
  }

  const onColor = variant === 'onColor'

  if (status === 'success') {
    return (
      <div
        className={`flex items-start gap-3 rounded-2xl border p-5 ${
          onColor ? 'border-white/25 bg-white/10 text-white' : 'border-success/30 bg-success/8 text-foreground'
        }`}
      >
        <CheckCircle2 className={`mt-0.5 size-6 shrink-0 ${onColor ? 'text-white' : 'text-success'}`} />
        <div>
          <p className="font-display font-semibold">🎉 C'est noté !</p>
          <p className={`text-sm ${onColor ? 'text-white/85' : 'text-muted-foreground'}`}>
            Vous êtes maintenant sur la liste d'attente Njangi. Nous vous préviendrons dès que l'application sera disponible.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="w-full">
      <div
        className={`flex flex-col gap-2 rounded-2xl border p-2 sm:flex-row sm:items-center ${
          onColor ? 'border-white/25 bg-white/10' : 'border-input bg-card shadow-sm'
        }`}
      >
        <label htmlFor={`${id ?? 'wl'}-input`} className="sr-only">
          Numéro de téléphone ou e-mail
        </label>
        <input
          id={`${id ?? 'wl'}-input`}
          type="text"
          inputMode={status === 'loading' ? 'none' : 'email'}
          autoComplete="email"
          placeholder="+237 6XX XX XX XX ou ton e-mail"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError(null)
          }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id ?? 'wl'}-error` : undefined}
          disabled={status === 'loading'}
          className={`min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-base outline-none placeholder:text-muted-foreground/70 disabled:opacity-70 ${
            onColor ? 'text-white placeholder:text-white/60' : 'text-foreground'
          }`}
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-display font-semibold transition-transform active:scale-[0.98] disabled:opacity-70 ${
            onColor
              ? 'bg-white text-primary hover:bg-white/90'
              : 'bg-success text-success-foreground hover:brightness-105'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Envoi…
            </>
          ) : (
            'Être notifié au lancement'
          )}
        </button>
      </div>
      {error ? (
        <p
          id={`${id ?? 'wl'}-error`}
          role="alert"
          className={`mt-2 px-2 text-sm ${onColor ? 'text-white' : 'text-destructive'}`}
        >
          {error}
        </p>
      ) : (
        <p className={`mt-2 px-2 text-xs ${onColor ? 'text-white/75' : 'text-muted-foreground'}`}>
          Gratuit. Zéro spam — juste un message quand l&apos;app sort.
        </p>
      )}
    </form>
  )
}
