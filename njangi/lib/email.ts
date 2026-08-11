import type { WaitlistUser } from '@prisma/client'

let resendClient: ReturnType<typeof import('resend').Resend> | null = null

function getResendClient() {
  if (!resendClient) {
    const { Resend } = require('resend')
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'Njangi <noreply@njangi.app>'
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://njangi.app'

export async function sendLaunchNotification(user: WaitlistUser) {
  if (!user.email) {
    return { success: false, reason: 'no_email' }
  }

  try {
    const resend = getResendClient()
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: '🎉 Njangi est maintenant disponible !',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Njangi est disponible</title>
            <style>
              body { font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a2e; margin: 0; padding: 0; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
              .card { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              .logo { font-size: 24px; font-weight: 800; color: #7b2d8b; margin-bottom: 24px; }
              h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px 0; color: #1a1a2e; }
              p { font-size: 16px; color: #4a4a5a; margin: 0 0 16px 0; }
              .button { display: inline-block; padding: 14px 32px; background: #7b2d8b; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 24px 0; }
              .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e7ebea; font-size: 14px; color: #6b6f77; }
              .unsubscribe { font-size: 12px; color: #6b6f77; margin-top: 16px; }
              a { color: #7b2d8b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="logo">Njangi</div>
                <h1>Njangi est maintenant disponible !</h1>
                <p>Bonjour,</p>
                <p>Vous aviez rejoint la liste d'attente de Njangi. Aujourd'hui, Njangi est officiellement disponible.</p>
                <p>Découvrez une nouvelle manière de gérer vos tontines avec plus de clarté, de transparence et moins de conflits.</p>
                <p><strong>La tontine, sans conflit.</strong></p>
                <a href="${APP_BASE_URL}" class="button">Découvrir Njangi</a>
                <p>Merci de faire partie des premiers utilisateurs.</p>
                <div class="footer">
                  <p>Vous recevez cet email parce que vous vous êtes inscrit sur la liste d'attente Njangi.</p>
                  <p class="unsubscribe">
                    <a href="${APP_BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}">Se désinscrire</a>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to send email to', user.email, error)
    return { success: false, reason: 'email_error' }
  }
}
