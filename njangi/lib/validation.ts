import { z } from 'zod'

export const waitlistSchema = z.object({
  email: z.string().email('Email invalide').optional().nullable(),
  phone: z
    .string()
    .regex(/^\+237[0-9]{9}$/, 'Format attendu : +237XXXXXXXXX')
    .optional()
    .nullable(),
  countryCode: z.string().optional().nullable(),
  preferredNotificationMethod: z.enum(['email', 'phone']).optional().nullable(),
  source: z.string().max(100).optional().nullable(),
  device: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  referralCode: z.string().optional().nullable(),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>
