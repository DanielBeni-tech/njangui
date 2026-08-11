import { NextRequest } from 'next/server'
import { POST } from '@/app/api/waitlist/route'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    waitlistUser: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('POST /api/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset rate limit store
    const store = require('@/app/api/waitlist/route').rateLimitStore as Map<string, any>
    store.clear()
  })

  it('creates a new waitlist user with email', async () => {
    mockPrisma.waitlistUser.create.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      phone: null,
      createdAt: new Date(),
    } as any)

    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Inscription réussie')
    expect(mockPrisma.waitlistUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@example.com',
        preferredNotificationMethod: 'email',
      }),
    })
  })

  it('creates a new waitlist user with phone', async () => {
    mockPrisma.waitlistUser.create.mockResolvedValue({
      id: '456',
      email: null,
      phone: '+237670000001',
      createdAt: new Date(),
    } as any)

    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ phone: '+237670000001' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('Inscription réussie')
    expect(mockPrisma.waitlistUser.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        phone: '+237670000001',
        preferredNotificationMethod: 'phone',
      }),
    })
  })

  it('rejects duplicate email', async () => {
    const error = new Error('Duplicate') as any
    error.code = 'P2002'
    error.meta = { target: ['email'] }
    mockPrisma.waitlistUser.create.mockRejectedValue(error)

    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toContain('déjà inscrit')
  })

  it('rejects invalid email', async () => {
    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ email: 'invalid' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
  })

  it('rejects invalid phone', async () => {
    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({ phone: '123' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
  })

  it('rejects empty body', async () => {
    const request = new NextRequest('http://localhost/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
  })

  it('enforces rate limiting', async () => {
    mockPrisma.waitlistUser.create.mockResolvedValue({
      id: '123',
      email: 'test@example.com',
      phone: null,
      createdAt: new Date(),
    } as any)

    const ip = '192.168.1.1'
    const requests = Array.from({ length: 6 }, () => {
      const headers = new Headers()
      headers.set('x-forwarded-for', ip)
      headers.set('Content-Type', 'application/json')
      return new NextRequest('http://localhost/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
        headers,
      })
    })

    const responses = await Promise.all(requests.map((req) => POST(req)))
    const statuses = await Promise.all(responses.map((r) => r.json().then((d: any) => ({ status: r.status, ...d }))))

    expect(statuses.filter((s) => s.status === 201).length).toBeLessThanOrEqual(5)
    expect(statuses.some((s) => s.status === 429)).toBe(true)
  })
})
