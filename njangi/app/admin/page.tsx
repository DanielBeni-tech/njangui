'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Trash2, Send, Search, Users, Mail, Phone, CheckCircle2, XCircle, Clock } from 'lucide-react'

type User = {
  id: string
  email: string | null
  phone: string | null
  countryCode: string | null
  preferredNotificationMethod: string | null
  source: string | null
  notificationStatus: string
  notifiedAt: string | null
  createdAt: string
  updatedAt: string
}

type Stats = {
  notificationStatus: { _count: { id: number }; notificationStatus: string }[]
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [notifying, setNotifying] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<Stats | null>(null)

  const limit = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        status: statusFilter,
      })

      const res = await fetch(`/api/admin/waitlist?${params}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
      })

      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      setStats({ notificationStatus: data.stats })
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/admin/waitlist/export', {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `waitlist-export-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export failed', error)
    }
  }

  async function handleNotify() {
    if (!confirm(`Vous êtes sur le point d'envoyer une notification à ${selectedIds.size} personnes. Continuer ?`)) return
    setNotifying(true)
    try {
      const res = await fetch('/api/admin/waitlist/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
        body: JSON.stringify({ userIds: Array.from(selectedIds) }),
      })
      const data = await res.json()
      alert(`Notification envoyée à ${data.sent} personnes. ${data.failed} échecs. ${data.skipped} ignorés.`)
      setSelectedIds(new Set())
      fetchUsers()
    } catch (error) {
      console.error('Notification failed', error)
    } finally {
      setNotifying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="size-4 text-success" />
      case 'failed':
        return <XCircle className="size-4 text-destructive" />
      case 'pending':
        return <Clock className="size-4 text-muted-foreground" />
      default:
        return <Clock className="size-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Envoyé'
      case 'failed':
        return 'Échoué'
      case 'pending':
        return 'En attente'
      case 'bounced':
        return 'Rebondi'
      case 'unsubscribed':
        return 'Désinscrit'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display">Dashboard Waitlist</h1>
          <p className="mt-2 text-muted-foreground">Gérez les inscriptions et les notifications de lancement.</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total inscrits</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <Mail className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emails</p>
                <p className="text-2xl font-bold">
                  {stats?.notificationStatus.find((s) => s.notificationStatus === 'sent')?._count.id || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-accent/10 p-3">
                <Phone className="size-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Téléphones</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.phone && !u.email).length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-mint/20 p-3">
                <Clock className="size-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">
                  {stats?.notificationStatus.find((s) => s.notificationStatus === 'pending')?._count.id || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    placeholder="Rechercher email ou téléphone..."
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="sent">Envoyé</option>
                  <option value="failed">Échoué</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition"
                >
                  <Download className="size-4" />
                  Exporter CSV
                </button>
                <button
                  onClick={handleNotify}
                  disabled={selectedIds.size === 0 || notifying}
                  className="inline-flex items-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-medium text-success-foreground hover:brightness-110 transition disabled:opacity-50"
                >
                  <Send className="size-4" />
                  {notifying ? 'Envoi...' : `Notifier (${selectedIds.size})`}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === users.length && users.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-input"
                    />
                  </th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Téléphone</th>
                  <th className="p-4 font-medium">Méthode</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Chargement...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(user.id)}
                          onChange={() => toggleSelect(user.id)}
                          className="rounded border-input"
                        />
                      </td>
                      <td className="p-4">{user.email || '-'}</td>
                      <td className="p-4">{user.phone || '-'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {user.preferredNotificationMethod === 'email' ? (
                            <><Mail className="size-3" /> Email</>
                          ) : (
                            <><Phone className="size-3" /> Phone</>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.source || '-'}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.notificationStatus === 'sent'
                            ? 'bg-success/10 text-success'
                            : user.notificationStatus === 'failed'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {getStatusIcon(user.notificationStatus)}
                          {getStatusLabel(user.notificationStatus)}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                          title="Supprimer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
