import { waitlistSchema } from '@/lib/validation'

describe('Waitlist validation', () => {
  it('accepts valid email', () => {
    const result = waitlistSchema.safeParse({ email: 'test@example.com' })
    expect(result.success).toBe(true)
  })

  it('accepts valid Cameroonian phone', () => {
    const result = waitlistSchema.safeParse({ phone: '+237670000001' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid phone format', () => {
    const result = waitlistSchema.safeParse({ phone: '123' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = waitlistSchema.safeParse({ email: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejects empty input', () => {
    const result = waitlistSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects both email and phone missing', () => {
    const result = waitlistSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('accepts optional fields', () => {
    const result = waitlistSchema.safeParse({
      email: 'test@example.com',
      source: 'landing-page',
      device: 'mobile',
    })
    expect(result.success).toBe(true)
  })
})
