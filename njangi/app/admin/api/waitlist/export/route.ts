import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === adminSecret
  }
  return false
}

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const users = await prisma.waitlistUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        phone: true,
        countryCode: true,
        preferredNotificationMethod: true,
        source: true,
        notificationStatus: true,
        notifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const headers = [
      'ID',
      'Email',
      'Phone',
      'Country Code',
      'Notification Method',
      'Source',
      'Status',
      'Notified At',
      'Created At',
      'Updated At',
    ]

    const rows = users.map((u) => [
      u.id,
      u.email || '',
      u.phone || '',
      u.countryCode || '',
      u.preferredNotificationMethod || '',
      u.source || '',
      u.notificationStatus || '',
      u.notifiedAt?.toISOString() || '',
      u.createdAt.toISOString(),
      u.updatedAt.toISOString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="waitlist-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
