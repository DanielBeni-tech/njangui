import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendLaunchNotification } from '@/lib/email'

function checkAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === adminSecret
  }
  return false
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { userIds } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'userIds requis' }, { status: 400 })
    }

    const users = await prisma.waitlistUser.findMany({
      where: {
        id: { in: userIds },
        notificationStatus: 'pending',
      },
    })

    const results = {
      total: users.length,
      sent: 0,
      failed: 0,
      skipped: userIds.length - users.length,
    }

    for (const user of users) {
      const result = await sendLaunchNotification(user)
      if (result.success) {
        await prisma.waitlistUser.update({
          where: { id: user.id },
          data: {
            notificationStatus: 'sent',
            notifiedAt: new Date(),
          },
        })
        results.sent++
      } else {
        await prisma.waitlistUser.update({
          where: { id: user.id },
          data: { notificationStatus: 'failed' },
        })
        results.failed++
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Notification trigger error', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
