import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { waitlistSchema } from '@/lib/validation'

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 5

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

function extractUtmParams(searchParams: URLSearchParams) {
  return {
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Veuillez réessayer dans un instant.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const parsed = waitlistSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message).join(', ')
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const { email, phone, countryCode, preferredNotificationMethod, source, device, utmSource, utmMedium, utmCampaign, referralCode } = parsed.data

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Veuillez fournir un email ou un numéro de téléphone.' },
        { status: 400 }
      )
    }

    const url = new URL(request.url)
    const utm = extractUtmParams(url.searchParams)

    let user
    try {
      user = await prisma.waitlistUser.create({
        data: {
          email: email?.toLowerCase().trim() || undefined,
          phone: phone?.trim() || undefined,
          countryCode: countryCode?.trim() || undefined,
          preferredNotificationMethod: preferredNotificationMethod || (email ? 'email' : 'phone'),
          source: source?.trim() || 'landing-page',
          device: device?.trim() || undefined,
          utmSource: utm.utmSource,
          utmMedium: utm.utmMedium,
          utmCampaign: utm.utmCampaign,
          referralCode: referralCode?.trim() || undefined,
        },
      })
    } catch (error: any) {
      if (error.code === 'P2002') {
        const target = error.meta?.target?.[0]
        if (target === 'email') {
          return NextResponse.json(
            { error: 'Vous êtes déjà inscrit à la liste d\'attente Njangi. Nous vous préviendrons dès le lancement.' },
            { status: 409 }
          )
        }
        if (target === 'phone') {
          return NextResponse.json(
            { error: 'Vous êtes déjà inscrit à la liste d\'attente Njangi. Nous vous préviendrons dès le lancement.' },
            { status: 409 }
          )
        }
      }
      throw error
    }

    return NextResponse.json(
      {
        message: 'Inscription réussie',
        id: user.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist submission error', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
