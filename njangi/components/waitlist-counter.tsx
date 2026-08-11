'use client'

import { useEffect, useState } from 'react'

type CountResponse = { count: number }

export function WaitlistCounter({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchCount() {
      try {
        const res = await fetch('/api/waitlist/count', {
          next: { revalidate: 60 },
        })
        if (!res.ok) throw new Error('Failed')
        const data: CountResponse = await res.json()
        if (mounted) {
          setCount(data.count)
          setLoading(false)
        }
      } catch {
        if (mounted) setLoading(false)
      }
    }

    fetchCount()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <p className={`text-sm text-muted-foreground ${className || ''}`}>
        Déjà des personnes souhaitent découvrir Njangi.
      </p>
    )
  }

  if (count === 0) {
    return (
      <p className={`text-sm text-muted-foreground ${className || ''}`}>
        Soyez parmi les premiers à rejoindre la liste d&apos;attente.
      </p>
    )
  }

  const formatted = new Intl.NumberFormat('fr-FR').format(count)

  return (
    <p className={`text-sm text-muted-foreground ${className || ''}`}>
      Déjà <span className="font-semibold text-foreground">{formatted}</span> personne{count > 1 ? 's' : ''} souhaitent découvrir Njangi.
    </p>
  )
}
