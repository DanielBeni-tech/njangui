'use client'

import { useState, useEffect } from 'react'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || ''

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const session = sessionStorage.getItem('admin_auth')
    if (session === 'true') setAuthenticated(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_SECRET) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthenticated(true)
      setError('')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  if (authenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Administration Njangi</h1>
        <p className="text-sm text-muted-foreground text-center">Accès restreint</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe administrateur"
          className="w-full rounded-xl border border-input bg-card px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:brightness-110 transition"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}
